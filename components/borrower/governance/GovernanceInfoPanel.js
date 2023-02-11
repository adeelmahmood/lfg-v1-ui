import { useAccount, useContractRead } from "wagmi";
import addresses from "../../../constants/contract.json";
import governorAbi from "../../../constants/LoanGovernor.json";
import { useState } from "react";
import { displayUnits } from "../../../utils/Math";

export default function GovernanceInfoPanel({ loanProposal }) {
    const [proposalState, setProposalState] = useState("Not Governable");
    const [proposalId, setProposalId] = useState(loanProposal?.onchain_proposal_id);

    const { isConnected } = useAccount();
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
    const governorAddress = addresses[chainId].LoanGovernor;

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

    const [voteCounts, setVoteCounts] = useState();

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
                <div>Proposal State</div>
                <div className="font-semibold">{proposalState}</div>
            </div>
            <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-y-0 md:gap-x-4">
                <div className="space-y-2 rounded-lg bg-emerald-700 px-4 py-4 text-gray-200 shadow-md dark:bg-emerald-800">
                    <div className="flex items-center justify-between ">
                        <div className="font-semibold">Votes For</div>
                        <div className="ml-1 font-semibold">
                            {displayUnits(voteCounts?.forVotes)}
                        </div>
                    </div>
                    <div className="flex items-center justify-between ">
                        <div>Combined Voting Power</div>
                        <div className="ml-1">{displayUnits(voteCounts?.forVotes)}</div>
                    </div>
                </div>
                <div className="space-y-2 rounded-lg bg-orange-700 px-4 py-4 text-gray-200 shadow-md dark:bg-orange-800">
                    <div className="flex items-center justify-between">
                        <div className="font-semibold">Votes Against</div>
                        <div className="ml-1 font-semibold">
                            {displayUnits(voteCounts?.forVotes)}
                        </div>
                    </div>
                    <div className="flex items-center justify-between ">
                        <div>Combined Voting Power</div>
                        <div className="ml-1">{displayUnits(voteCounts?.forVotes)}</div>
                    </div>
                </div>
            </div>
        </>
    );
}
