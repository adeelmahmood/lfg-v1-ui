import { useState } from "react";
import getStripe from "../../utils/Stripe";
import { useRouter } from "next/router";

export default function VerifyIdentity({ loanProposal, setLoanProposal, handle, ...rest }) {
    const [isCompleted, setIsCompleted] = useState(loanProposal.identity_verification_requested);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const router = useRouter();

    const startVerification = async () => {
        setIsLoading(true);
        setError(null);

        const stripe = await getStripe();

        const response = await fetch("/api/stripe/verifyIdentity", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                pid: loanProposal.id,
            }),
        });
        const session = await response.json();

        const { error: err } = await stripe.verifyIdentity(session.clientSecret);
        if (err?.message) {
            setError(err.message);
        } else if (err?.type == "user_action" && err?.code == "consent_declined") {
            setError("User declined the consent");
        } else if (err?.type == "user_action" && err?.code == "session_cancelled") {
            // do nothing
        } else {
            // verification completed
            setIsCompleted(true);
            setLoanProposal({
                ...loanProposal,
                identity_verification_requested: true,
            });
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
                    Last thing, we need you to verify your identity before this proposal can be
                    published.
                </p>
                <div className="mt-4 mb-10">
                    <button
                        className="mt-2 rounded-lg border border-gray-400 bg-gray-100 py-1 px-4 text-gray-800 shadow hover:bg-gray-100 disabled:cursor-not-allowed  disabled:opacity-50 md:font-semibold"
                        onClick={startVerification}
                        disabled={isLoading || isCompleted}
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

                <div className="mt-4">
                    <button
                        className="w-full rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm 
                        ring-1 ring-indigo-600 transition duration-150 ease-in-out hover:bg-indigo-700
                        hover:ring-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-500 dark:ring-0 dark:hover:bg-green-600 dark:focus:bg-green-600 dark:focus:outline-none dark:focus:ring-0"
                        onClick={() => router.push("/borrower/dashboard")}
                        disabled={!isCompleted}
                    >
                        Complete
                    </button>
                </div>
            </div>
        </>
    );
}
