import { useState } from "react";
import Navbar from "../../components/Navbar";
import TopGradient from "../../components/TopGradient";
import TellUsAboutYourself from "../../components/borrower/TellUsAboutYourself";
import VerifyIdentity from "../../components/borrower/VerifyIdentity";
import LoanInformation from "../../components/borrower/LoanInformation";
import ReviewAndSubmit from "../../components/borrower/ReviewAndSubmit";

export default function NewLoan() {
    const [loanProposal, setLoanProposal] = useState({
        title: "",
        reasoning: "",
        identityVerified: false,
    });

    const [stage, setStage] = useState("ProvideYourInfo");

    const [stages, setStages] = useState([
        {
            href: "ProvideYourInfo",
            title: "Provide Your Information",
            completed: false,
        },
        {
            href: "VerifyIdentity",
            title: "Verify Your Identity",
            completed: false,
        },
        {
            href: "LoanInformation",
            title: "Loan Information",
            completed: false,
        },
        {
            href: "ReviewAndSubmit",
            title: "Review And Submit",
            completed: false,
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
        if (targetStage?.completed) {
            setStage(targetStage.href);
        }
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
                            <h2 className="px-8 text-4xl font-bold text-gray-700">
                                Submit A Loan Proposal
                            </h2>
                            <p className="mt-6 mb-8 max-w-2xl px-8 text-left leading-8 text-gray-600">
                                Submitting a loan proposal is different from requesting a loan. As
                                our process allows borrowers to provide all the necessary
                                information and then lenders to vote on the proposal. Once the
                                proposal has sufficient votes, the loan proposal is approved and the
                                funds are disbursed.
                            </p>

                            {stage == "ProvideYourInfo" && (
                                <TellUsAboutYourself
                                    loanProposal={loanProposal}
                                    setLoanProposal={setLoanProposal}
                                    handle={stageCompleted}
                                />
                            )}

                            {stage == "VerifyIdentity" && (
                                <VerifyIdentity
                                    loanProposal={loanProposal}
                                    setLoanProposal={setLoanProposal}
                                    handle={stageCompleted}
                                />
                            )}

                            {stage == "LoanInformation" && (
                                <LoanInformation
                                    loanProposal={loanProposal}
                                    setLoanProposal={setLoanProposal}
                                    handle={stageCompleted}
                                />
                            )}

                            {stage == "ReviewAndSubmit" && (
                                <ReviewAndSubmit
                                    loanProposal={loanProposal}
                                    setLoanProposal={setLoanProposal}
                                    handle={stageCompleted}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
