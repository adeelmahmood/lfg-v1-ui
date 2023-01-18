import { useState } from "react";
import getStripe from "../../utils/Stripe";
import { ArrowLongRightIcon } from "@heroicons/react/24/solid";

export default function VerifyIdentity({ loanProposal, setLoanProposal, handle, ...rest }) {
    const [isCompleted, setIsCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const startVerification = async () => {
        setIsLoading(true);
        setError(null);

        const stripe = await getStripe();

        const response = await fetch("/api/stripe/verifyIdentity", { method: "POST" });
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
                identityVerified: true,
            });
        }
        setIsLoading(false);
    };

    return (
        <>
            <div className="mb-8 w-full max-w-2xl px-8" {...rest}>
                <h2 className="text-3xl font-bold text-gray-700">Verify your identity</h2>
                <div className="mt-6 mb-10">
                    <button
                        className="mt-2 rounded-lg border border-gray-400 bg-gray-100 py-1 px-4 text-gray-800 shadow hover:bg-gray-100 disabled:cursor-not-allowed  disabled:opacity-50 md:font-semibold"
                        onClick={startVerification}
                        disabled={isLoading}
                    >
                        Start Verification
                    </button>
                    {error && <p className="mt-2 text-red-600">{error}</p>}
                    {loanProposal.identityVerified && (
                        <p className="mt-2 font-semibold text-teal-500">Verification Submitted</p>
                    )}
                </div>

                <div className="mt-4">
                    <button
                        className="w-full rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={handle}
                        disabled={!loanProposal.identityVerified}
                    >
                        Next <ArrowLongRightIcon className="inline h-6 fill-current text-white" />
                    </button>
                </div>
            </div>
        </>
    );
}
