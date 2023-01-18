import { ArrowLongRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

export default function TellUsAboutYourself({ loanProposal, setLoanProposal, handle, ...rest }) {
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        setIsCompleted(loanProposal.amount);
    }, [loanProposal.amount]);

    return (
        <>
            <div className="mb-8 w-full max-w-2xl px-8 pt-6" {...rest}>
                <h2 className="text-3xl font-bold text-gray-700">Loan Information</h2>
                <div className="mt-6">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Amount needed for the loan (in USD)
                    </label>
                    <input
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        id="amount"
                        type="number"
                        placeholder="Amount in USD"
                        onChange={(e) => {
                            setLoanProposal({
                                ...loanProposal,
                                amount: e.target.value,
                            });
                        }}
                        value={loanProposal.amount}
                        required
                    />
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
