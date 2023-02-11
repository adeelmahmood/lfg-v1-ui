import TopGradient from "../components/TopGradient";
import BottomGradient from "../components/BottomGradient";
import Navbar from "../components/Navbar";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { SUPABASE_TABLE_LOAN_PROPOSALS } from "../utils/Constants";
import {
    ArrowLongLeftIcon,
    ArrowLongRightIcon,
    CheckCircleIcon,
    ChevronRightIcon,
    ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";

export default function LoanPropospals() {
    const supabase = useSupabaseClient();
    const user = useUser();

    const [proposals, setProposals] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const fetchProposals = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from(SUPABASE_TABLE_LOAN_PROPOSALS)
            .select(
                `*, loan_proposals_status (*), user_identity_verifications ( verification_status, verification_message)`
            )
            .order("created_at", { ascending: false })
            .eq("user_id", user.id);

        setIsLoading(false);
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
        return text && text.length > limit ? text.substring(0, limit) + "..." : text;
    };

    const isVerified = (p) => {
        return (
            p?.user_identity_verifications?.length > 0 &&
            p.user_identity_verifications[0]?.verification_status == "verified"
        );
    };

    const getVerificationReason = (p) => {
        return p?.user_identity_verifications?.length > 0 &&
            p.user_identity_verifications[0].verification_message
            ? p.user_identity_verifications[0].verification_message
            : "Unverified";
    };

    const leftScroll = () => {
        document.getElementById("slider").scrollLeft -= 800;
    };
    const rightScroll = () => {
        document.getElementById("slider").scrollLeft += 800;
    };

    return (
        <>
            <TopGradient />
            <Navbar />

            <div className="container mx-auto p-6">
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

                <div className="mt-8">
                    {isLoading && (
                        <div className="text-gray-800 dark:text-gray-200">Loading Data ...</div>
                    )}
                    {!isLoading && proposals.length == 0 && (
                        <div className="text-gray-800 dark:text-gray-200">No Proposals Yet</div>
                    )}
                    {proposals?.length > 0 && (
                        <>
                            <div className="text-lg text-gray-800 dark:text-gray-200">
                                All Proposals
                            </div>
                            <div className="mt-2 flex w-full flex-col items-end md:flex-row md:items-center">
                                <div
                                    id="slider"
                                    className="h-full w-full space-x-8 overflow-x-scroll scroll-smooth whitespace-nowrap rounded-lg scrollbar-hide"
                                >
                                    {proposals?.map((p, i) => {
                                        return (
                                            <div
                                                key={i}
                                                className="relative inline-block h-[420px] w-[320px] overflow-hidden rounded-xl shadow-md dark:bg-gray-700/50 md:duration-300 md:ease-in-out md:hover:scale-105"
                                            >
                                                <Link href={`/borrower/proposals/${p.id}`}>
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

                                                    <div className="h-full whitespace-normal px-6 py-4">
                                                        <div className="text-xl font-bold dark:text-gray-300">
                                                            {getSelected(
                                                                p.business_title,
                                                                p.business_tagline,
                                                                p.tagline_manual_picked,
                                                                p.tagline_gen_picked
                                                            )}
                                                        </div>
                                                        <p className="mt-2 max-w-xs text-base text-gray-700 dark:text-gray-400">
                                                            {trimText(
                                                                getSelected(
                                                                    p.business_description,
                                                                    p.business_gen_description,
                                                                    p.description_manual_picked,
                                                                    p.description_gen_picked
                                                                ),
                                                                50
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
                                                                50
                                                            )}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                                <button onClick={rightScroll} className="hidden md:block">
                                    <ChevronRightIcon className="h-12 w-12 cursor-pointer opacity-50 hover:opacity-100 " />
                                </button>
                                <div className="flex w-full items-center justify-between md:hidden">
                                    <button onClick={leftScroll}>
                                        <ArrowLongLeftIcon className="h-12 w-12 cursor-pointer opacity-50 hover:opacity-100 " />
                                    </button>
                                    <button onClick={rightScroll}>
                                        <ArrowLongRightIcon className="h-12 w-12 cursor-pointer opacity-50 hover:opacity-100 " />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <BottomGradient />
        </>
    );
}
