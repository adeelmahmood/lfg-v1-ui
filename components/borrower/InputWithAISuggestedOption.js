import { ArrowLongRightIcon, CheckBadgeIcon, CheckIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function InputWithAISuggestedOption({
    data,
    setData,
    handle,
    fieldName,
    genFieldName,
    manualPickFieldName,
    genPickFieldName,
    heading,
    inputType,
    label,
    placeHolder,
    generateAction = "tagline",
    ...rest
}) {
    const [isCompleted, setIsCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [value, setValue] = useState(data[fieldName]);
    const [genValue, setGenValue] = useState(data[genFieldName]);

    const [usingManual, setUsingManual] = useState(data[manualPickFieldName]);
    const [usingGen, setUsingGen] = useState(data[genPickFieldName]);

    const [error, setError] = useState();

    const router = useRouter();

    const handleGenerate = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch("/api/openai/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ action: generateAction, text: value }),
            });

            const data = await response.json();
            if (response.status !== 200) {
                throw data.error || new Error(`Request failed with status ${response.status}`);
            }

            setGenValue(data.result);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsCompleted((usingManual && value) || (usingGen && genValue));
    }, [value, genValue, usingManual, usingGen]);

    const handleNext = async () => {
        setData({
            ...data,
            [fieldName]: value,
            [genFieldName]: genValue,
            [manualPickFieldName]: usingManual,
            [genPickFieldName]: usingGen,
        });

        handle?.();
    };

    return (
        <>
            <div className="mb-8 w-full max-w-2xl px-8" {...rest}>
                <h2 className="max-w-6xl text-4xl font-bold text-white">
                    <span className="bg-gradient-to-r from-indigo-500 to-green-600 bg-clip-text text-transparent">
                        {heading}
                    </span>
                </h2>
                <div className="mt-6">
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                        {label}
                    </label>

                    {inputType == "textarea" ? (
                        <textarea
                            className="mb-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-gray-800 dark:focus:border-green-500 dark:focus:ring-green-500"
                            rows={8}
                            placeholder={placeHolder}
                            onChange={(e) => setValue(e.target.value)}
                            value={value}
                        />
                    ) : (
                        <input
                            className="mb-3 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-gray-800 dark:focus:border-green-500 dark:focus:ring-green-500"
                            type={inputType}
                            placeholder={placeHolder}
                            onChange={(e) => setValue(e.target.value)}
                            value={value}
                        />
                    )}
                    <button
                        className={`inline-flex rounded-lg border ${
                            usingManual
                                ? "border-teal-500 bg-teal-700 text-white"
                                : "border-gray-400 bg-white text-gray-800 hover:bg-gray-100 dark:bg-slate-800 dark:text-gray-200 dark:ring-slate-700 dark:hover:bg-slate-700 dark:hover:ring-slate-800"
                        } py-2 px-4 shadow disabled:cursor-not-allowed disabled:opacity-50`}
                        onClick={() => {
                            setUsingManual(true);
                            setUsingGen(false);
                        }}
                        disabled={!value}
                    >
                        Use this <span className="ml-1 first-letter:uppercase">{fieldName}</span>
                        {usingManual && (
                            <CheckIcon className="ml-2 inline h-6 fill-current text-white" />
                        )}
                    </button>
                </div>
                <div className="mt-10 flex items-center">
                    <div className="flex-grow border-t border-gray-400 dark:border-gray-200"></div>
                    <span className="mx-4 flex-shrink text-gray-400 dark:text-gray-200">OR</span>
                    <div className="flex-grow border-t border-gray-400 dark:border-gray-200"></div>
                </div>
                <div className="mt-10">
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Based on your description above, let us generate a {fieldName} for you
                    </label>
                    <button
                        className="inline-flex items-center rounded-lg border border-gray-400 bg-indigo-500 py-2 px-4 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800 dark:ring-slate-700 dark:hover:bg-slate-700 dark:hover:ring-slate-800 md:font-semibold"
                        onClick={handleGenerate}
                        disabled={!value || isLoading}
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
                {genValue && (
                    <div className="mt-8">
                        <p className="mb-2 rounded-lg border bg-gray-100 px-4 py-2 font-serif text-xl text-gray-800">
                            {genValue}
                        </p>
                        <button
                            className={`inline-flex rounded-lg border ${
                                usingGen
                                    ? "border-teal-400 bg-teal-700 text-white"
                                    : "border-gray-400 bg-white text-gray-800 hover:bg-gray-100 dark:bg-slate-800 dark:text-gray-200 dark:ring-slate-700 dark:hover:bg-slate-700 dark:hover:ring-slate-800"
                            } py-2 px-4 shadow disabled:cursor-not-allowed  disabled:opacity-50`}
                            onClick={() => {
                                setUsingManual(false);
                                setUsingGen(true);
                            }}
                        >
                            Use this
                            <span className="ml-1 first-letter:uppercase">{fieldName}</span>
                            {usingGen && (
                                <CheckIcon className="ml-2 inline h-6 fill-current text-white" />
                            )}
                        </button>
                    </div>
                )}
                <div className="mt-10">
                    <button
                        className="w-full rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm 
                        ring-1 ring-indigo-600 transition duration-150 ease-in-out hover:bg-indigo-700
                        hover:ring-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-500 dark:ring-0 dark:hover:bg-green-600 dark:focus:bg-green-600 dark:focus:outline-none dark:focus:ring-0"
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
