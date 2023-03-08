import {
    useAccount,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import addresses from "../../../constants/contract.json";
import governorAbi from "../../../constants/LoanGovernor.json";
import { ethers } from "ethers";
import {
    SUPABASE_TABLE_LOAN_PROPOSALS_EVENTS,
    SUPABASE_TABLE_LOAN_PROPOSALS_STATUS,
} from "../../../utils/Constants";
import { useEffect, useState } from "react";
import useIsMounted from "../../../hooks/useIsMounted";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { BoltIcon } from "@heroicons/react/24/solid";
import DialogComponent from "../../DialogComponent";
import { findEvent, saveEvent } from "../../../utils/Events";

export default function ExecutePropoposalDialog({ loanProposal, onExecutedSuccess }) {
    const [executeModalOpen, setExecuteModalOpen] = useState();
    const isMounted = useIsMounted();

    const supabase = useSupabaseClient();
    const user = useUser();

    const [dbError, setDbError] = useState(false);

    const { address, isConnected } = useAccount();
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
    const governorAddress = addresses[chainId].LoanGovernor;
    const governorFunctionName = "execute";

    const [proposeData, setProposeData] = useState(null);

    useEffect(() => {
        async function getProposalEncodedData() {
            const { data, error } = await supabase
                .from(SUPABASE_TABLE_LOAN_PROPOSALS_EVENTS)
                .select("event_data")
                .eq("proposal_id", loanProposal.id)
                .eq("event_type", "ProposalCreated")
                .single();

            if (error) {
                console.log(error.message);
            } else {
                setProposeData(data.event_data);
            }
        }

        getProposalEncodedData();
    }, []);

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: governorAddress,
        abi: governorAbi,
        functionName: governorFunctionName,
        enabled: proposeData?.targets != null,
        args: [
            proposeData?.targets?.split(",") || [],
            proposeData?.values?.split(",") || [0],
            proposeData?.calldatas?.split(",") || [],
            proposeData?.description ? ethers.utils.id(proposeData?.description) : null,
        ],
        onError(err) {
            console.log("prepare error", err);
        },
    });

    const { write: handle, data, error, isLoading, isError } = useContractWrite(config);

    const { isLoading: isTxLoading, isSuccess: isSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess(data) {
            const abi = ["event ProposalExecuted(uint256 proposalId)"];
            findEvent(
                abi,
                data.logs.filter((log) => log.address == governorAddress),
                { proposal_id: loanProposal.id }
            ).then((events) => {
                events.map((event) => saveEvent(supabase, event));
                if (events && events.length > 0) {
                    const proposalId = events[0].event_data["proposalId"];
                    handleExecuted(proposalId);
                }
            });
        },
        onError(err) {
            console.log("tx error", err);
        },
    });

    const handleExecuted = async (proposalId) => {
        const { error: er } = await supabase.from(SUPABASE_TABLE_LOAN_PROPOSALS_STATUS).insert({
            status: "Executed",
            proposal_id: loanProposal.id,
        });

        if (er) setDbError(er.message);
        else {
            closeModal();
            onExecutedSuccess?.();
        }
    };

    function closeModal() {
        setExecuteModalOpen(false);
    }

    return (
        <>
            <button
                className="btn-primary text-base"
                onClick={(e) => {
                    e.preventDefault();
                    setExecuteModalOpen(true);
                }}
            >
                <BoltIcon className="inline h-6 fill-current align-top text-white dark:text-gray-800" />
                <span className="ml-2 hidden md:inline">Execute this Proposal</span>
            </button>

            <DialogComponent
                heading="Execute Proposal"
                isModelOpen={executeModalOpen}
                modelCloseHandler={closeModal}
            >
                <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-200">
                        The proposal is all set. Execute this proposal to disburse the funds to the
                        loan requestor.
                        <span className="mt-4 mb-4 block font-semibold">
                            This action cannot be undone!
                        </span>
                    </p>
                </div>

                <div className="mt-4 w-full">
                    <button
                        type="button"
                        className="btn-secondary mt-2 inline-flex w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => handle?.()}
                        disabled={!isConnected || isLoading || isTxLoading}
                    >
                        Execute Proposal
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
