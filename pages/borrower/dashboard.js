import TopGradient from "../../components/TopGradient";
import BottomGradient from "../../components/BottomGradient";
import Navbar from "../../components/Navbar";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { SUPABASE_TABLE_LOAN_PROPOSALS } from "../../utils/Constants";
import Link from "next/link";
import DialogComponent from "../../components/DialogComponent";
import {
    CheckCircleIcon,
    CheckIcon,
    DocumentCheckIcon,
    ShieldCheckIcon,
    ShieldExclamationIcon,
} from "@heroicons/react/24/solid";
import { stripeVerification } from "../../utils/Stripe";
import { generateSignatureRequest, getHelloSignClient } from "../../utils/HelloSign";

export default function BorrowerGenInfo() {
    const supabase = useSupabaseClient();
    const user = useUser();

    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSigning, setIsSigning] = useState(false);
    const [signed, setSigned] = useState([]);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verified, setVerified] = useState([]);
    const [error, setError] = useState();

    const [proposals, setProposals] = useState([]);
    const [selected, setSelected] = useState();

    const [deleteModal, setDeleteModal] = useState(false);

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
            .order("created_at", { ascending: false })
            .eq("user_id", user.id);

        setIsLoading(false);
        if (error) {
            setError(error.message);
        } else {
            setProposals(data);
        }
    };

    const deleteProposal = (p) => {
        setSelected(p);
        setDeleteModal(true);
    };

    const handleDeleteProposal = async (p) => {
        setIsDeleting(true);
        const { error } = await supabase
            .from(SUPABASE_TABLE_LOAN_PROPOSALS)
            .delete()
            .eq("id", p.id);
        if (error) {
            setError(error.message);
            console.log(error);
        } else {
            setProposals(proposals.filter((pr) => pr.id != p.id));
        }
        setIsDeleting(false);
    };

    useEffect(() => {
        if (user) fetchProposals();
    }, [user]);

    const getSelected = (value, genValue, manFlag, genFlag) => {
        if (genFlag) return genValue;
        if (manFlag) return value;
    };

    const trimText = (text, limit) => {
        return text && text.length > limit ? text.substring(0, limit) + " ..." : text;
    };

    const isSigned = (p) => {
        return p.loan_agreement_signatures?.find((s) => s.status == "signed") != null;
    };

    const isSignSubmitted = (pid) => {
        return signed.indexOf(pid) > -1;
    };

    const isVerificationSubmitted = (pid) => {
        console.log(
            "checking isVerificationSubmitted = " +
                pid +
                " in " +
                verified +
                " == " +
                (verified.indexOf(pid) > -1)
        );
        return verified.indexOf(pid) > -1;
    };

    const getStatus = (p) => {
        return p?.loan_proposals_status?.length > 0 && p.loan_proposals_status[0].status;
    };

    const isVerified = (p) => {
        return (
            p.user_identity_verifications?.find((x) => x.verification_status == "verified") != null
        );
    };
    const getVerificationReason = (p) => {
        return p?.user_identity_verifications?.length > 0 &&
            p.user_identity_verifications[0].verification_message
            ? p.user_identity_verifications[0].verification_message
            : "No Verifications Submitted Yet!";
    };

    const handleSignAgreement = async (p) => {
        try {
            setIsSigning(true);

            const signUrl = await generateSignatureRequest({ proposalId: p.id });
            const client = await getHelloSignClient();

            client.open(signUrl, { testMode: true, allowCancel: true });
            client.on("sign", (data) => {
                //signing completed
                setSigned((signed) => [...signed, p.id]);
            });
        } catch (error) {
            console.log(error.message);
        }
        setIsSigning(false);
    };

    const handleVerification = async (p) => {
        try {
            setIsVerifying(true);

            const err = await stripeVerification({ pid: p.id });

            if (err?.message) {
                setError(err.message);
            } else if (err?.type == "user_action" && err?.code == "consent_declined") {
                setError("User declined the consent");
            } else if (err?.type == "user_action" && err?.code == "session_cancelled") {
                // do nothing
            } else {
                // verification completed
                setVerified((verified) => [...verified, p.id]);
            }
        } catch (e) {
            setError(e.message);
        }
        setIsVerifying(false);
    };

    return (
        <>
            <TopGradient />
            <Navbar />

            <DialogComponent
                isModelOpen={deleteModal}
                modelCloseHandler={() => setDeleteModal(!deleteModal)}
                heading="Delete Confirmation"
            >
                <p className="mt-4">Are you sure you want to delete this proposal?</p>
                <button
                    className="btn-clear mt-4"
                    onClick={() => {
                        setDeleteModal(false);
                        handleDeleteProposal(selected);
                    }}
                >
                    Delete
                </button>
            </DialogComponent>

            <div className="container mx-auto p-6">
                <div className="mt-8 mb-4 flex items-center justify-between">
                    <h2 className="max-w-6xl text-5xl font-bold tracking-wider text-white">
                        <span className="bg-gradient-to-r from-indigo-500 to-green-600 bg-clip-text text-transparent">
                            Borrwer Dashboard
                        </span>
                    </h2>
                </div>

                <h3 className="mt-6 text-3xl font-bold text-gray-700 dark:text-gray-200">
                    Create a loan proposal
                </h3>
                <p className="mt-2 mb-8 text-left leading-8 text-gray-600 dark:text-gray-300">
                    A loan proposal is not a loan application. The idea is for you to provide us
                    with all the information you can about yourself, your business, and the reason
                    why you need the loan. We will prepare all this information in the form a loan
                    proposal and present it to the lenders community on this platform. It is then up
                    to the lenders to vote on this proposal and accept the proposal.
                </p>

                <div>
                    <a href="/borrower/proposals/create" className="btn-primary">
                        Create New Loan Proposal
                    </a>
                </div>

                {error && <p className="mt-4 text-red-500">{error}</p>}

                <div className="mt-4 hidden w-full overflow-x-auto rounded-lg shadow-md sm:flex">
                    <table className="w-full text-left text-sm text-gray-800">
                        <thead className="bg-slate-600 text-xs uppercase tracking-wider text-gray-200 dark:bg-gray-600">
                            <tr>
                                <th scope="col" className="py-3 px-6" colSpan={2}>
                                    Proposal
                                </th>
                                <th scope="col" className="py-3 px-6 text-center">
                                    Status
                                </th>
                                <th scope="col" className="py-3 px-6 text-center">
                                    Identity Verified
                                </th>
                                <th scope="col" className="py-3 px-6 text-center">
                                    Agreement Signed
                                </th>
                                <th scope="col" className="py-3 px-6 text-center">
                                    View
                                </th>
                                <th scope="col" className="py-3 px-6 text-center">
                                    Edit
                                </th>
                                <th scope="col" className="py-3 px-6 text-center">
                                    Delete
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {!isLoading && proposals.length == 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="py-4 px-6 font-semibold dark:text-gray-200"
                                    >
                                        No Propopsals Yet
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
                                                    className="h-28 w-44 rounded-full object-cover object-center"
                                                    src={p.banner_image}
                                                    alt=""
                                                />
                                                <div className="ml-5">
                                                    <div className="mb-2 text-xl font-bold dark:text-gray-300">
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
                                        </td>
                                        <td className="py-4 px-6 text-center dark:text-gray-200">
                                            {getStatus(p)}
                                        </td>
                                        <td className="py-4 px-6 text-center dark:text-gray-200">
                                            {isVerified(p) ? (
                                                <ShieldCheckIcon className="inline h-10 fill-current text-emerald-500 dark:text-gray-200" />
                                            ) : isVerificationSubmitted(p.id) ? (
                                                <span>Submitted</span>
                                            ) : (
                                                <button
                                                    className="btn-clear"
                                                    onClick={() => handleVerification(p)}
                                                    disabled={isVerifying}
                                                >
                                                    Verify
                                                </button>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-center dark:text-gray-200">
                                            {isSigned(p) ? (
                                                <DocumentCheckIcon className="inline h-10 fill-current text-emerald-500 dark:text-gray-200" />
                                            ) : isSignSubmitted(p.id) ? (
                                                <span>Submitted</span>
                                            ) : (
                                                <button
                                                    className="btn-clear"
                                                    onClick={() => handleSignAgreement(p)}
                                                    disabled={isSigning}
                                                >
                                                    Sign
                                                </button>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <Link
                                                href={`/borrower/proposals/${p.id}`}
                                                className="btn-clear"
                                            >
                                                View
                                            </Link>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <Link
                                                href={`/borrower/proposals/create?id=${p.id}`}
                                                className="btn-clear"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <a
                                                href="#"
                                                className="btn-clear"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    deleteProposal(p);
                                                }}
                                            >
                                                Delete
                                            </a>
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
                                className="relative w-full space-y-5 overflow-hidden rounded-xl bg-indigo-50 shadow-lg dark:bg-gray-700/50"
                            >
                                <div>
                                    <div className="flex px-4 pt-4">
                                        <img
                                            className="h-24 w-24 rounded-full object-cover object-center"
                                            src={p.banner_image}
                                            alt=""
                                        />
                                        <div className="ml-5">
                                            <div className="mb-2 text-xl font-bold dark:text-gray-300">
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
                                    <div className="flex justify-between">
                                        <span className="">Proposal Status:</span>
                                        <span className="font-semibold">{getStatus(p)}</span>
                                    </div>
                                    <div className="mt-4 flex flex-col space-y-2">
                                        {isVerified(p) ? (
                                            <div className="flex justify-between">
                                                <div className="flex w-full justify-center rounded-lg border border-gray-400 px-4 py-2 text-center">
                                                    <CheckCircleIcon className="mr-2 inline h-6 fill-current text-green-500" />
                                                    <span className="font-semibold">
                                                        Identity Verified
                                                    </span>
                                                </div>
                                            </div>
                                        ) : isVerificationSubmitted(p.id) ? (
                                            <div className="flex w-full justify-center rounded-lg border border-gray-400 px-4 py-2 text-center">
                                                Submitted
                                            </div>
                                        ) : (
                                            <button
                                                className="btn-primary flex items-center justify-center py-1 font-normal"
                                                onClick={() => handleVerification(p)}
                                                disabled={isVerifying}
                                            >
                                                <ShieldExclamationIcon className="mr-2 inline h-6 fill-current text-gray-100" />
                                                Verify Identity
                                            </button>
                                        )}
                                        {isSigned(p) ? (
                                            <div className="flex justify-between">
                                                <div className="flex w-full justify-center rounded-lg border border-gray-400 px-4 py-2 text-center">
                                                    <DocumentCheckIcon className="mr-2 inline h-6 fill-current text-green-500" />
                                                    <span className="font-semibold">
                                                        Agreement Signed
                                                    </span>
                                                </div>
                                            </div>
                                        ) : isSignSubmitted(p.id) ? (
                                            <div className="flex w-full justify-center rounded-lg border border-gray-400 px-4 py-2 text-center">
                                                Submitted
                                            </div>
                                        ) : (
                                            <button
                                                className="btn-primary flex items-center justify-center py-1 font-normal"
                                                onClick={() => handleSignAgreement(p)}
                                                disabled={isSigning}
                                            >
                                                <ShieldExclamationIcon className="mr-2 inline h-6 fill-current text-gray-100" />
                                                Sign Agreement
                                            </button>
                                        )}
                                        <Link
                                            href={`/borrower/proposals/${p.id}`}
                                            className="btn-clear py-1.5 text-center"
                                        >
                                            View Proposal
                                        </Link>
                                        <Link
                                            href={`/borrower/proposals/create?id=${p.id}`}
                                            className="btn-clear py-1.5 text-center"
                                        >
                                            Edit Proposal
                                        </Link>
                                        <button
                                            className="btn-clear py-1.5 text-center"
                                            onClick={() => deleteProposal(p)}
                                        >
                                            Delete Proposal
                                        </button>
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
