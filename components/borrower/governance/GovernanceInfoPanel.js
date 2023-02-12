import { useAccount, useBlockNumber, useContractRead } from "wagmi";
import addresses from "../../../constants/contract.json";
import governorAbi from "../../../constants/LoanGovernor.json";
import { useEffect, useState } from "react";
import { displayUnits } from "../../../utils/Math";
import prettyMilliseconds from "pretty-ms";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { SUPABASE_TABLE_LOAN_PROPOSALS_EVENTS } from "../../../utils/Constants";

export default function GovernanceInfoPanel({ loanProposal }) {
    const [proposalState, setProposalState] = useState("Not Governable");
    const [proposalId, setProposalId] = useState(loanProposal?.onchain_proposal_id);

    const supabase = useSupabaseClient();
    const user = useUser();

    const { isConnected } = useAccount();
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
    const governorAddress = addresses[chainId].LoanGovernor;

    const { data: currentBlock } = useBlockNumber();
    const [timeLeft, setTimeLeft] = useState();

    const [forVotesCount, setForVoteCounts] = useState(0);
    const [againstVotesCount, setAgainstVoteCounts] = useState(0);
    const [voteCounts, setVoteCounts] = useState();

    const states = [
        "Pending",
        "Active",
        "Canceled",
        "Defeated",
        "Succeeded",
        "Queued",
        "Expired",
        "Executed",
    ];

    useEffect(() => {
        async function getVotesBySupport(mode, setData) {
            const { count, error } = await supabase
                .from(SUPABASE_TABLE_LOAN_PROPOSALS_EVENTS)
                .select("*", { count: "exact", head: true })
                .eq("proposal_id", loanProposal.id)
                .eq("event_data->>support", mode);
            if (error) {
                console.log(error.message);
            }
            setData?.(count);
        }

        getVotesBySupport(1, setForVoteCounts);
        getVotesBySupport(2, setAgainstVoteCounts);
    }, []);

    useContractRead({
        address: governorAddress,
        abi: governorAbi,
        functionName: "proposalDeadline",
        args: [proposalId],
        onSuccess(data) {
            const blocksLeft = data - currentBlock;
            if (blocksLeft > 0) setTimeLeft(prettyMilliseconds(blocksLeft * 12 * 1000)); //~12 sec per block, sec to ms
        },
        onError(err) {
            console.log("governor proposalDeadline contract read error", err.message);
        },
        enabled: isConnected && proposalId,
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

    return (
        <>
            <div className="mb-2 flex items-center justify-between rounded-lg border border-gray-400 py-2 px-4 text-gray-600 dark:text-gray-200">
                <div>
                    <span className="mr-1 hidden md:inline">Proposal State:</span>
                    <span className="font-semibold">{proposalState}</span>
                </div>
                {timeLeft && (
                    <div>
                        <span className="mr-1">Time Left:</span>
                        <span className="font-semibold">{timeLeft}</span>
                    </div>
                )}
            </div>
            <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-y-0 md:gap-x-4">
                <div className="space-y-2 rounded-lg border border-gray-400 px-4 py-4 text-gray-800 shadow-md dark:text-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="font-semibold text-emerald-800 dark:text-emerald-300">
                            Votes For
                        </div>
                        <div className="ml-1 font-semibold text-emerald-800 dark:text-emerald-300">
                            {forVotesCount}
                        </div>
                    </div>
                    <div className="flex items-center justify-between ">
                        <div>Voting Power</div>
                        <div className="ml-1">{displayUnits(voteCounts?.forVotes)}</div>
                    </div>
                </div>
                <div className="space-y-2 rounded-lg border border-gray-400 px-4 py-4 text-gray-800 shadow-md dark:text-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="font-semibold text-orange-800 dark:text-orange-400">
                            Votes Against
                        </div>
                        <div className="ml-1 font-semibold text-orange-800 dark:text-orange-400">
                            {againstVotesCount}
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>Voting Power</div>
                        <div className="ml-1">{displayUnits(voteCounts?.forVotes)}</div>
                    </div>
                </div>
            </div>
        </>
    );
}
