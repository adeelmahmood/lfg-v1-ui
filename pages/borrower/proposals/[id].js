import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SUPABASE_TABLE_LOAN_PROPOSALS } from "../../../utils/Constants";
import ViewProposal from "../../../components/borrower/ViewProposal";
import TopGradient from "../../../components/TopGradient";
import Navbar from "../../../components/Navbar";
import {
    ChevronDoubleDownIcon,
    ChevronDoubleUpIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import PublishLoanDialog from "../../../components/borrower/governance/PublishLoanDialog";

export default function LoanProposal({}) {
    const router = useRouter();
    const { id: pid } = router.query;

    const supabase = useSupabaseClient();
    const user = useUser();

    const [loanProposal, setLoanProposal] = useState();

    useEffect(() => {
        async function fetchProposal(pid) {
            const { data, error } = await supabase
                .from(SUPABASE_TABLE_LOAN_PROPOSALS)
                .select(
                    `*, 
                    loan_proposals_status (*), 
                    user_identity_verifications ( verification_status, verification_message)`
                )
                .eq("id", pid)
                .single();
            if (data) {
                setLoanProposal(data);
            }
        }

        if (user && router.isReady) fetchProposal(pid);
    }, [user, router.isReady]);

    const [propNotPubHeaderExp, setPropNotPubHeaderExp] = useState(false);

    const isPublished = (p) => {
        return p?.loan_proposals_status?.find((s) => s.status == "Published");
    };

    return (
        <>
            <TopGradient />
            <Navbar />

            {!isPublished(loanProposal) && (
                <div className="flex flex-col items-start bg-yellow-600 p-4 shadow-lg dark:bg-yellow-600">
                    <div className="flex w-full justify-between">
                        <p className="flex items-center text-lg font-semibold text-gray-100">
                            <ExclamationCircleIcon className="hidden h-6 fill-current text-gray-200 sm:inline" />
                            <span className="ml-2">
                                This proposal has not been published yet!
                                <button
                                    onClick={() => setPropNotPubHeaderExp(!propNotPubHeaderExp)}
                                >
                                    {!propNotPubHeaderExp ? (
                                        <ChevronDoubleDownIcon className="ml-2 inline h-6 fill-current text-gray-200" />
                                    ) : (
                                        <ChevronDoubleUpIcon className="ml-2 inline h-6 fill-current text-gray-200" />
                                    )}
                                </button>
                            </span>
                        </p>
                        {loanProposal && <PublishLoanDialog loanProposal={loanProposal} />}
                    </div>
                    {propNotPubHeaderExp && (
                        <div className="mt-4">
                            <div className="text-gray-100" id="topPropWarningHeaderExpInfo">
                                Until a proposal is published, it is not visible by the broader
                                community to be able to discover and vote on.
                            </div>
                            <div className="text-gray-100">
                                This is an <span className="underline">essential step</span> in
                                completing the loan proposal process.
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="container mx-auto max-w-2xl p-6">
                {loanProposal && (
                    <>
                        <ViewProposal loanProposal={loanProposal} />
                        <div>
                            <button className="w-full rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">
                                Vote on this Proposal
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
