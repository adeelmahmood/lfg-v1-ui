import {
    useAccount,
    useContractRead,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import addresses from "../../../constants/contract.json";
import governorAbi from "../../../constants/LoanGovernor.json";
import govTokenAbi from "../../../constants/GovToken.json";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import useIsMounted from "../../../hooks/useIsMounted";
import { CheckIcon, ChevronUpDownIcon, EnvelopeOpenIcon } from "@heroicons/react/24/solid";
import DialogComponent from "../../DialogComponent";

export default function CastVoteDialog({ isModelOpen = false, modelCloseHandler, loanProposal }) {
    let [castVoteModalOpen, setCastVoteModalOpen] = useState(isModelOpen);

    const isMounted = useIsMounted();
    const [isLoading, setIsLoading] = useState(false);
    const [isDelegated, setIsDelegated] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);

    const { address, isConnected } = useAccount();
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
    const governorAddress = addresses[chainId].LoanGovernor;
    const govToken = addresses[chainId].GovToken;

    const options = [
        {
            name: "Voting For",
            id: 1,
            descr: "Vote in favor of this proposal being approved",
        },
        {
            name: "Voting Against",
            id: 2,
            descr: "Vote against this proposal being approved",
        },
        {
            name: "Abstain",
            id: 0,
            descr: "Essentially no vote",
        },
    ];
    const [description, setDescription] = useState("");
    const [vote, setVote] = useState(1);

    useContractRead({
        address: governorAddress,
        abi: governorAbi,
        functionName: "hasVoted",
        args: [loanProposal.onchain_proposal_id, address],
        onSuccess(data) {
            setHasVoted(data);
        },
        onError(err) {
            console.log("governor proposalVotes contract read error", err.message);
        },
        enabled: isConnected,
    });

    const {
        config: delegateConfig,
        error: delegatePrepareError,
        isError: isDelegatePrepareError,
    } = usePrepareContractWrite({
        address: govToken,
        abi: govTokenAbi,
        functionName: "delegate",
        args: [address],
        enabled: isConnected && !hasVoted,
        onError(err) {
            console.log("delegate prepare error", err);
        },
    });

    const {
        write: handleDelegate,
        data: delegateData,
        error: delegateError,
        isLoading: isDelegateLoading,
        isError: isDelegateError,
    } = useContractWrite(delegateConfig);

    const { isLoading: isDelegateTxLoading, isSuccess: isDelegateSuccess } = useWaitForTransaction({
        hash: delegateData?.hash,
        onSuccess(data) {
            setIsDelegated(true);
        },
        onError(err) {
            console.log("Delegate tx error", err);
        },
    });

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: governorAddress,
        abi: governorAbi,
        functionName: "castVoteWithReason",
        args: [loanProposal.onchain_proposal_id, vote, description],
        enabled: isDelegated,
        onError(err) {
            console.log("prepare error", err);
        },
    });

    const {
        write: handleVote,
        data,
        error,
        isLoading: isVoteLoading,
        isError,
    } = useContractWrite(config);

    const { isLoading: isVoteTxLoading, isSuccess: isSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess(data) {
            closeModal();
        },
        onError(err) {
            console.log("tx error", err);
        },
    });

    function closeModal() {
        setCastVoteModalOpen(false);
        modelCloseHandler?.();
    }

    useEffect(() => {
        setIsLoading(isDelegateLoading || isDelegateTxLoading || isVoteLoading || isVoteTxLoading);
    }, [isDelegateLoading, isDelegateTxLoading, isVoteLoading || isVoteTxLoading]);

    return (
        <>
            {hasVoted ? (
                <div className="flex items-center rounded-lg bg-green-600 px-4 py-2 text-gray-200">
                    <CheckIcon className="inline h-6 fill-current text-gray-100" />
                    <span className="ml-2 hidden text-base font-semibold leading-7 md:inline">
                        You have Voted
                    </span>
                </div>
            ) : (
                <div>
                    <button
                        className="btn-primary flex items-center text-base"
                        onClick={(e) => {
                            e.preventDefault();
                            setCastVoteModalOpen(true);
                        }}
                    >
                        <EnvelopeOpenIcon className="inline h-6 fill-current text-white dark:text-gray-800" />
                        <span className="ml-2 hidden md:inline">Vote on this Proposal</span>
                    </button>
                </div>
            )}

            <DialogComponent
                heading="Vote on this Proposal"
                isModelOpen={castVoteModalOpen}
                modelCloseHandler={closeModal}
            >
                <div className="mx-auto mt-4 w-full max-w-md">
                    <Listbox value={vote} onChange={setVote}>
                        <div className="relative mt-1">
                            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                <span className="block truncate font-semibold text-gray-800">
                                    {options.filter((o) => o.id == vote)[0].name}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </span>
                            </Listbox.Button>
                            <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {options.map((option, i) => (
                                        <Listbox.Option
                                            key={i}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                    active
                                                        ? "bg-amber-100 text-amber-900"
                                                        : "text-gray-900"
                                                }`
                                            }
                                            value={option.id}
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span
                                                        className={`block truncate ${
                                                            selected ? "font-medium" : "font-normal"
                                                        }`}
                                                    >
                                                        {option.name}
                                                    </span>
                                                    {selected ? (
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                            <CheckIcon
                                                                className="h-5 w-5"
                                                                aria-hidden="true"
                                                            />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                </div>

                <div className="mx-auto mt-4 w-full max-w-md">
                    <textarea
                        className="mb-2 w-full rounded-lg border-gray-300 text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        rows={4}
                        placeholder="Provide a reasoning for your vote"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                    />
                </div>

                <div className="mt-4 flex w-full items-center gap-4">
                    <button
                        type="button"
                        className="inline-flex rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200
                                                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed 
                                                disabled:opacity-50"
                        onClick={() => handleDelegate?.()}
                        disabled={!isConnected || isLoading || isDelegated}
                    >
                        Delegate
                        {isMounted() && isLoading && !isDelegated ? (
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
                        ) : null}
                    </button>
                    <button
                        type="button"
                        className="inline-flex rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200
                                                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed 
                                                disabled:opacity-50"
                        onClick={() => handleVote?.()}
                        disabled={!isConnected || isLoading || !isDelegated}
                    >
                        Vote
                        {isMounted() && isLoading && isDelegated ? (
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
                        ) : null}
                    </button>
                </div>
                <div className="mt-2">
                    {(isPrepareError || isError || isDelegatePrepareError || isDelegateError) && (
                        <div className="text-red-500">
                            {
                                (prepareError || error || delegateError || delegatePrepareError)
                                    ?.message
                            }
                        </div>
                    )}
                    {isSuccess && (
                        <div className="text-green-500">Transaction submitted, Check Wallet</div>
                    )}
                </div>
            </DialogComponent>
        </>
    );
}
