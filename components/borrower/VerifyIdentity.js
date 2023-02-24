import { useState } from "react";
import { stripeVerification } from "../../utils/Stripe";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { SUPABASE_TABLE_LOAN_PROPOSALS } from "../../utils/Constants";

export default function VerifyIdentity({ loanProposal, setLoanProposal, handle, ...rest }) {
    const [isCompleted, setIsCompleted] = useState(loanProposal.identity_verification_requested);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const supabase = useSupabaseClient();
    const user = useUser();
    const router = useRouter();

    const startVerification = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const err = await stripeVerification({ pid: loanProposal.id });

            if (err?.message) {
                setError(err.message);
            } else if (err?.type == "user_action" && err?.code == "consent_declined") {
                setError("User declined the consent");
            } else if (err?.type == "user_action" && err?.code == "session_cancelled") {
                // do nothing
            } else {
                // verification completed
                const { error } = await supabase
                    .from(SUPABASE_TABLE_LOAN_PROPOSALS)
                    .update({
                        identity_verification_requested: true,
                    })
                    .eq("id", loanProposal.id);

                if (error) {
                    console.log(error.message);
                }

                setIsCompleted(true);
            }
        } catch (e) {
            setError(e.message);
        }

        setIsLoading(false);
    };

    return (
        <>
            <div className="mb-8 w-full max-w-2xl px-8" {...rest}>
                <h2 className="max-w-6xl text-4xl font-bold text-white">
                    <span className="bg-gradient-to-r from-indigo-500 to-green-600 bg-clip-text text-transparent">
                        Verify Your Identity
                    </span>
                </h2>
                <p className="mt-4 text-gray-800 dark:text-gray-200">
                    We need to verify your identity before this proposal can be published.
                </p>
                <div className="mt-4 mb-10">
                    <button
                        className="btn-secondary mt-2 px-4 py-1.5"
                        onClick={startVerification}
                        disabled={isLoading || isCompleted || !loanProposal.id}
                    >
                        Start Verification
                    </button>
                    {error && <p className="mt-2 text-red-600">{error}</p>}
                    {isCompleted && (
                        <p className="mt-2 font-semibold text-teal-500">
                            You have submitted your identity verification. Once we receive the
                            verification results, we will update your loan proposal.
                        </p>
                    )}
                </div>

                <p className="">You can do this later too</p>

                <div className="mt-4 flex items-start justify-between space-x-4">
                    <button className="btn-clear w-full" onClick={handle}>
                        Skip Verification
                    </button>
                    <button
                        className="btn-secondary w-full"
                        onClick={() => router.push("/borrower/dashboard")}
                        disabled={!isCompleted}
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
}
