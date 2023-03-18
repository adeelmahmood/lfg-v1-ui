import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useState } from "react";
import ViewProposal from "./ViewProposal";
import { isPublished } from "../../utils/ProposalChecks";
import { useAccount } from "wagmi";

export default function PreviewAndSubmit({ loanProposal, setLoanProposal, handle, ...rest }) {
    const supabase = useSupabaseClient();
    const user = useUser();

    const router = useRouter();

    const { address } = useAccount();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const isNew = () => {
        return loanProposal.id == null;
    };

    const handleNext = async () => {
        setIsLoading(true);

        const response = await fetch("/api/proposals/saveProposal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ loanProposal: loanProposal, address: address }),
        });

        const data = await response.json();
        if (response.status !== 200) {
            console.log(data.error);
            setError(data.error);
        } else {
            // add persisted record id
            setLoanProposal({
                ...loanProposal,
                id: data.id,
            });
            // update route to add proposal id
            router.push({ query: { id: data.id } }, undefined, { shallow: true });

            handle?.();
        }
        setIsLoading(false);
    };

    return (
        <>
            <div className="mb-8 w-full max-w-2xl px-8" {...rest}>
                <h2 className="max-w-6xl text-4xl font-bold text-white">
                    <span className="bg-gradient-to-r from-indigo-500 to-green-600 bg-clip-text text-transparent">
                        Preview Loan Proposal
                    </span>
                </h2>
                <div className="mt-5 flex-grow border-t border-gray-400"></div>

                {error && <p className="mt-5 text-red-500">{error}</p>}

                <ViewProposal loanProposal={loanProposal} />

                <div className="mt-4">
                    <button
                        className="btn-secondary w-full"
                        onClick={handleNext}
                        disabled={isLoading || isPublished(loanProposal)}
                    >
                        {isNew() ? "Create" : "Save"}
                    </button>
                </div>
            </div>
        </>
    );
}
