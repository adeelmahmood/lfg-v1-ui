import { ArrowLongRightIcon, CheckBadgeIcon, CheckIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

export default function Tagline({ loanProposal, setLoanProposal, handle, ...rest }) {
    const [isCompleted, setIsCompleted] = useState(false);
    const [generatedTagLine, setGeneratedTagLine] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [usingManualTagline, setUsingManualTagline] = useState(false);
    const [usingGenTagline, setUsingGenTagline] = useState(false);

    const handleGenerateTagline = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/openai/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ description: loanProposal.description }),
            });

            const data = await response.json();
            if (response.status !== 200) {
                throw data.error || new Error(`Request failed with status ${response.status}`);
            }

            setGeneratedTagLine(data.result);
        } catch (error) {
            // Consider implementing your own error handling logic here
            console.error(error);
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsCompleted(loanProposal.description && loanProposal.tagline);
    }, [loanProposal.description, loanProposal.tagline]);

    return (
        <>
            <div className="mb-8 w-full max-w-2xl px-8" {...rest}>
                <h2 className="text-3xl font-bold text-gray-700">Lets come up with a tagline</h2>
                <div className="mt-6">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Provide a short description of your business or organization
                    </label>
                    <div className="flex items-center">
                        <input
                            className="mb-3 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            id="description"
                            type="text"
                            placeholder="Description of your business"
                            onChange={(e) => {
                                setLoanProposal({
                                    ...loanProposal,
                                    description: e.target.value,
                                });
                            }}
                            value={loanProposal.description}
                            required
                        />
                        {usingManualTagline ? (
                            <CheckIcon className="ml-2 inline h-8 fill-current text-teal-600" />
                        ) : (
                            <span className="w-10"></span>
                        )}
                    </div>
                    <button
                        className="rounded-lg bg-teal-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-teal-600 hover:bg-teal-700 hover:ring-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => setUsingManualTagline(true)}
                    >
                        Use this Tagline
                    </button>
                </div>
                <div class="mt-10 flex items-center">
                    <div class="flex-grow border-t border-gray-400"></div>
                    <span class="mx-4 flex-shrink text-gray-400">OR</span>
                    <div class="flex-grow border-t border-gray-400"></div>
                </div>
                <div className="mt-10">
                    <label className="mb-3 block text-sm font-medium text-gray-700">
                        Based on your description above, let us generate a tagline for you
                    </label>
                    <button
                        className="rounded-lg border border-gray-400 bg-white py-2 px-4 text-gray-800 shadow hover:bg-gray-100 disabled:cursor-not-allowed  disabled:opacity-50 md:font-semibold"
                        onClick={handleGenerateTagline}
                        disabled={!loanProposal.description || isLoading}
                    >
                        Generate
                    </button>
                </div>
                {generatedTagLine && (
                    <div className="mt-8">
                        <p className="mb-2 text-2xl font-medium text-gray-700">
                            {generatedTagLine}
                        </p>
                        <button className="rounded-lg bg-teal-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-teal-600 hover:bg-teal-700 hover:ring-teal-700 disabled:cursor-not-allowed disabled:opacity-50">
                            Use this Tagline
                        </button>
                    </div>
                )}
                <div className="mt-10">
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
