import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import TopGradient from "../../components/TopGradient";
import ProvideYourInfo from "../../components/borrower/ProvideYourInfo";
import VerifyIdentity from "../../components/borrower/VerifyIdentity";
import LoanInformation from "../../components/borrower/LoanInformation";
import ReviewAndSubmit from "../../components/borrower/ReviewAndSubmit";
import GetStarted from "../../components/borrower/GetStarted";
import GatherImages from "../../components/borrower/GatherImages";
import Tagline from "../../components/borrower/Tagline";
import BusinessInformation from "../../components/borrower/BusinessInformation";

export default function LoanProposal() {
    const [loanProposal, setLoanProposal] = useState({
        business_title: "",
        business_tagline: "",
        tagline_manual_picked: false,
        tagline_gen_picked: false,
    });

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
            href: "ProvideYourInfo",
            title: "Provide Your Information",
            completed: false,
            component: ProvideYourInfo,
        },
        {
            href: "LoanInformation",
            title: "Loan Information",
            completed: false,
            component: LoanInformation,
        },
        {
            href: "GatherImages",
            title: "Business Images",
            completed: false,
            component: GatherImages,
        },
        {
            href: "VerifyIdentity",
            title: "Verify Your Identity",
            completed: false,
            component: VerifyIdentity,
        },
        {
            href: "ReviewAndSubmit",
            title: "Review And Submit",
            completed: false,
            component: ReviewAndSubmit,
        },
    ]);

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
        // if (targetStage?.completed) {
        setStage(targetStage.href);
        // }
    };

    return (
        <>
            <TopGradient />
            <Navbar />

            <div className="container mx-auto p-6">
                <div className="flex">
                    <div className="hidden w-64 md:block">
                        <div className="mt-10 flex flex-col space-y-6 px-6">
                            {stages.map((s) => {
                                return (
                                    <a
                                        href={s.href}
                                        className={`${
                                            stage == s.href
                                                ? "font-semibold text-indigo-700"
                                                : s.completed
                                                ? "font-normal text-teal-500"
                                                : "font-normal text-gray-500"
                                        }`}
                                        onClick={handleNav}
                                    >
                                        {s.title}
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    <div className="w-full max-w-2xl rounded-xl bg-white shadow-md">
                        <div className="mt-8 flex flex-col">
                            {stages.map((s) => {
                                if (!s.component) {
                                    return <div>Component for {s.href} not defined</div>;
                                }
                                const Comp = s.component;
                                if (Comp && s.href == stage) {
                                    return (
                                        <Comp
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
