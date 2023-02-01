import { useEffect, useState } from "react";
import InputWithAISuggestedOption from "./InputWithAISuggestedOption";

export default function GetStarted({ loanProposal, setLoanProposal, handle, ...rest }) {
    const [isCompleted, setIsCompleted] = useState(true);

    const [data, setData] = useState({
        title: "",
        genTitle: "",
        manual_title_picked: false,
        gen_title_picked: false,
    });

    return (
        <>
            <div className="mb-8 w-full px-8" {...rest}>
                <h2 className="max-w-6xl text-4xl font-bold text-white">
                    <span className="bg-gradient-to-r from-indigo-500 to-green-600 bg-clip-text text-transparent">
                        Create A Loan Proposal
                    </span>
                </h2>

                <h3 className="mt-6 text-3xl font-bold text-gray-500 dark:text-gray-200">
                    What information do we need?
                </h3>
                <p className="mt-2 mb-8 max-w-2xl text-left leading-8 text-gray-600 dark:text-gray-400">
                    We will guide you through the process by asking questions and you can answer
                    those questions as informally as you'd like. Based on your answers, we will help
                    generate content for the final proposal. You will have the chance to review the
                    generated content and chose to either use the generated content, modify it, or
                    override with your personalized content.
                </p>

                <div className="mt-4">
                    <button
                        className="btn-secondary w-full"
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
