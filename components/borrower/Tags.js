import { ArrowLongRightIcon, CheckIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

export default function Tags({ loanProposal, setLoanProposal, handle, ...rest }) {
    const [isCompleted, setIsCompleted] = useState(true);

    const [isLoading, setIsLoading] = useState(false);
    const [selectedTags, setSelectedTags] = useState(
        loanProposal.tags ? loanProposal.tags.split(",") : []
    );
    const [tags, setTags] = useState();

    const generateTags = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/openai/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "tags",
                    text: loanProposal.description_gen_picked
                        ? loanProposal.business_gen_description
                        : loanProposal.business_description,
                }),
            });

            const data = await response.json();
            if (response.status !== 200) {
                throw data.error || new Error(`Request failed with status ${response.status}`);
            }

            const generatedTags = data?.result?.split(",").map((t) => t.trim());
            setTags(generatedTags);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsCompleted(selectedTags.length > 0);
    }, [selectedTags]);

    useEffect(() => {
        if (loanProposal) generateTags();
    }, [loanProposal]);

    const toggleTag = (tag) => {
        setSelectedTags(
            selectedTags.includes(tag)
                ? selectedTags.filter((t) => t !== tag)
                : [...selectedTags, tag]
        );
    };

    const isSelected = (tag) => {
        return selectedTags.includes(tag);
    };

    const handleNext = async () => {
        setLoanProposal({
            ...loanProposal,
            tags: selectedTags.join(","),
        });
        handle?.();
    };

    return (
        <>
            <div className="mb-8 w-full max-w-2xl px-8" {...rest}>
                <h2 className="max-w-6xl text-4xl font-bold text-white">
                    <span className="bg-gradient-to-r from-indigo-500 to-green-600 bg-clip-text text-transparent">
                        Tags
                    </span>
                </h2>
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Choose some tags for your business
                    </label>
                    {isLoading && (
                        <div className="mt-4 flex items-center">
                            <span className="inline-block text-sm text-gray-500 dark:text-gray-400">
                                Generating Tags
                            </span>
                            <svg
                                className="ml-3 h-5 w-5 animate-spin text-gray-500 dark:text-gray-400"
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
                        </div>
                    )}
                    {!isLoading && (
                        <div className="mt-4">
                            {tags?.map((tag, i) => {
                                return (
                                    <button
                                        onClick={() => toggleTag(tag)}
                                        className="outline-none"
                                        key={i}
                                    >
                                        <span
                                            key={i}
                                            className={`mr-2 mb-2 inline-block rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-900 ${
                                                isSelected(tag) ? "bg-green-300" : "bg-gray-200"
                                            }`}
                                        >
                                            {tag}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
                <div className="mt-6">
                    <button
                        className="btn-secondary w-full"
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
