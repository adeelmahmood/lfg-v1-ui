import {
    ClipboardIcon,
    ArrowLongRightIcon,
    CheckBadgeIcon,
    CheckIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

export default function BusinessInformation({ loanProposal, setLoanProposal, handle, ...rest }) {
    const [isCompleted, setIsCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [description, setDescription] = useState(loanProposal.business_description);
    const [genDescription, setGenDescription] = useState(loanProposal.business_gen_description);

    const [usingManual, setUsingManual] = useState(loanProposal.description_manual_picked);
    const [usingGen, setUsingGen] = useState(loanProposal.description_gen_picked);

    const [error, setError] = useState();

    const handleGenerateTagline = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch("/api/openai/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ description: description, action: "summarize" }),
            });

            const data = await response.json();
            if (response.status !== 200) {
                throw data.error || new Error(`Request failed with status ${response.status}`);
            }

            setGenDescription(data.result);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsCompleted((usingManual && description) || (usingGen && genDescription));
    }, [description, genDescription, usingManual, usingGen]);

    const handleNext = () => {
        setLoanProposal({
            ...loanProposal,
            business_description: description,
            business_gen_description: genDescription,
            description_manual_picked: usingManual,
            description_gen_picked: usingGen,
        });

        handle?.();
    };

    return (
        <>
            <div className="mb-8 w-full max-w-2xl px-8" {...rest}>
                <h2 className="text-3xl font-bold text-gray-700">Tell us about your business</h2>
                <div className="mt-6">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Provide a description of your business
                    </label>
                    <textarea
                        className="mb-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        rows={8}
                        placeholder="Description of your business"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        required
                    />
                    <button
                        className={`inline-flex rounded-lg border ${
                            usingManual
                                ? "border-teal-500 bg-teal-700 text-white"
                                : "border-gray-400 bg-white text-gray-800 hover:bg-gray-100"
                        } py-2 px-4 shadow disabled:cursor-not-allowed  disabled:opacity-50`}
                        onClick={() => {
                            setUsingManual(true);
                            setUsingGen(false);
                        }}
                        disabled={!description}
                    >
                        Use this Description
                        {usingManual && (
                            <CheckIcon className="ml-2 inline h-6 fill-current text-white" />
                        )}
                    </button>
                </div>
                <div class="mt-8 flex items-center">
                    <div class="flex-grow border-t border-gray-400"></div>
                    <span class="mx-4 flex-shrink text-gray-400">OR</span>
                    <div class="flex-grow border-t border-gray-400"></div>
                </div>
                <div className="mt-8">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Based on your description above, let us generate a description for you
                    </label>
                    <button
                        className="inline-flex rounded-lg border border-gray-400 bg-white py-2 px-4 text-gray-800 shadow hover:bg-gray-100 disabled:cursor-not-allowed  disabled:opacity-50"
                        onClick={handleGenerateTagline}
                        disabled={!description || isLoading}
                    >
                        Generate
                        {isLoading && (
                            <svg
                                className="text-indigo ml-3 h-5 w-5 animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        )}
                    </button>
                </div>
                {error && <p className="mt-2 text-red-400">{error}</p>}
                {genDescription && (
                    <div className="mt-8">
                        <p className="mb-2 font-serif text-xl font-medium text-gray-700">
                            {genDescription}
                        </p>

                        <button
                            className={`inline-flex rounded-lg border ${
                                usingGen
                                    ? "border-teal-400 bg-teal-700 text-white"
                                    : "border-gray-400 bg-white text-gray-800 hover:bg-gray-100"
                            } py-2 px-4 shadow disabled:cursor-not-allowed  disabled:opacity-50`}
                            onClick={() => {
                                setUsingManual(false);
                                setUsingGen(true);
                            }}
                        >
                            Use this Description
                            {usingGen && (
                                <CheckIcon className="ml-2 inline h-6 fill-current text-white" />
                            )}
                        </button>
                    </div>
                )}
                <div className="mt-10">
                    <button
                        className="w-full rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={handleNext}
                        disabled={!isCompleted}
                    >
                        Next <ArrowLongRightIcon className="inline h-6 fill-current text-white" />
                    </button>
                </div>
            </div>
        </>
    );
}
