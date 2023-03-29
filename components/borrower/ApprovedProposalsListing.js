import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { SUPABASE_TABLE_LOAN_PROPOSALS } from "../../utils/Constants";
import { isExecuted } from "../../utils/ProposalChecks";
import Link from "next/link";

export default function ApprovedProposalsListing({}) {
    const supabase = useSupabaseClient();
    const user = useUser();

    const [isLoading, setIsLoading] = useState(false);
    const [proposals, setProposals] = useState([]);

    const fetchProposals = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from(SUPABASE_TABLE_LOAN_PROPOSALS)
            .select(
                `*, 
                loan_proposals_status (*), 
                payouts (*),
                user_identity_verifications ( verification_status, verification_message),
                loan_agreement_signatures ( signature_request_id, status, signed_at)`
            )
            .order("created_at", { ascending: false })
            .eq("user_id", user.id);

        setIsLoading(false);
        if (error) {
            setError(error.message);
        } else {
            setProposals(data.filter((p) => isExecuted(p)));
        }
    };

    useEffect(() => {
        if (user && proposals.length == 0) fetchProposals();
    }, [user]);

    const getSelected = (value, genValue, manFlag, genFlag) => {
        if (genFlag) return genValue;
        if (manFlag) return value;
    };

    const trimText = (text, limit) => {
        return text && text.length > limit ? text.substring(0, limit) + " ..." : text;
    };

    const getLatestPayoutStatus = (lp) => {
        const payouts = lp.payouts;
        payouts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return payouts.length > 0 ? payouts[0].status : "";
    };

    return (
        <>
            <div className="mt-4 hidden overflow-x-auto rounded-lg shadow-md sm:flex">
                <table className="w-full text-left text-sm text-gray-800">
                    <thead className="bg-slate-600 text-xs uppercase tracking-wider text-gray-200 dark:bg-gray-600">
                        <tr>
                            <th scope="col" className="py-3 px-6" colSpan={2}>
                                Approved Proposal
                            </th>
                            <th scope="col" className="py-3 px-6 text-center">
                                Payout Status
                            </th>
                            <th scope="col" className="py-3 px-6 text-center">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {!isLoading && proposals.length == 0 && (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="py-4 px-6 font-semibold dark:text-gray-200"
                                >
                                    No Approved Proposals Yet
                                </td>
                            </tr>
                        )}
                        {proposals.map((p, index) => {
                            return (
                                <tr
                                    key={index}
                                    className="border-t border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-500 dark:bg-gray-500/20 dark:hover:bg-gray-600/20"
                                >
                                    <td className="py-4 px-6" colSpan={2}>
                                        <div className="flex">
                                            <img
                                                className="h-28 w-44 flex-shrink-0 rounded-lg object-cover object-center"
                                                src={p.banner_image}
                                                alt=""
                                            />
                                            <div className="ml-5">
                                                <div className="mb-2 max-w-2xl text-xl font-bold dark:text-gray-300">
                                                    {getSelected(
                                                        p.business_title,
                                                        p.business_tagline,
                                                        p.tagline_manual_picked,
                                                        p.tagline_gen_picked
                                                    )}
                                                </div>
                                                <p className="max-w-2xl text-base text-gray-700 dark:text-gray-400">
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
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center dark:text-gray-400">
                                        <span className="uppercase">
                                            {p.payout_mode === "crypto"
                                                ? "Tokens Sent"
                                                : getLatestPayoutStatus(p)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        {p.payout_mode === "fiat" && (
                                            <Link
                                                href={`/borrower/payouts/${p.id}`}
                                                className="btn-clear"
                                            >
                                                Payout Details
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-14 sm:hidden md:grid-cols-2 lg:grid-cols-3">
                {proposals?.map((p, i) => {
                    return (
                        <div
                            key={i}
                            className="relative w-full space-y-5 overflow-hidden rounded-xl bg-gray-50 shadow-lg dark:bg-gray-800"
                        >
                            <div>
                                <div className="flex px-4 pt-4">
                                    <img
                                        className="h-24 w-24 flex-shrink-0 rounded-full object-cover object-center"
                                        src={p.banner_image}
                                        alt=""
                                    />
                                    <div className="ml-5">
                                        <div className="mb-2 text-xl font-bold dark:text-gray-200">
                                            {getSelected(
                                                p.business_title,
                                                p.business_tagline,
                                                p.tagline_manual_picked,
                                                p.tagline_gen_picked
                                            )}
                                        </div>
                                        <p className="text-base text-gray-700 dark:text-gray-400">
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
                                </div>
                            </div>
                            <div className="flex flex-col px-4 pb-4">
                                <div className="flex items-center justify-between">
                                    <div>Payout Status:</div>
                                    <div className="font-semibold">
                                        {p.payout_mode === "crypto"
                                            ? "Tokens Sent"
                                            : getLatestPayoutStatus(p)}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    {p.payout_mode === "fiat" && (
                                        <Link
                                            href={`/borrower/payouts/${p.id}`}
                                            className="btn-clear"
                                        >
                                            Payout Details
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}