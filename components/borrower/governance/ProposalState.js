import { useAccount, useContractRead } from "wagmi";
import addresses from "../../../constants/contract.json";
import governorAbi from "../../../constants/LoanGovernor.json";
import { useState } from "react";

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

    return (
        <>
            <div>
                <span className="text-sm font-semibold">Proposal State:</span>
                <span className="ml-1 text-sm font-semibold ">{proposalState}</span>
            </div>
        </>
    );
}
