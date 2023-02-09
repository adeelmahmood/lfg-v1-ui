import {
    useAccount,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import addresses from "../../../constants/contract.json";
import governorAbi from "../../../constants/LoanGovernor.json";
import loanManagerAbi from "../../../constants/LoanManager.json";
import { ethers } from "ethers";
import { parseEther } from "ethers/lib/utils.js";
import { Dialog, Transition } from "@headlessui/react";
import {
    DAI_ADDRESS,
    SUPABASE_TABLE_LOAN_PROPOSALS,
    SUPABASE_TABLE_LOAN_PROPOSALS_STATUS,
} from "../../../utils/Constants";
import { Fragment, useEffect, useState } from "react";
import useIsMounted from "../../../hooks/useIsMounted";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { ArrowUpOnSquareStackIcon } from "@heroicons/react/24/solid";
import DialogComponent from "../../DialogComponent";

export default function PublishLoanDialog({
    isModelOpen = false,
    modelCloseHandler,
    loanProposal,
}) {
    const [publishModalOpen, setPublishModalOpen] = useState(isModelOpen);
    const isMounted = useIsMounted();

    const supabase = useSupabaseClient();
    const user = useUser();

    const [dbError, setDbError] = useState(false);

    const { address, isConnected } = useAccount();
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
    const governorAddress = addresses[chainId].LoanGovernor;
    const loanManagerAddress = addresses[chainId].LoanManager;
    const governorFunctionName = "propose";

    const proposeFunctionName = "issueLoan";
    const proposeFunctionArgs = [address, DAI_ADDRESS, parseEther(String(loanProposal.amount))];
    const proposeDescription = `@@Loan Proposal {{${loanProposal.id}}}@@`;

    const [encodedFunctionCall, setEncodedFunctionCall] = useState();

    useEffect(() => {
        if (!encodedFunctionCall) {
            const loanMangerIface = new ethers.utils.Interface(loanManagerAbi);
            setEncodedFunctionCall(
                loanMangerIface.encodeFunctionData(proposeFunctionName, proposeFunctionArgs)
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
        args: [[loanManagerAddress], [0], [encodedFunctionCall], proposeDescription],
        onError(err) {
            console.log("prepare error", err);
        },
    });

    const { write: handle, data, error, isLoading, isError } = useContractWrite(config);

    const { isLoading: isTxLoading, isSuccess: isSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess(data) {
            const eventSignature =
                "ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)";
            const eventSignatureHash = ethers.utils.id(eventSignature);

            const event = data.logs?.find((log) => log.topics[0] == eventSignatureHash);
            if (event) {
                const proposalId = ethers.utils.defaultAbiCoder.decode(["uint256"], event.data);
                handlePublished(proposalId);
            } else {
                setDbError("Onchain ProposalCreated event was not emitted");
            }
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
            else closeModal();
        }
    };

    function closeModal() {
        setPublishModalOpen(false);
        modelCloseHandler?.();
    }

    return (
        <>
            <button
                className="btn-primary text-base"
                onClick={(e) => {
                    e.preventDefault();
                    setPublishModalOpen(true);
                }}
            >
                <ArrowUpOnSquareStackIcon className="inline h-6 fill-current align-top text-white dark:text-gray-800" />
                <span className="ml-2 hidden md:inline">Publish this Proposal</span>
            </button>

            <DialogComponent
                heading="Publish Proposal"
                isModelOpen={publishModalOpen}
                modelCloseHandler={closeModal}
            >
                <div className="mt-2">
                    <p className="text-sm text-gray-500">
                        Publish this proposal to start the voting process
                    </p>
                </div>

                <div className="mt-4 w-full">
                    <button
                        type="button"
                        className="inline-flex rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200
                                                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed 
                                                disabled:opacity-50"
                        onClick={() => handle?.()}
                        disabled={!isConnected || isLoading || isTxLoading}
                    >
                        Publish Proposal
                        {isMounted() && (isLoading || isTxLoading) ? (
                            <svg
                                className="text-indigo ml-3 h-5 w-5 animate-spin"
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
