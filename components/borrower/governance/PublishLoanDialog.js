import {
    useAccount,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import addresses from "../../../constants/contract.json";
import governorAbi from "../../../constants/LoanGovernor.json";
import lendPoolAbi from "../../../constants/LendPool.json";
import { ethers } from "ethers";
import { parseUnits } from "ethers/lib/utils.js";
import {
    SUPABASE_TABLE_LOAN_PROPOSALS,
    SUPABASE_TABLE_LOAN_PROPOSALS_STATUS,
} from "../../../utils/Constants";
import { useEffect, useState } from "react";
import useIsMounted from "../../../hooks/useIsMounted";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { RocketLaunchIcon } from "@heroicons/react/24/solid";
import DialogComponent from "../../ui/DialogComponent";
import { findEvent, saveEvent } from "../../../utils/Events";

export default function PublishLoanDialog({ loanProposal, onPublishSuccess }) {
    const [publishModalOpen, setPublishModalOpen] = useState();
    const isMounted = useIsMounted();

    const supabase = useSupabaseClient();
    const user = useUser();

    const [dbError, setDbError] = useState(false);

    const { address, isConnected } = useAccount();
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
    const governorAddress = addresses[chainId].LoanGovernor;
    const lendPoolAddress = addresses[chainId].LendPool;
    const governorFunctionName = "propose";

    let borrowTokenAddress;
    let borrowTokenDecimals;
    let recipientAddress;

    if (loanProposal.payout_mode === "crypto") {
        borrowTokenAddress = loanProposal.payout_data?.payoutToken?.address;
        borrowTokenDecimals = loanProposal.payout_data?.payoutToken?.decimals;
        recipientAddress = loanProposal.payout_data?.walletAddress;
    } else if (loanProposal.payout_mode === "fiat") {
        borrowTokenAddress = loanProposal.payout_data?.fiatPayoutToken?.address;
        borrowTokenDecimals = loanProposal.payout_data?.fiatPayoutToken?.decimals;
        recipientAddress = loanProposal.payout_data?.fiatToCryptoWalletAddress;
    }

    const proposeFunctionName = "borrow";
    const proposeFunctionArgs = [
        borrowTokenAddress,
        parseUnits(String(loanProposal.amount), borrowTokenDecimals),
        recipientAddress,
    ];
    const proposeDescription = `@@Borrow Proposal {{${loanProposal.id}}}@@`;

    const [encodedFunctionCall, setEncodedFunctionCall] = useState();

    useEffect(() => {
        if (!encodedFunctionCall) {
            const lendPoolIface = new ethers.utils.Interface(lendPoolAbi);
            setEncodedFunctionCall(
                lendPoolIface.encodeFunctionData(proposeFunctionName, proposeFunctionArgs)
            );
        }
    }, []);

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: governorAddress,
        abi: governorAbi,
        functionName: governorFunctionName,
        enabled: encodedFunctionCall,
        args: [[lendPoolAddress], [0], [encodedFunctionCall], proposeDescription],
        onError(err) {
            console.log("prepare error", err);
        },
    });

    const { write: handle, data, error, isLoading, isError } = useContractWrite(config);

    const { isLoading: isTxLoading, isSuccess: isSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess(data) {
            const abi = [
                "event ProposalCreated(uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description)",
            ];
            findEvent(
                abi,
                data.logs.filter((log) => log.address == governorAddress),
                { proposal_id: loanProposal.id }
            ).then((events) => {
                events.map((event) => saveEvent(supabase, event));
                if (events && events.length > 0) {
                    const proposalId = events[0].event_data["proposalId"];
                    handlePublished(proposalId);
                }
            });
        },
        onError(err) {
            console.log("tx error", err);
        },
    });

    const handlePublished = async (proposalId) => {
        const { error: e } = await supabase
            .from(SUPABASE_TABLE_LOAN_PROPOSALS)
            .update({
                onchain_proposal_id: proposalId.toString(),
            })
            .eq("id", loanProposal.id);

        if (e) setDbError(e.message);
        else {
            const { error: er } = await supabase.from(SUPABASE_TABLE_LOAN_PROPOSALS_STATUS).insert({
                status: "Published",
                proposal_id: loanProposal.id,
            });

            if (er) setDbError(er.message);
            else {
                closeModal();
                onPublishSuccess?.();
            }
        }
    };

    function closeModal() {
        setPublishModalOpen(false);
    }

    return (
        <>
            <button
                className="btn-primary text-base"
                // disabled={!isVerified(loanProposal) || !isSigned(loanProposal)}
                onClick={(e) => {
                    e.preventDefault();
                    setPublishModalOpen(true);
                }}
            >
                <RocketLaunchIcon className="inline h-6 fill-current align-top text-white dark:text-gray-800" />
                <span className="ml-2 hidden md:inline">Publish this Proposal</span>
            </button>

            <DialogComponent
                heading="Publish Proposal"
                isModelOpen={publishModalOpen}
                modelCloseHandler={closeModal}
                explicitClose={true}
                closeLabel="Close"
            >
                <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-200">
                        Publish this proposal to start the voting process!
                    </p>
                </div>

                <div className="mt-4 w-full">
                    <button
                        type="button"
                        className="btn-secondary mt-2 inline-flex w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => handle?.()}
                        disabled={!isConnected || isLoading || isTxLoading}
                    >
                        Publish Proposal
                        {isMounted() && (isLoading || isTxLoading) ? (
                            <svg
                                className="text-indigo ml-3 h-6 w-6 animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        ) : null}
                    </button>
                </div>
                <div className="mt-2 w-full">
                    {(isError || isPrepareError || dbError) && (
                        <div className="text-red-500">
                            {(prepareError || error || dbError)?.message}
                        </div>
                    )}
                    {isSuccess && (
                        <div className="text-green-500">Transaction submitted successfully</div>
                    )}
                </div>
            </DialogComponent>
        </>
    );
}
