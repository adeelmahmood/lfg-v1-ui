import TopGradient from "../../components/TopGradient";
import BottomGradient from "../../components/BottomGradient";
import Navbar from "../../components/Navbar";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { SUPABASE_TABLE_LOAN_PROPOSALS } from "../../utils/Constants";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function BorrowerGenInfo() {
    const supabase = useSupabaseClient();
    const user = useUser();

    const [proposals, setProposals] = useState();

    const fetchProposals = async () => {
        const { data, error } = await supabase
            .from(SUPABASE_TABLE_LOAN_PROPOSALS)
            .select(`*,user_identity_verifications ( verification_status, verification_message)`)
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

    const getVerificationReason = (p) => {
        console.log(p);
        return p?.user_identity_verifications?.length > 0 &&
            p.user_identity_verifications[0]?.verification_message
            ? p.user_identity_verifications[0]?.verification_message
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
                            Borrwer Dashboard
                        </span>
                    </h2>
                </div>

                <h3 className="mt-6 text-3xl font-bold text-gray-700 dark:text-gray-200">
                    Create a loan proposal
                </h3>
                <p className="mt-2 mb-8 text-left leading-8 text-gray-600 dark:text-gray-300">
                    A loan proposal is not a loan application. The idea is for you to provide us
                    with all the information you can about yourself, your business, and the reason
                    why you need the loan. We will prepare all this information in the form a loan
                    proposal and present it to the lenders community on this platform. It is then up
                    to the lenders to vote on this proposal and accept the proposal.
                </p>

                <div>
                    <a href="/borrower/proposals/create" className="btn-secondary w-full">
                        Create New Loan Proposal
                    </a>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-14 md:grid-cols-2 lg:grid-cols-3">
                    {proposals?.map((p, i) => {
                        return (
                            <div
                                key={i}
                                className="relative w-full space-y-5 overflow-hidden rounded-xl shadow-lg dark:bg-gray-700/50"
                            >
                                <div className="relative pb-2/3">
                                    <img
                                        className="absolute h-full w-full object-cover object-center"
                                        src={p.banner_image}
                                        alt=""
                                    />
                                </div>

                                {isVerified(p) ? (
                                    <div className="absolute -right-10 -top-2 m-0 grid h-12 w-40 rotate-45 place-items-center rounded-lg bg-green-600 shadow-md">
                                        <CheckCircleIcon
                                            className="absolute  inline h-8 -rotate-45 fill-current text-white"
                                            title="Identity Verified Successfully"
                                        />
                                    </div>
                                ) : (
                                    <div className="absolute -right-10 -top-2 m-0 grid h-12 w-40 rotate-45 place-items-center rounded-lg bg-orange-600 shadow-md">
                                        <ExclamationCircleIcon
                                            className="absolute inline h-8 -rotate-45 fill-current text-white"
                                            title={getVerificationReason(p)}
                                        />
                                    </div>
                                )}

                                <div className="px-6 pt-4">
                                    <div className="mb-2 text-xl font-bold dark:text-gray-300">
                                        {getSelected(
                                            p.business_title,
                                            p.business_tagline,
                                            p.tagline_manual_picked,
                                            p.tagline_gen_picked
                                        )}
                                    </div>
                                    <p className="mt-4 text-base text-gray-700 dark:text-gray-400">
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
                                <div className="flex flex-col items-start space-y-2 px-4 pb-4 dark:text-gray-300">
                                    <div className="rounded-lg px-2 py-1">
                                        <span className="">Proposal Status:</span>
                                        <span className="font-semibold"> {p.status}</span>
                                    </div>
                                    <Link
                                        href={`/borrower/proposals/${p.id}`}
                                        className="rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        View Proposal
                                    </Link>
                                    <button
                                        href={`/borrower/proposals/${p.id}`}
                                        className="rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        disabled={true}
                                    >
                                        Edit Proposal
                                    </button>
                                    <button
                                        href={`/borrower/proposals/${p.id}`}
                                        className="rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        disabled={true}
                                    >
                                        Delete Proposal
                                    </button>
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
