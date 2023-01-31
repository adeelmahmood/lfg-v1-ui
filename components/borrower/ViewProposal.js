import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

export default function ViewProposal({ loanProposal, ...rest }) {
    const supabase = useSupabaseClient();
    const user = useUser();

    let USDollar = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    const getSelected = (value, genValue, manFlag, genFlag) => {
        if (genFlag) return genValue;
        if (manFlag) return value;
    };

    const displayDate = (date) => {
        return (date ? new Date(date) : new Date()).toLocaleDateString("en-us", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <>
            <div className="mt-10 mb-10">
                <div className="mb-10 flex items-center md:justify-center">
                    <div className="block h-24 w-24 overflow-hidden rounded-full border-2 border-indigo-400 hover:shadow-md focus:outline-none">
                        <img
                            src={user?.user_metadata.avatar_url}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="ml-5 flex flex-col">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {user?.user_metadata.full_name}
                        </span>
                        <span className="text-sm text-gray-500">Proposal Creator</span>
                        <span className="text-sm text-gray-500">
                            {displayDate(loanProposal.created_at)}
                        </span>
                    </div>
                </div>
                <h2 className="text-left text-4xl font-bold uppercase text-gray-800 dark:text-gray-200 md:text-center md:text-5xl md:tracking-wider">
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
                    <p className="text-gray-500 dark:text-gray-200">
                        {getSelected(
                            loanProposal.business_description,
                            loanProposal.business_gen_description,
                            loanProposal.description_manual_picked,
                            loanProposal.description_gen_picked
                        )}
                    </p>
                </div>

                <div className="mt-6">
                    <p className="text-gray-800 dark:text-gray-200">
                        {getSelected(
                            loanProposal.loan_reasoning,
                            loanProposal.loan_gen_reasoning,
                            loanProposal.reasoning_manual_picked,
                            loanProposal.reasoning_gen_picked
                        )}
                    </p>
                </div>

                <div className="mt-6 font-semibold text-gray-800 dark:text-gray-200">
                    <p>Loan Amount Requested: {USDollar.format(loanProposal.amount)}</p>
                </div>
            </div>
        </>
    );
}
