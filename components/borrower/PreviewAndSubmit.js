import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import {
    SUPABASE_TABLE_LOAN_PROPOSALS,
    SUPABASE_TABLE_LOAN_PROPOSALS_STATUS,
} from "../../utils/Constants";
import { useState } from "react";
import ViewProposal from "./ViewProposal";

export default function PreviewAndSubmit({ loanProposal, setLoanProposal, handle, ...rest }) {
    const supabase = useSupabaseClient();
    const user = useUser();

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const isNew = () => {
        return loanProposal.id == null;
    };

    const handleNext = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from(SUPABASE_TABLE_LOAN_PROPOSALS)
            .upsert({
                ...loanProposal,
                user_id: user.id,
            })
            .select("id")
            .single();
        if (error) {
            setIsLoading(false);
            setError(error.message);
        } else {
            if (isNew()) {
                // add status entry
                const { error: statusError } = await supabase
                    .from(SUPABASE_TABLE_LOAN_PROPOSALS_STATUS)
                    .insert({
                        status: "Created",
                        proposal_id: data.id,
                    });

                if (statusError) {
                    setError(statusError.message);
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
            } else {
                handle?.();
            }
            setIsLoading(false);
        }
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
                        disabled={isLoading}
                    >
                        {isNew() ? "Create" : "Save"}
                    </button>
                </div>
            </div>
        </>
    );
}
