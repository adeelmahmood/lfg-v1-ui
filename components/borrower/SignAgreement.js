import { useState } from "react";
import { useRouter } from "next/router";
import { generateSignatureRequest, getHelloSignClient } from "../../utils/HelloSign";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { SUPABASE_TABLE_LOAN_PROPOSALS } from "../../utils/Constants";

export default function SignAgreement({ loanProposal, setLoanProposal, handle, ...rest }) {
    const [isCompleted, setIsCompleted] = useState(loanProposal.agreement_signed);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const supabase = useSupabaseClient();
    const user = useUser();
    const router = useRouter();

    const handleSignAgreement = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const signUrl = await generateSignatureRequest({ proposalId: loanProposal.id });
            const client = await getHelloSignClient();

            client.open(signUrl, { testMode: true, allowCancel: true });
            client.on("sign", async (data) => {
                const { error } = await supabase
                    .from(SUPABASE_TABLE_LOAN_PROPOSALS)
                    .update({
                        agreement_signed: true,
                    })
                    .eq("id", loanProposal.id);

                if (error) {
                    console.log(error.message);
                }

                setIsCompleted(true);
            });
        } catch (error) {
            setError(error.message);
        }
        setIsLoading(false);
    };

    return (
        <>
            <div className="mb-8 w-full max-w-2xl px-8" {...rest}>
                <h2 className="max-w-6xl text-4xl font-bold text-white">
                    <span className="bg-gradient-to-r from-indigo-500 to-green-600 bg-clip-text text-transparent">
                        Sign Agreement
                    </span>
                </h2>
                <p className="mt-4 text-gray-800 dark:text-gray-200">
                    We need you to sign an agreement to comply to the terms of the loan, once
                    issued.
                </p>
                <div className="mt-4 mb-10">
                    <button
                        className="btn-secondary mt-2 px-4 py-1.5"
                        onClick={handleSignAgreement}
                        disabled={isLoading || isCompleted || !loanProposal.id}
                    >
                        Sign Agreement
                    </button>
                    {error && <p className="mt-2 text-red-600">{error}</p>}
                    {isCompleted && (
                        <p className="mt-2 font-semibold text-teal-500">
                            Thanks for signing the agreement!
                        </p>
                    )}
                </div>

                <p className="">You can do this later too</p>

                <div className="mt-4 flex items-start justify-between space-x-4">
                    <button
                        className="btn-clear w-full"
                        onClick={() => router.push("/borrower/dashboard")}
                    >
                        Skip Signing
                    </button>
                    <button
                        className="btn-secondary w-full"
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
