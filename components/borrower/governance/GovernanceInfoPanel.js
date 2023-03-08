import { useAccount } from "wagmi";
import { useState } from "react";
import { displayUnits8 } from "../../../utils/Math";
import { ChevronDoubleDownIcon, ChevronDoubleUpIcon } from "@heroicons/react/24/solid";
import { Transition } from "@headlessui/react";

export default function GovernanceInfoPanel({
    loanProposal,
    proposalState,
    forVotes,
    againstVotes,
    voteCounts,
    timeLeft,
}) {
    const { address } = useAccount();

    const [statusExpanded, setStatusExpanded] = useState(false);
    const [forVotesExpanded, setForVotesExpanded] = useState(true);
    const [againstVotesExpanded, setAgainstVotesExpanded] = useState(true);

    const showAddr = (addr) => {
        return addr == address
            ? "You"
            : addr.substring(0, 6) + "..." + addr.substring(addr.length - 4);
    };

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
                    }  px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800`}
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
                                <ChevronDoubleUpIcon className="inline h-5 fill-current align-top text-gray-500 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-200" />
                            ) : (
                                <ChevronDoubleDownIcon className="inline h-5 fill-current align-top text-gray-500 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-200" />
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
            <div className="mb-2 rounded-lg border border-gray-400">
                <ToggleDetailsComp
                    handleToggle={() => setStatusExpanded(!statusExpanded)}
                    isDetailsOpen={statusExpanded}
                    content={
                        <div className="flex flex-1 flex-col">
                            <div className="flex items-center justify-between text-gray-800 dark:text-gray-200">
                                <div>
                                    {/* <span className="mr-1 hidden md:inline">State:</span> */}
                                    <span className="font-semibold">{proposalState?.state}</span>
                                </div>
                                {timeLeft && (
                                    <div>
                                        {/* <span className="mr-1">Time Left:</span> */}
                                        <span className="font-semibold">{timeLeft}</span>
                                    </div>
                                )}
                            </div>
                            {proposalState?.info && (
                                <p className="mt-2 text-start text-gray-400">
                                    {proposalState?.info}
                                </p>
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
                <div className="overflow-hidden rounded-lg border border-gray-400 shadow-md">
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
                                    <div className="ml-1">
                                        {displayUnits8(voteCounts?.forVotes)}
                                    </div>
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
                                        <span className="">{showAddr(data.voter)}</span>
                                    </div>
                                    <div>{displayUnits8(data.weight)}</div>
                                </div>
                            );
                        })}
                    />
                </div>
                <div className="overflow-hidden rounded-lg border border-gray-400 shadow-md">
                    <ToggleDetailsComp
                        handleToggle={() => setAgainstVotesExpanded(!againstVotesExpanded)}
                        isDetailsOpen={againstVotesExpanded}
                        content={
                            <div className="flex w-full flex-col">
                                <div className="flex items-center justify-between py-2">
                                    <div className="font-semibold text-orange-800 dark:text-orange-300">
                                        Votes Against
                                    </div>
                                    <div className="ml-1 font-semibold text-orange-800 dark:text-orange-300">
                                        {againstVotes?.length}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>Voting Power</div>
                                    <div className="ml-1">
                                        {displayUnits8(voteCounts?.againstVotes)}
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
                                        <span>{trimAddress(data.voter)}</span>
                                    </div>
                                    <div>{displayUnits8(data.weight)}</div>
                                </div>
                            );
                        })}
                    />
                </div>
            </div>
        </>
    );
}
