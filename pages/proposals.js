import TopGradient from "../components/TopGradient";
import BottomGradient from "../components/BottomGradient";
import Navbar from "../components/Navbar";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { SUPABASE_TABLE_LOAN_PROPOSALS } from "../utils/Constants";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function LoanPropospals() {
    const supabase = useSupabaseClient();
    const user = useUser();

    const [proposals, setProposals] = useState();

    const fetchProposals = async () => {
        const { data, error } = await supabase
            .from(SUPABASE_TABLE_LOAN_PROPOSALS)
            .select(
                `*, loan_proposals_status (*), user_identity_verifications ( verification_status, verification_message)`
            )
            .eq("user_id", user.id);

        setProposals(data);
    };

    useEffect(() => {
        if (user) fetchProposals();
    }, [user]);

    const getSelected = (value, genValue, manFlag, genFlag) => {
        if (genFlag) return genValue;
        if (manFlag) return value;
    };

    const trimText = (text, limit) => {
        return text && text.length > limit ? text.substring(0, limit) + " ..." : text;
    };

    const isVerified = (p) => {
        return (
            p?.user_identity_verifications?.length > 0 &&
            p.user_identity_verifications[0]?.verification_status == "verified"
        );
    };

    const getStatus = (p) => {
        return p?.loan_proposals_status?.length > 0 && p.loan_proposals_status[0].status;
    };

    const getVerificationReason = (p) => {
        return p?.user_identity_verifications?.length > 0 &&
            p.user_identity_verifications[0].verification_message
            ? p.user_identity_verifications[0].verification_message
            : "Unverified";
    };

    return (
        <>
            <TopGradient />
            <Navbar />

            <div className="pt- container mx-auto p-6">
                <div className="mt-8 mb-4 flex items-center justify-between">
                    <h2 className="max-w-6xl text-5xl font-bold tracking-wider text-white">
                        <span className="bg-gradient-to-r from-indigo-500 to-green-600 bg-clip-text text-transparent">
                            Loan Proposals
                        </span>
                    </h2>
                </div>

                <p className="mt-2 mb-8 text-left leading-8 text-gray-600 dark:text-gray-300">
                    Review the proposals started by the borrowers. Participate in the governance by
                    reviewing and voting on these proposals
                </p>

                <div className="mt-10 grid grid-cols-1 gap-14 md:grid-cols-2 lg:grid-cols-3">
                    {proposals?.map((p, i) => {
                        return (
                            <div
                                key={i}
                                className="relative w-full cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-xl dark:bg-gray-700/50 dark:hover:shadow-md dark:hover:shadow-white"
                            >
                                <div className="relative pb-2/3">
                                    <img
                                        className="absolute h-full w-full object-cover object-center"
                                        src={p.banner_image}
                                        alt=""
                                    />
                                </div>

                                {isVerified(p) ? (
                                    <div
                                        aria-hidden="true"
                                        className="absolute -right-12 top-4 m-0 grid h-12 w-44 rotate-45 place-items-center rounded-lg bg-green-600 shadow-md"
                                    >
                                        <CheckCircleIcon
                                            className="absolute  inline h-8 -rotate-45 fill-current text-white"
                                            title="Identity Verified Successfully"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        aria-hidden="true"
                                        className="absolute -right-12 top-4 m-0 grid h-12 w-44 rotate-45 place-items-center rounded-lg bg-orange-600 shadow-md"
                                    >
                                        <ExclamationCircleIcon
                                            className="absolute inline h-8 -rotate-45 fill-current text-white"
                                            title={getVerificationReason(p)}
                                        />
                                    </div>
                                )}

                                <div className="px-6 py-4">
                                    <div className="text-xl font-bold dark:text-gray-300">
                                        {getSelected(
                                            p.business_title,
                                            p.business_tagline,
                                            p.tagline_manual_picked,
                                            p.tagline_gen_picked
                                        )}
                                    </div>
                                    <p className="mt-2 text-base text-gray-700 dark:text-gray-400">
                                        {trimText(
                                            getSelected(
                                                p.business_description,
                                                p.business_gen_description,
                                                p.description_manual_picked,
                                                p.description_gen_picked
                                            ),
                                            100
                                        )}
                                    </p>
                                    <p className="mt-2 text-base text-gray-700 dark:text-gray-400">
                                        {trimText(
                                            getSelected(
                                                p.loan_reasoning,
                                                p.loan_gen_reasoning,
                                                p.reasoning_manual_picked,
                                                p.reasoning_gen_picked
                                            ),
                                            100
                                        )}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <BottomGradient />
        </>
    );
}
