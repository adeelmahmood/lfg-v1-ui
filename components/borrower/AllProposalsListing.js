import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { SUPABASE_TABLE_LOAN_PROPOSALS } from "../../utils/Constants";
import Link from "next/link";
import DialogComponent from "../ui/DialogComponent";
import { CheckCircleIcon, DocumentCheckIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";
import { stripeVerification } from "../../utils/Stripe";
import { generateSignatureRequest, getHelloSignClient } from "../../utils/HelloSign";
import {
    isVerified,
    isSigned,
    isSignSubmitted,
    isVerificationSubmitted,
    isPublished,
} from "../../utils/ProposalChecks";
import { useRouter } from "next/router";

export default function AllProposalsListing({}) {
    const supabase = useSupabaseClient();
    const user = useUser();

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [signing, setSigning] = useState();
    const [justSigned, setJustSigned] = useState([]);
    const [verifying, setVerifying] = useState();
    const [justVerified, setJustVerified] = useState([]);
    const [error, setError] = useState();
    const [deleteError, setDeleteError] = useState();

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
            // setExecutedProposals(data.filter((p) => isExecuted(p)));
        }
    };

    const deleteProposal = (p) => {
        setSelected(p);
        setDeleteModal(true);
    };

    const handleDeleteProposal = async (p) => {
        setIsDeleting(true);
        setDeleteError();

        const response = await fetch("/api/proposals/deleteProposal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: p.id }),
        });

        const data = await response.json();
        setIsDeleting(false);

        if (response.status !== 200) {
            setDeleteError(data.error);
            return false;
        }

        setProposals(proposals.filter((pr) => pr.id != data.id));
        return true;
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

    const getStatus = (p) => {
        return p?.loan_proposals_status?.at(-1)?.status;
    };

    const handleSignAgreement = async (p) => {
        try {
            setSigning(p.id);

            const signUrl = await generateSignatureRequest({ proposalId: p.id });
            const client = await getHelloSignClient();

            client.open(signUrl, { testMode: true, allowCancel: true });
            client.on("sign", async (data) => {
                //signing completed
                setJustSigned((justSigned) => [...justSigned, p.id]);
                const { error } = await supabase
                    .from(SUPABASE_TABLE_LOAN_PROPOSALS)
                    .update({
                        agreement_signed: true,
                    })
                    .eq("id", p.id);

                if (error) {
                    setError(error.message);
                }
            });
        } catch (error) {
            console.log(error.message);
        }
        setSigning();
    };

    const handleVerification = async (p) => {
        try {
            setVerifying(p.id);

            const err = await stripeVerification({ pid: p.id });

            if (err?.message) {
                setError(err.message);
            } else if (err?.type == "user_action" && err?.code == "consent_declined") {
                setError("User declined the consent");
            } else if (err?.type == "user_action" && err?.code == "session_cancelled") {
                // do nothing
            } else {
                // verification completed
                setJustVerified((justVerified) => [...justVerified, p.id]);
                const { error } = await supabase
                    .from(SUPABASE_TABLE_LOAN_PROPOSALS)
                    .update({
                        identity_verification_requested: true,
                    })
                    .eq("id", p.id);

                if (error) {
                    setError(error.message);
                }
            }
        } catch (e) {
            setError(e.message);
        }
        setVerifying();
    };

    const checkVerificationSubmitted = (p) => {
        return isVerificationSubmitted(p) || justVerified.includes(p.id);
    };

    const checkSignSubmitted = (p) => {
        return isSignSubmitted(p) || justSigned.includes(p.id);
    };

    return (
        <>
            <DialogComponent
                isModelOpen={deleteModal}
                modelCloseHandler={() => {
                    setDeleteModal(!deleteModal);
                    setDeleteError();
                }}
                heading="Delete Confirmation"
            >
                {deleteError && <p className="mt-4 text-red-500">{deleteError}</p>}
                <p className="mt-4">Are you sure you want to delete this proposal?</p>
                <button
                    className="btn-clear mt-4"
                    disabled={isDeleting}
                    onClick={async () => {
                        const deleted = await handleDeleteProposal(selected);
                        if (deleted) {
                            setDeleteModal(false);
                        }
                    }}
                >
                    Delete
                </button>
            </DialogComponent>

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
                                                className="h-28 w-44 flex-shrink-0 rounded-lg object-cover object-center"
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
                                            <ShieldCheckIcon className="inline h-10 fill-current text-emerald-500 dark:text-emerald-200" />
                                        ) : checkVerificationSubmitted(p) ? (
                                            <span>Submitted</span>
                                        ) : (
                                            <button
                                                className="btn-clear font-semibold"
                                                onClick={() => handleVerification(p)}
                                                disabled={verifying == p.id}
                                            >
                                                Verify
                                            </button>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-center dark:text-gray-200">
                                        {isSigned(p) ? (
                                            <DocumentCheckIcon className="inline h-10 fill-current text-emerald-500 dark:text-emerald-200" />
                                        ) : checkSignSubmitted(p) ? (
                                            <span>Submitted</span>
                                        ) : (
                                            <button
                                                className="btn-clear font-semibold"
                                                onClick={() => handleSignAgreement(p)}
                                                disabled={signing === p.id}
                                            >
                                                Sign
                                            </button>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <Link
                                            href={`/borrower/proposals/${p.id}`}
                                            className="btn-primary text-sm "
                                        >
                                            View
                                        </Link>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <button
                                            onClick={() =>
                                                router.push(`/borrower/proposals/create?id=${p.id}`)
                                            }
                                            className="btn-primary text-sm"
                                            disabled={isPublished(p)}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <button
                                            href="#"
                                            className="btn-primary text-sm"
                                            disabled={isPublished(p)}
                                            onClick={() => {
                                                deleteProposal(p);
                                            }}
                                        >
                                            Delete
                                        </button>
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
                                    <span className="font-semibold dark:text-gray-200">
                                        {getStatus(p)}
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <div className="grid grid-cols-2 place-items-center">
                                        {isVerified(p) ? (
                                            <div className="flex items-center justify-center rounded-lg border border-gray-400 px-4 py-2 text-sm">
                                                <CheckCircleIcon className="mr-2 inline h-5 fill-current text-green-500" />
                                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                    Verified
                                                </span>
                                            </div>
                                        ) : checkVerificationSubmitted(p) ? (
                                            <div className="flex w-full justify-center rounded-lg border border-gray-400 px-4 py-1.5 text-sm text-gray-800 dark:text-gray-200">
                                                Submitted
                                            </div>
                                        ) : (
                                            <button
                                                className="btn-primary flex items-center justify-center rounded-full py-1.5 text-sm font-semibold"
                                                onClick={() => handleVerification(p)}
                                                disabled={verifying == p.id}
                                            >
                                                Verify Identity
                                            </button>
                                        )}
                                        {isSigned(p) ? (
                                            <div className="flex items-center justify-center rounded-lg border border-gray-400 px-4 py-2 text-sm">
                                                <DocumentCheckIcon className="mr-2 inline h-5 fill-current text-green-500" />
                                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                    Signed
                                                </span>
                                            </div>
                                        ) : checkSignSubmitted(p) ? (
                                            <div className="flex w-full justify-center rounded-lg border border-gray-400 px-4 py-1.5 text-sm text-gray-800 dark:text-gray-200">
                                                Submitted
                                            </div>
                                        ) : (
                                            <button
                                                className="btn-primary flex items-center justify-center rounded-full py-1.5 text-sm font-semibold"
                                                onClick={() => handleSignAgreement(p)}
                                                disabled={signing == p.id}
                                            >
                                                Sign Agreement
                                            </button>
                                        )}
                                    </div>
                                    <div className="mt-4 flex items-center justify-center space-x-4">
                                        <Link
                                            href={`/borrower/proposals/${p.id}`}
                                            className="btn-primary flex items-center justify-center rounded-full py-1.5 text-sm font-semibold"
                                        >
                                            View
                                        </Link>
                                        <button
                                            onClick={() =>
                                                router.push(`/borrower/proposals/create?id=${p.id}`)
                                            }
                                            disabled={isPublished(p)}
                                            className="btn-primary flex items-center justify-center rounded-full py-1.5 text-sm font-semibold"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn-primary flex items-center justify-center rounded-full py-1.5 text-sm font-semibold"
                                            onClick={() => deleteProposal(p)}
                                            disabled={isPublished(p)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <div className="mt-2 flex items-center justify-center"></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
