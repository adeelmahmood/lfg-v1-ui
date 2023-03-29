import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import TopGradient from "../../../components/ui/TopGradient";
import VerifyIdentity from "../../../components/borrower/VerifyIdentity";
import LoanInformation from "../../../components/borrower/LoanInformation";
import GetStarted from "../../../components/borrower/GetStarted";
import GatherImages from "../../../components/borrower/GatherImages";
import Tagline from "../../../components/borrower/Tagline";
import BusinessInformation from "../../../components/borrower/BusinessInformation";
import LoanReason from "../../../components/borrower/LoanReason";
import PreviewAndSubmit from "../../../components/borrower/PreviewAndSubmit";
import { CheckIcon } from "@heroicons/react/24/solid";
import Tags from "../../../components/borrower/Tags";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { SUPABASE_TABLE_LOAN_PROPOSALS } from "../../../utils/Constants";
import SignAgreement from "../../../components/borrower/SignAgreement";

export default function LoanProposal() {
    const supabase = useSupabaseClient();
    const user = useUser();

    const router = useRouter();

    const { id } = router.query;

    const [loanProposal, setLoanProposal] = useState({
        business_title: "",
        business_tagline: "",
        business_description: "",
        business_gen_description: "",
        tags: "",
        loan_reasoning: "",
        loan_gen_reasoning: "",
        tagline_manual_picked: false,
        tagline_gen_picked: false,
        description_manual_picked: false,
        description_gen_picked: false,
        reasoning_manual_picked: false,
        reasoning_gen_picked: false,
        banner_image: "",
        banner_image_metadata: {},
        amount: 0,
        identity_verification_requested: false,
        agreement_signed: false,
        payout_mode: "",
        payout_token: "",
        payout_address: "",
    });

    async function loadProposal() {
        // edit mode - attempt to load from database
        const { data, error } = await supabase
            .from(SUPABASE_TABLE_LOAN_PROPOSALS)
            .select(
                `*, 
            loan_proposals_status (*), 
            user_identity_verifications ( verification_status, verification_message),
            loan_agreement_signatures ( signature_request_id, status, signed_at)`
            )
            .eq("user_id", user.id)
            .eq("id", id)
            .single();

        if (error) {
            console.log(error.message);
        }

        if (data) {
            setLoanProposal({
                ...loanProposal,
                ...data,
            });
        }
    }

    const [stage, setStage] = useState("GetStarted");
    const [stages, setStages] = useState([
        {
            href: "GetStarted",
            title: "Get Started",
            completed: false,
            component: GetStarted,
        },
        {
            href: "Tagline",
            title: "Business Title",
            completed: false,
            component: Tagline,
        },
        {
            href: "BusinessInformation",
            title: "Business Information",
            completed: false,
            component: BusinessInformation,
        },
        {
            href: "Tags",
            title: "Tags",
            completed: false,
            component: Tags,
        },
        {
            href: "LoanReasoning",
            title: "Reason for Loan",
            completed: false,
            component: LoanReason,
        },
        {
            href: "LoanInformation",
            title: "Loan Information",
            completed: false,
            component: LoanInformation,
        },
        {
            href: "GatherImages",
            title: "Images",
            completed: false,
            component: GatherImages,
        },
        {
            href: "PreviewAndSubmit",
            title: "Preview And Submit",
            completed: false,
            component: PreviewAndSubmit,
        },
        {
            href: "VerifyIdentity",
            title: "Verify Your Identity",
            completed: false,
            component: VerifyIdentity,
        },
        {
            href: "SignAgreement",
            title: "Sign Agreement",
            completed: false,
            component: SignAgreement,
        },
    ]);

    const prevStage = () => {
        const current = stages.find((s) => s.href == stage);
        const previous = stages[stages.findIndex((s) => s.href == stage) - 1];
        setStage(previous.href);
    };

    const stageCompleted = () => {
        const current = stages.find((s) => s.href == stage);
        const next = stages[stages.findIndex((s) => s.href == stage) + 1];
        current.completed = true;
        setStage(next.href);
    };

    const handleNav = (e) => {
        e.preventDefault();
        let href = e.target.href;
        href = href.indexOf("/") != -1 ? href.substring(href.lastIndexOf("/") + 1) : href;
        const targetStage = stages.find((s) => s.href == href);
        if (targetStage?.completed) {
            setStage(targetStage.href);
        }
    };

    useEffect(() => {
        if (user && router.isReady && id) loadProposal();
    }, [user, router.isReady]);

    return (
        <>
            <TopGradient />
            <Navbar />

            <div className="container mx-auto p-6">
                <div className="flex">
                    <div className="hidden w-64 md:block">
                        <div className="mt-10 flex flex-col space-y-6 px-6">
                            {stages.map((s, index) => {
                                return (
                                    <div className="flex items-start" key={index}>
                                        <a
                                            key={index}
                                            href={s.href}
                                            className={`${
                                                stage == s.href
                                                    ? "font-semibold text-indigo-800 dark:text-gray-200"
                                                    : s.completed
                                                    ? "font-normal text-indigo-500 dark:text-gray-400"
                                                    : "font-normal text-indigo-800 dark:text-gray-300"
                                            }`}
                                            onClick={handleNav}
                                        >
                                            {s.title}
                                        </a>
                                        {s.completed && (
                                            <CheckIcon className="ml-1 inline h-5 fill-current text-indigo-500 dark:text-gray-200" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="w-full max-w-2xl rounded-xl bg-white shadow-md dark:bg-slate-800">
                        <div className="mt-8 flex flex-col">
                            {stages.map((s, index) => {
                                if (!s.component) {
                                    return <div>Component for {s.href} not defined</div>;
                                }
                                const Comp = s.component;
                                if (Comp && s.href == stage) {
                                    return (
                                        <Comp
                                            key={index}
                                            loanProposal={loanProposal}
                                            setLoanProposal={setLoanProposal}
                                            handle={stageCompleted}
                                        />
                                    );
                                }
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
