import { useAccount, useBlockNumber, useContractRead, useProvider } from "wagmi";
import addresses from "../../../constants/contract.json";
import governorAbi from "../../../constants/LoanGovernor.json";
import { Fragment, useEffect, useState } from "react";
import { displayUnits } from "../../../utils/Math";
import prettyMilliseconds from "pretty-ms";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { SUPABASE_TABLE_LOAN_PROPOSALS_EVENTS } from "../../../utils/Constants";
import { ChevronDoubleDownIcon, ChevronDoubleUpIcon } from "@heroicons/react/24/solid";
import { Transition } from "@headlessui/react";

export default function GovernanceInfoPanel({ loanProposal, canVote, canQueue, canExecute }) {
    const [proposalState, setProposalState] = useState("Not Governable");
    const [proposalId, setProposalId] = useState(loanProposal?.onchain_proposal_id);

    const supabase = useSupabaseClient();
    const user = useUser();

    const { isConnected } = useAccount();
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
    const governorAddress = addresses[chainId].LoanGovernor;

    const { data: currentBlock } = useBlockNumber();
    const [timeLeft, setTimeLeft] = useState();

    const provider = useProvider();
    const [proposalEta, setProposalEta] = useState();

    const [forVotes, setForVote] = useState([]);
    const [againstVotes, setAgainstVotes] = useState([]);
    const [voteCounts, setVoteCounts] = useState();

    const [statusExpanded, setStatusExpanded] = useState(false);
    const [forVotesExpanded, setForVotesExpanded] = useState(true);
    const [againstVotesExpanded, setAgainstVotesExpanded] = useState(true);

    const states = [
        "Voting In Progress", //"Pending",
        "Voting In Progress", //"Active",
        "Canceled",
        "Rejected", //"Defeated",
        "Succeeded",
        "Queued",
        "Expired",
        "Executed",
    ];

    useEffect(() => {
        async function getVotesBySupport(mode, setData) {
            const { data, error } = await supabase
                .from(SUPABASE_TABLE_LOAN_PROPOSALS_EVENTS)
                .select("*")
                .eq("proposal_id", loanProposal.id)
                .eq("event_data->>support", mode);
            if (error) {
                console.log(error.message);
            }
            setData?.(data);
        }

        getVotesBySupport(1, setForVote);
        getVotesBySupport(0, setAgainstVotes);
    }, []);

    useContractRead({
        address: governorAddress,
        abi: governorAbi,
        functionName: "proposalDeadline",
        args: [proposalId],
        onSuccess(data) {
            const blocksLeft = data - currentBlock + 1; //plus one coz voting ends after last block
            if (blocksLeft > 0) {
                setTimeLeft(prettyMilliseconds(blocksLeft * 12 * 1000)); //~12 sec per block, sec to ms
            }
        },
        onError(err) {
            console.log("governor proposalDeadline contract read error", err.message);
        },
        enabled: isConnected && proposalId && canVote?.() === true,
    });

    useContractRead({
        address: governorAddress,
        abi: governorAbi,
        functionName: "proposalEta",
        args: [proposalId],
        onSuccess(data) {
            setProposalEta(data);
        },
        onError(err) {
            console.log("governor proposalDeadline contract read error", err.message);
        },
        enabled: isConnected && proposalId && canExecute?.() === true,
    });

    useContractRead({
        address: governorAddress,
        abi: governorAbi,
        functionName: "state",
        args: [proposalId],
        onSuccess(data) {
            setProposalState(states[data]);
        },
        onError(err) {
            console.log("governor state contract read error", err.message);
        },
        enabled: isConnected && proposalId,
    });

    useContractRead({
        address: governorAddress,
        abi: governorAbi,
        functionName: "proposalVotes",
        args: [proposalId],
        onSuccess(data) {
            setVoteCounts(data);
        },
        onError(err) {
            console.log("governor proposalVotes contract read error", err.message);
        },
        enabled: isConnected && proposalId,
    });

    const trimAddress = (addr) => {
        return addr.substring(0, 6) + "..." + addr.substring(addr.length - 4);
    };

    useEffect(() => {
        async function translateProposalEtaToTimeLeft() {
            const block = await provider.getBlock(currentBlock);
            const timestamp = block.timestamp;
            const secsLeft = proposalEta - timestamp;
            if (secsLeft > 0) {
                setTimeLeft(prettyMilliseconds(secsLeft * 1000)); //sec to ms
            }
        }

        if (proposalEta) translateProposalEtaToTimeLeft();
    }, [proposalEta]);

    const ToggleDetailsComp = ({
        handleToggle,
        isDetailsOpen,
        content,
        details,
        showToggle = true,
    }) => {
        return (
            <>
                <button
                    className={`group relative flex w-full ${
                        isDetailsOpen ? "rounded-t-lg" : "rounded-lg"
                    }  px-4 py-2 hover:bg-gray-100`}
                    onClick={() => {
                        if (showToggle) handleToggle?.();
                    }}
                >
                    {content}
                    {showToggle && (
                        <span
                            onClick={handleToggle}
                            className="absolute left-[50%] hidden md:block"
                        >
                            {isDetailsOpen ? (
                                <ChevronDoubleUpIcon className="inline h-5 fill-current align-top text-gray-400 group-hover:text-gray-800 dark:text-gray-400 group-hover:dark:text-gray-200" />
                            ) : (
                                <ChevronDoubleDownIcon className="dark:text-gray-4000 inline h-5 fill-current align-top text-gray-400 group-hover:text-gray-800 group-hover:dark:text-gray-200" />
                            )}
                        </span>
                    )}
                </button>
                <Transition
                    as="div"
                    show={showToggle && isDetailsOpen}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    appear={true}
                >
                    {details}
                </Transition>
            </>
        );
    };

    return (
        <>
            <div className="mb-2 rounded-lg border border-gray-400 text-gray-600 dark:text-gray-200">
                <ToggleDetailsComp
                    handleToggle={() => setStatusExpanded(!statusExpanded)}
                    isDetailsOpen={statusExpanded}
                    content={
                        <div className="flex w-full items-center justify-between">
                            <div>
                                <span className="mr-1 hidden md:inline">State:</span>
                                <span className="font-semibold">{proposalState}</span>
                            </div>
                            {timeLeft && (
                                <div>
                                    <span className="mr-1">Time Left:</span>
                                    <span className="font-semibold">{timeLeft}</span>
                                </div>
                            )}
                        </div>
                    }
                    showToggle={loanProposal.loan_proposals_status?.length > 0}
                    details={loanProposal.loan_proposals_status
                        ?.slice(0)
                        .reverse()
                        .map((status, i) => {
                            const options = {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                            };
                            const d = new Date(status.created_at).toLocaleDateString(
                                undefined,
                                options
                            );
                            return (
                                <div
                                    key={i}
                                    className="flex items-center justify-between border-t border-gray-300 px-4 py-2 pt-2"
                                >
                                    <div>{status.status}</div>
                                    <div>{d}</div>
                                </div>
                            );
                        })}
                />
            </div>
            <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-y-0 md:gap-x-4">
                <div className="rounded-lg border border-gray-400 shadow-md">
                    <ToggleDetailsComp
                        handleToggle={() => setForVotesExpanded(!forVotesExpanded)}
                        isDetailsOpen={forVotesExpanded}
                        content={
                            <div className="flex w-full flex-col">
                                <div className="flex items-center justify-between py-2">
                                    <div className="font-semibold text-emerald-800 dark:text-emerald-300">
                                        Votes For
                                    </div>
                                    <div className="ml-1 font-semibold text-emerald-800 dark:text-emerald-300">
                                        {forVotes?.length}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>Voting Power</div>
                                    <div className="ml-1">{displayUnits(voteCounts?.forVotes)}</div>
                                </div>
                            </div>
                        }
                        showToggle={forVotes.length > 0}
                        details={forVotes?.map((vote, i) => {
                            const data = vote.event_data;
                            return (
                                <div
                                    key={i}
                                    className="flex items-center justify-between border-t border-gray-300 px-4 py-2 pt-2"
                                >
                                    <div>
                                        <span className="">{trimAddress(data.voter)}</span>
                                    </div>
                                    <div>{displayUnits(data.weight)}</div>
                                </div>
                            );
                        })}
                    />
                </div>
                <div className="rounded-lg border border-gray-400 shadow-md">
                    <ToggleDetailsComp
                        handleToggle={() => setAgainstVotesExpanded(!againstVotesExpanded)}
                        isDetailsOpen={againstVotesExpanded}
                        content={
                            <div className="flex w-full flex-col">
                                <div className="flex items-center justify-between py-2">
                                    <div className="font-semibold text-orange-800 dark:text-emerald-300">
                                        Votes Against
                                    </div>
                                    <div className="ml-1 font-semibold text-emerald-800 dark:text-emerald-300">
                                        {againstVotes?.length}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>Voting Power</div>
                                    <div className="ml-1">
                                        {displayUnits(voteCounts?.againstVotes)}
                                    </div>
                                </div>
                            </div>
                        }
                        showToggle={againstVotes.length > 0}
                        details={againstVotes?.map((vote, i) => {
                            const data = vote.event_data;
                            return (
                                <div
                                    key={i}
                                    className="flex items-center justify-between border-t border-gray-300 px-4 py-2 pt-2"
                                >
                                    <div>
                                        <span className="">{trimAddress(data.voter)}</span>
                                    </div>
                                    <div>{displayUnits(data.weight)}</div>
                                </div>
                            );
                        })}
                    />
                </div>
            </div>
        </>
    );
}
