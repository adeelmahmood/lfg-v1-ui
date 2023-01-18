import { useEffect, useState } from "react";

export default function GetStarted({ loanProposal, setLoanProposal, handle, ...rest }) {
    const [isCompleted, setIsCompleted] = useState(true);

    return (
        <>
            <div className="mb-8 w-full px-8" {...rest}>
                <h2 className="text-4xl font-bold text-gray-700">Create A Loan Proposal</h2>

                <h3 className="mt-6 text-3xl font-bold text-gray-500">What is a loan proposal?</h3>
                <p className="mt-2 mb-8 max-w-2xl text-left leading-8 text-gray-600">
                    A loan proposal is not a loan application. The idea is for you to provide us
                    with all the information you can about yourself, your business, and the reason
                    why you need the loan. We will do some verification on our end to develop some
                    confidence towards your ability to pay back the loan. We will prepare all this
                    information in the form a loan proposal and present it to the lenders community
                    on this platform. It is then up to the lenders to vote on this proposal and
                    accept the proposal.
                </p>

                <h3 className="mt-6 text-3xl font-bold text-gray-500">
                    What information do we need?
                </h3>
                <p className="mt-2 mb-8 max-w-2xl text-left leading-8 text-gray-600">
                    We will guide you through the process by asking questions and you can answer
                    those questions as informally as you'd like. Based on your answers, we will help
                    generate content for the final proposal. You will have the chance to review the
                    generated content and chose to either use the generated content, modify it, or
                    override with your personalized content.
                </p>

                <h3 className="mt-6 text-3xl font-bold text-gray-500">
                    Will I get the money right away?
                </h3>
                <p className="mt-2 mb-8 max-w-2xl text-left leading-8 text-gray-600">
                    No. All we are doing here is creating a proposal and then its up to community
                    and other factors that will detemrine when the proposal is completed and the
                    money is disbursed.
                </p>

                <div className="mt-4">
                    <p className="mt-2 mb-6 max-w-2xl text-left leading-8 text-gray-600">
                        Think of it as writing a blog for your business and the current needs
                    </p>
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
