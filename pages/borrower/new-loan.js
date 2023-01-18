import { useState } from "react";
import Navbar from "../../components/Navbar";
import TopGradient from "../../components/TopGradient";
import TellUsAboutYourself from "../../components/borrower/TellUsAboutYourself";
import VerifyIdentity from "../../components/borrower/VerifyIdentity";
import Review from "../../components/borrower/Review";

export default function NewLoan() {
    const [loanProposal, setLoanProposal] = useState({
        title: "",
        reasoning: "",
    });

    const [status, setStatus] = useState("Create");

    return (
        <>
            <TopGradient />
            <Navbar />

            <div className="container mx-auto p-6">
                <div className="mt-8 flex flex-col items-center justify-center">
                    <h2 className="text-4xl font-bold">Submit A Loan Proposal</h2>
                    <p className="mt-6 mb-10 max-w-2xl text-center text-lg leading-8 text-gray-600">
                        Submitting a loan proposal is different from requesting a loan. As our
                        process allows borrowers to provide all the necessary information and then
                        lenders to vote on the proposal. Once the proposal has sufficient votes, the
                        loan proposal is approved and the funds are disbursed.
                    </p>

                    {status == "Create" && (
                        <TellUsAboutYourself
                            loanProposal={loanProposal}
                            setLoanProposal={setLoanProposal}
                            handleNext={() => setStatus("VerifyIdentity")}
                        />
                    )}

                    {status == "VerifyIdentity" && (
                        <VerifyIdentity
                            loanProposal={loanProposal}
                            setLoanProposal={setLoanProposal}
                            handlePrev={() => setStatus("Create")}
                            handleNext={() => setStatus("Review")}
                        />
                    )}

                    {status == "Review" && (
                        <Review
                            loanProposal={loanProposal}
                            setLoanProposal={setLoanProposal}
                            handlePrev={() => setStatus("VerifyIdentity")}
                            handleNext={() => setStatus("Submitted")}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
