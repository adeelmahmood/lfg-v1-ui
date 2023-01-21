import TopGradient from "../../components/TopGradient";
import BottomGradient from "../../components/BottomGradient";
import Navbar from "../../components/Navbar";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { SUPABASE_TABLE_LOAN_PROPOSALS } from "../../utils/Constants";
import HeroCard from "../../components/HeroCard";
import Link from "next/link";

export default function BorrowerGenInfo() {
    const supabase = useSupabaseClient();
    const user = useUser();

    const [proposals, setProposals] = useState();

    const fetchProposals = async () => {
        console.log("fetching proposals for", user.id);
        const { data, error } = await supabase
            .from(SUPABASE_TABLE_LOAN_PROPOSALS)
            .select()
            .eq("user_id", user.id);

        const proposalsData = [];
        setProposals(
            data.map(async (p) => {
                let bImage = p.banner_image;
                if (bImage && !bImage.startsWith("http")) {
                    const { data, error } = await supabase.storage
                        .from("loanproposals")
                        .getPublicUrl(bImage);
                    if (data) {
                        bImage = data.publicUrl;
                    }
                }
                proposalsData.push({
                    ...p,
                    banner_image: bImage,
                });
            })
        );
        setProposals(proposalsData);
    };

    useEffect(() => {
        if (user) fetchProposals();
    }, [user]);

    const getSelected = (value, genValue, manFlag, genFlag) => {
        if (genFlag) return genValue;
        if (manFlag) return value;
    };

    const trimText = (text, limit) => {
        return text.length > limit ? text.substring(0, limit) + " ..." : text;
    };

    return (
        <>
            <TopGradient />
            <Navbar />

            <div className="container mx-auto p-6">
                <div className="mt-8 mb-4 flex items-center justify-between">
                    <h2 className="text-4xl font-bold">Borrower Dashboard</h2>
                    <a
                        href="/borrower/create"
                        className="rounded-lg border border-gray-400 bg-indigo-500 py-2 px-4 text-white hover:bg-indigo-700 md:font-semibold"
                    >
                        Create New Loan Proposal
                    </a>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
                    {proposals?.map((p) => {
                        return (
                            <div className="w-full space-y-5 overflow-hidden rounded shadow-lg">
                                <div className="relative pb-2/3">
                                    <img
                                        className="absolute h-full w-full object-cover object-center"
                                        src={p.banner_image}
                                        alt=""
                                    />
                                </div>
                                <div className="px-6 py-4">
                                    <div className="mb-2 text-xl font-bold">
                                        {getSelected(
                                            p.business_title,
                                            p.business_tagline,
                                            p.tagline_manual_picked,
                                            p.tagline_gen_picked
                                        )}
                                    </div>
                                    <p className="mt-2 text-base text-gray-700">
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
                                    <p className="mt-4 text-base text-gray-700">
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
                                <div className="flex items-center justify-between px-6 pb-2">
                                    <span className="mr-2 mb-2 inline-block rounded-full bg-teal-500 px-3 py-1 text-sm font-semibold text-white">
                                        {p.status}
                                    </span>
                                    <div className="space-x-2">
                                        <Link
                                            href={`/borrower/proposals/${p.id}`}
                                            className="rounded-md border border-transparent bg-blue-100 px-2 py-1 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        >
                                            View
                                        </Link>
                                        <a
                                            href="#"
                                            className="rounded-md border border-transparent bg-blue-100 px-2 py-1 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        >
                                            Modify
                                        </a>
                                    </div>
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
