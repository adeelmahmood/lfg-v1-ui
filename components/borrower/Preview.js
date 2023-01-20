import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { SUPABASE_TABLE_LOAN_PROPOSALS } from "../../utils/Constants";
import { useState } from "react";

export default function Preview({ loanProposal, setLoanProposal, handle, ...rest }) {
    const supabase = useSupabaseClient();
    const router = useRouter();
    const user = useUser();

    const [error, setError] = useState();

    let USDollar = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    const getSelected = (value, genValue, manFlag, genFlag) => {
        if (genFlag) return genValue;
        if (manFlag) return value;
    };

    const handleNext = async () => {
        const { data, error } = await supabase.from(SUPABASE_TABLE_LOAN_PROPOSALS).insert({
            ...loanProposal,
            user_id: user.id,
        });
        if (error) {
            setError(error.message);
        } else {
            router.push("/borrower/dashboard");
        }
    };

    return (
        <>
            <div className="mb-8 w-full max-w-2xl px-8" {...rest}>
                <h2 className="text-3xl font-bold text-gray-700">Preview Loan Proposal</h2>

                {error && <p className="mt-5 text-red-500">{error}</p>}

                <div className="mt-10 mb-10">
                    <h2 className="text-left text-4xl font-bold uppercase md:text-center md:text-5xl md:tracking-wider">
                        {getSelected(
                            loanProposal.business_title,
                            loanProposal.business_tagline,
                            loanProposal.tagline_manual_picked,
                            loanProposal.tagline_gen_picked
                        )}
                    </h2>
                    <div className="relative mt-6 pb-2/3 shadow-lg">
                        <img
                            className="absolute h-full w-full rounded-xl object-cover object-center"
                            src={loanProposal.banner_image}
                            alt=""
                        />
                    </div>
                    <div className="mt-6">
                        <p className="text-gray-500">
                            {getSelected(
                                loanProposal.business_description,
                                loanProposal.business_gen_description,
                                loanProposal.description_manual_picked,
                                loanProposal.description_gen_picked
                            )}
                        </p>
                    </div>

                    <div className="mt-6">
                        <p className="text-gray-800">
                            {getSelected(
                                loanProposal.loan_reasoning,
                                loanProposal.loan_gen_reasoning,
                                loanProposal.reasoning_manual_picked,
                                loanProposal.reasoning_gen_picked
                            )}
                        </p>
                    </div>

                    <div className="mt-6 font-semibold">
                        <p>Loan Amount Requested: {USDollar.format(loanProposal.amount)}</p>
                    </div>
                </div>

                <div className="mt-4">
                    <button
                        className="w-full rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={handleNext}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </>
    );
}
