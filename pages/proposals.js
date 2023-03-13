import TopGradient from "../components/ui/TopGradient";
import BottomGradient from "../components/ui/BottomGradient";
import Navbar from "../components/Navbar";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { SUPABASE_TABLE_LOAN_PROPOSALS } from "../utils/Constants";
import {
    ArrowLongLeftIcon,
    ArrowLongRightIcon,
    CheckBadgeIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { isSigned, isVerified } from "../utils/ProposalChecks";
import useIsMounted from "../hooks/useIsMounted";

export default function LoanPropospals() {
    const supabase = useSupabaseClient();
    const user = useUser();

    const [proposals, setProposals] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const isMounted = useIsMounted();

    const fetchProposals = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from(SUPABASE_TABLE_LOAN_PROPOSALS)
            .select(
                `*, 
                loan_proposals_status (*), 
                user_identity_verifications ( verification_status, verification_message),
                loan_agreement_signatures ( signature_request_id, status, signed_at)`
            )
            .order("created_at", { ascending: false });

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

    const leftScroll = () => {
        document.getElementById("slider").scrollLeft -= 280;
    };
    const rightScroll = () => {
        document.getElementById("slider").scrollLeft += 280;
    };

    const allChecksPassed = (p) => {
        return isVerified(p) && isSigned(p);
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
                            <div className="mt-2 flex w-full flex-col items-end md:flex-row md:items-center">
                                <div
                                    id="slider"
                                    className="h-full w-full snap-x space-x-8 overflow-x-scroll scroll-smooth whitespace-nowrap rounded-lg scrollbar-hide"
                                >
                                    {proposals?.map((p, i) => {
                                        return (
                                            <div
                                                key={i}
                                                className="relative inline-block h-[600px] w-[320px] snap-mandatory snap-center overflow-hidden rounded-xl bg-gray-50 shadow-md dark:bg-slate-700 md:h-[580px] md:w-[400px]"
                                            >
                                                <Link
                                                    href={`/borrower/proposals/${p.id}`}
                                                    className="group"
                                                >
                                                    {isMounted && allChecksPassed(p) && (
                                                        <div
                                                            aria-hidden="true"
                                                            className="absolute -right-12 top-8 m-0 grid h-8 w-48 rotate-45 place-items-center rounded-lg bg-emerald-400 text-sm text-white shadow-md"
                                                        >
                                                            <CheckBadgeIcon className="inline h-8 -rotate-12 transform fill-current text-white dark:text-gray-200" />
                                                        </div>
                                                    )}

                                                    <div className="whitespace-normal px-6 py-4">
                                                        <div className="mt-2 h-16 text-xl font-bold dark:text-gray-200">
                                                            {getSelected(
                                                                p.business_title,
                                                                p.business_tagline,
                                                                p.tagline_manual_picked,
                                                                p.tagline_gen_picked
                                                            )}
                                                        </div>
                                                        <div className="p-2">
                                                            <img
                                                                className="h-72 w-full rounded-xl object-cover object-center group-hover:scale-105 group-hover:duration-300 group-hover:ease-in-out"
                                                                src={p.banner_image}
                                                                alt=""
                                                            />
                                                        </div>
                                                        <p className="mt-2 max-w-xs text-base text-gray-700 dark:text-gray-200 md:h-16">
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
                                                    </div>
                                                    <div className="mt-2 flex w-full flex-wrap px-4 md:mt-4">
                                                        {p.tags?.split(",").map((tag, i) => {
                                                            return (
                                                                <span
                                                                    key={i}
                                                                    className="mr-2 mb-2 rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-700 shadow-md dark:bg-gray-300 dark:text-gray-900"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            );
                                                        })}
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
