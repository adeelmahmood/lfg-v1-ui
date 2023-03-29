import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SUPABASE_TABLE_LOAN_PROPOSALS } from "../../../utils/Constants";
import ViewProposal from "../../../components/borrower/ViewProposal";
import TopGradient from "../../../components/ui/TopGradient";
import Navbar from "../../../components/Navbar";
import BottomGradient from "../../../components/ui/BottomGradient";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import PayoutDetails from "../../../components/borrower/payout/PayoutDetails";

export default function LoanProposal() {
    const router = useRouter();
    const { id: pid } = router.query;

    const supabase = useSupabaseClient();
    const user = useUser();

    const [loanProposal, setLoanProposal] = useState();

    useEffect(() => {
        async function fetchProposal(pid) {
            // TODO error not handled
            const { data: p, error } = await supabase
                .from(SUPABASE_TABLE_LOAN_PROPOSALS)
                .select(
                    `*, 
                loan_proposals_status (*), 
                payouts (*),
                user_identity_verifications ( verification_status, verification_message),
                loan_agreement_signatures ( signature_request_id, status, signed_at)`
                )
                .eq("id", pid)
                .single();
            if (p) {
                setLoanProposal(p);
            }
        }

        if (user && router.isReady) fetchProposal(pid);
    }, [user, router.isReady]);

    return (
        <>
            <TopGradient />
            <Navbar />

            <div className="container mx-auto p-6">
                <div className="">
                    <a href="#" onClick={() => router.back()} className="flex items-center">
                        <ArrowLeftCircleIcon className="h-8 fill-current text-indigo-700 focus:outline-none dark:text-gray-200" />
                        <span className="ml-2 text-gray-700 dark:text-gray-200">Go Back</span>
                    </a>
                </div>

                <div className="mt-4 mb-4 flex items-center justify-between md:mt-2">
                    <h2 className="max-w-6xl text-5xl font-bold tracking-wider text-white">
                        <span className="bg-gradient-to-r from-indigo-500 to-green-600 bg-clip-text text-transparent">
                            Payout Details
                        </span>
                    </h2>
                </div>

                <h3 className="mt-6 text-3xl font-bold text-gray-700 dark:text-gray-300">
                    {loanProposal?.business_title || loanProposal?.business_tagline}
                </h3>

                {loanProposal && <PayoutDetails loanProposal={loanProposal} />}
            </div>

            <BottomGradient />
        </>
    );
}
