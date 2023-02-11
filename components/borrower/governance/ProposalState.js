import { useAccount, useContractRead } from "wagmi";
import addresses from "../../../constants/contract.json";
import governorAbi from "../../../constants/LoanGovernor.json";
import { useState } from "react";
import { displayUnits } from "../../../utils/Math";

export default function ProposalState({ proposalId }) {
    const [proposalState, setProposalState] = useState();

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
            <div className="mt-10 w-72 space-y-2 rounded-lg bg-gray-300/50 px-8 py-4 shadow-md dark:bg-gray-700 dark:text-gray-700">
                <div className="flex items-center justify-between">
                    <div className="text-lg">Proposal State:</div>
                    <div className="ml-1 text-lg">{proposalState}</div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-lg">Votes For:</div>
                    <div className="ml-1 text-lg">{displayUnits(voteCounts?.forVotes)}</div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-lg">Votes Against:</div>
                    <div className="ml-1 text-lg">{displayUnits(voteCounts?.againstVotes)}</div>
                </div>
            </div>
        </>
    );
}
