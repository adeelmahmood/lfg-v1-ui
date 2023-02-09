import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import {
    HandThumbUpIcon,
    EnvelopeOpenIcon,
    ArrowUpOnSquareStackIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import CastVoteDialog from "./governance/CastVoteDialog";
import ProposalState from "./governance/ProposalState";
import VoteCounts from "./governance/VoteCounts";

export default function ViewProposal({ loanProposal, ...rest }) {
    const supabase = useSupabaseClient();
    const user = useUser();

    const [proposeModal, setProposeModal] = useState(false);

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

    const isPublished = (p) => {
        return p?.loan_proposals_status?.find((s) => s.status == "Published");
    };

    return (
        <>
            {proposeModal && (
                <ProposeLoanDialog
                    isModelOpen={proposeModal}
                    modelCloseHandler={() => setProposeModal(false)}
                    loanProposal={loanProposal}
                />
            )}

            <div className="mt-8 mb-10 max-w-2xl">
                <h2 className="mb-2 text-left text-3xl font-bold uppercase tracking-tight text-gray-800 dark:text-gray-200 md:text-4xl md:tracking-wide">
                    Loan Proposal
                </h2>
                <h2 className="text-left text-5xl font-bold tracking-tight text-white md:text-6xl md:tracking-wide">
                    <span className="bg-gradient-to-r from-indigo-500 to-green-600 bg-clip-text uppercase text-transparent">
                        {getSelected(
                            loanProposal.business_title,
                            loanProposal.business_tagline,
                            loanProposal.tagline_manual_picked,
                            loanProposal.tagline_gen_picked
                        )}
                    </span>
                </h2>
                <div className="mt-6 flex justify-between">
                    <div className="flex items-center md:justify-center">
                        <div className="block h-24 w-24 overflow-hidden rounded-full border-indigo-400 ring-2 hover:shadow-md focus:outline-none">
                            <img
                                src={user?.user_metadata.avatar_url}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="ml-3 flex flex-col">
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                                {user?.user_metadata.full_name}
                            </span>
                            <span className="text-sm text-gray-500">Proposal Creator</span>
                            <span className="text-sm text-gray-500">
                                {displayDate(loanProposal.created_at)}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                        <button className="btn-clear text-base" disabled={true}>
                            <HandThumbUpIcon className="inline h-6 fill-current align-top text-gray-800 dark:text-gray-200" />
                            <span className="ml-2 hidden md:inline">Like this Proposal</span>
                        </button>
                        {isPublished(loanProposal) && (
                            <CastVoteDialog loanProposal={loanProposal} />
                        )}
                    </div>
                </div>
                {loanProposal.onchain_proposal_id && (
                    <div className="mt-2 flex flex-col items-start justify-between rounded-lg bg-gray-600 px-4 py-2 text-gray-200 shadow md:flex-row md:items-center">
                        <ProposalState proposalId={loanProposal.onchain_proposal_id} />
                        <VoteCounts proposalId={loanProposal.onchain_proposal_id} />
                    </div>
                )}
                <div className="relative mt-2 pb-2/3 shadow-lg">
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
