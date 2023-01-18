import { useEffect, useState } from "react";

export default function GetStarted({ loanProposal, setLoanProposal, handle, ...rest }) {
    const [isCompleted, setIsCompleted] = useState(true);

    return (
        <>
            <div className="mb-8 w-full max-w-2xl px-8" {...rest}>
                <h2 className="text-4xl font-bold text-gray-700">Create A Loan Proposal</h2>
                <p className="mt-6 mb-8 max-w-2xl text-left leading-8 text-gray-600">
                    Creating a loan proposal is different from requesting a loan. As our process
                    allows borrowers to provide all the necessary information and then lenders to
                    vote on the proposal. Once the proposal has sufficient votes, the loan proposal
                    is approved and the funds are disbursed.
                </p>

                <div className="mt-4">
                    <button
                        className="w-full rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={handle}
                        disabled={!isCompleted}
                    >
                        Lets Get Started
                    </button>
                </div>
            </div>
        </>
    );
}
