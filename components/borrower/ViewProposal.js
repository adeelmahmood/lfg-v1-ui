import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import CastVoteDialog from "./governance/CastVoteDialog";
import GovernanceInfoPanel from "./governance/GovernanceInfoPanel";
import QueuePropoposalDialog from "./governance/QueuePropoposalDialog";
import ExecutePropoposalDialog from "./governance/ExecuteProposalDialog";
import LikeProposal from "./LikePropoposal";
import AskQuestion from "./AskQuestion";

export default function ViewProposal({ loanProposal, canVote, canQueue, canExecute, ...rest }) {
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

    const isPublished = (p) => {
        return (
            p.onchain_proposal_id && p?.loan_proposals_status?.find((s) => s.status == "Published")
        );
    };

    return (
        <>
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
                    <div className="flex flex-col items-end justify-center space-y-2">
                        <LikeProposal loanProposal={loanProposal} setLoanProposal={null} />
                        {isPublished(loanProposal) && canVote?.() && (
                            <CastVoteDialog
                                loanProposal={loanProposal}
                                onVoteSuccess={() => window.location.reload(false)}
                            />
                        )}

                        {isPublished(loanProposal) && canQueue?.() && (
                            <QueuePropoposalDialog
                                loanProposal={loanProposal}
                                onQueuedSuccess={() => window.location.reload(false)}
                            />
                        )}

                        {isPublished(loanProposal) && canExecute?.() && (
                            <ExecutePropoposalDialog
                                loanProposal={loanProposal}
                                onQueuedSuccess={() => window.location.reload(false)}
                            />
                        )}
                    </div>
                </div>
                {isPublished(loanProposal) && (
                    <div className="mt-4">
                        <GovernanceInfoPanel
                            loanProposal={loanProposal}
                            canVote={canVote}
                            canQueue={canQueue}
                            canExecute={canExecute}
                        />
                    </div>
                )}
                <div className="mt-6">
                    <h3 className="text-3xl text-gray-400 dark:text-gray-400">Who Are We</h3>
                    <p className="mt-3 text-gray-800 dark:text-gray-200">
                        {getSelected(
                            loanProposal.business_description,
                            loanProposal.business_gen_description,
                            loanProposal.description_manual_picked,
                            loanProposal.description_gen_picked
                        )}
                    </p>
                </div>
                <div className="relative mt-4 pb-2/3 shadow-lg">
                    <img
                        className="absolute h-full w-full rounded-xl object-cover object-center"
                        src={loanProposal.banner_image}
                        alt=""
                    />
                </div>

                <div className="mt-4">
                    <h3 className="text-3xl text-gray-400 dark:text-gray-400">
                        How will we use the Funds
                    </h3>
                    <p className="mt-3 text-gray-800 dark:text-gray-200">
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

                {loanProposal.tags && (
                    <div className="mt-6 flex w-full flex-wrap px-4">
                        {loanProposal.tags?.split(",").map((tag, i) => {
                            return (
                                <span
                                    key={i}
                                    className="mr-2 mb-2 rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-300 dark:text-gray-900"
                                >
                                    {tag}
                                </span>
                            );
                        })}
                    </div>
                )}

                <div className="mt-6">
                    <AskQuestion loanProposal={loanProposal} setLoanProposal={null} />
                </div>
            </div>
        </>
    );
}
