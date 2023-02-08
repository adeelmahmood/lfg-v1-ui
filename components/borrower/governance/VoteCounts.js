import { useAccount, useContractRead } from "wagmi";
import addresses from "../../../constants/contract.json";
import governorAbi from "../../../constants/LoanGovernor.json";
import { useState } from "react";
import { displayUnits } from "../../../utils/Math";

export default function VoteCounts({ proposalId }) {
    const { isConnected } = useAccount();
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
    const governorAddress = addresses[chainId].LoanGovernor;

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
            <div className="text-sm font-semibold">
                Votes For: {displayUnits(voteCounts?.forVotes)}
            </div>
            <div className="text-sm font-semibold">
                Votes Against: {displayUnits(voteCounts?.againstVotes)}
            </div>
            <div className="text-sm font-semibold">
                Votes Abstain: {displayUnits(voteCounts?.abstainVotes)}
            </div>
        </>
    );
}
