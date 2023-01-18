import { ArrowLongRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

export default function TellUsAboutYourself({ loanProposal, setLoanProposal, handle, ...rest }) {
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        setIsCompleted(loanProposal.title && loanProposal.reasoning && loanProposal.business);
    }, [loanProposal.title, loanProposal.reasoning, loanProposal.business]);

    return (
        <>
            <div className="mb-8 w-full max-w-2xl px-8 pt-6" {...rest}>
                <h2 className="text-3xl font-bold text-gray-700">Tell us about yourself</h2>
                <div className="mt-6">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        A title for your loan proposal
                    </label>
                    <input
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        id="title"
                        type="text"
                        placeholder="Title for loan proposal"
                        onChange={(e) => {
                            setLoanProposal({
                                ...loanProposal,
                                title: e.target.value,
                            });
                        }}
                        value={loanProposal.title}
                        required
                    />
                </div>
                <div className="mt-4 flex flex-col">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Tell us about your business or the work that you do
                    </label>
                    <textarea
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        rows={10}
                        placeholder="Your business or work"
                        onChange={(e) => {
                            setLoanProposal({
                                ...loanProposal,
                                business: e.target.value,
                            });
                        }}
                        value={loanProposal.business}
                    ></textarea>
                </div>
                <div className="mt-4 flex flex-col">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Detailed reasoning for the loan proposal
                    </label>
                    <textarea
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        rows={10}
                        placeholder="Reasoning for the loan"
                        onChange={(e) => {
                            setLoanProposal({
                                ...loanProposal,
                                reasoning: e.target.value,
                            });
                        }}
                        value={loanProposal.reasoning}
                    ></textarea>
                </div>
                <div className="mt-4">
                    <button
                        className="w-full rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={handle}
                        disabled={!isCompleted}
                    >
                        Next <ArrowLongRightIcon className="inline h-6 fill-current text-white" />
                    </button>
                </div>
            </div>
        </>
    );
}
