import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { SUPABASE_TABLE_LOAN_PROPOSALS } from "../../utils/Constants";
import { useState } from "react";
import ViewProposal from "./ViewProposal";

export default function PreviewAndSubmit({ loanProposal, setLoanProposal, handle, ...rest }) {
    const supabase = useSupabaseClient();
    const user = useUser();

    const [error, setError] = useState();

    const handleNext = async () => {
        const { data, error } = await supabase
            .from(SUPABASE_TABLE_LOAN_PROPOSALS)
            .insert({
                ...loanProposal,
                user_id: user.id,
                status: "Created",
            })
            .select("id")
            .single();
        if (error) {
            setError(error.message);
        } else {
            // add persisted record id
            setLoanProposal({
                ...loanProposal,
                id: data.id,
            });

            handle?.();
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
                    <button className="btn-secondary w-full" onClick={handleNext}>
                        Submit
                    </button>
                </div>
            </div>
        </>
    );
}
