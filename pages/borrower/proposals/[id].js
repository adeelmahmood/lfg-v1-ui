import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SUPABASE_TABLE_LOAN_PROPOSALS } from "../../../utils/Constants";
import ViewProposal from "../../../components/borrower/ViewProposal";
import TopGradient from "../../../components/TopGradient";
import Navbar from "../../../components/Navbar";

export default function LoanProposal({}) {
    const router = useRouter();
    const { id: pid } = router.query;

    const supabase = useSupabaseClient();
    const user = useUser();

    const [loanProposal, setLoanProposal] = useState();

    useEffect(() => {
        async function fetchProposal(pid) {
            console.log("fetching for ", pid);
            const { data, error } = await supabase
                .from(SUPABASE_TABLE_LOAN_PROPOSALS)
                .select()
                .eq("id", pid)
                .single();
            if (data) {
                setLoanProposal(data);
            }
        }

        if (user && router.isReady) fetchProposal(pid);
    }, [user, router.isReady]);

    return (
        <>
            <TopGradient />
            <Navbar />

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
