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
import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import useIsMounted from "../../../hooks/useIsMounted";
import { CheckIcon, ChevronUpDownIcon, EnvelopeOpenIcon } from "@heroicons/react/24/solid";
import DialogComponent from "../../DialogComponent";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { findEvent, saveEvent } from "../../../utils/Events";
import { displayUnits } from "../../../utils/Math";

export default function CastVoteDialog({ loanProposal, onVoteSuccess, forceLong = false }) {
    let [castVoteModalOpen, setCastVoteModalOpen] = useState();

    const supabase = useSupabaseClient();
    const user = useUser();

    const isMounted = useIsMounted();
    const [isLoading, setIsLoading] = useState(false);
    const [isDelegated, setIsDelegated] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [votingPower, setVotingPower] = useState();
    const [totalVotingPower, setTotalVotingPower] = useState();

    const { address, isConnected } = useAccount();
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
    const governorAddress = addresses[chainId].LoanGovernor;
    const govTokenAddress = addresses[chainId].GovToken;

    const options = [
        {
            name: "Accept this proposal",
            id: 1,
            descr: "Vote in favor of this proposal being approved",
        },
        {
            name: "Reject this proposal",
            id: 0,
            descr: "Vote against this proposal being approved",
        },
        // {
        //     name: "Abstain from voting",
        //     id: 2,
        //     descr: "Essentially no vote",
        // },
    ];
    const [description, setDescription] = useState("");
    const [vote, setVote] = useState(1);

    useContractRead({
        address: govTokenAddress,
        abi: govTokenAbi,
        functionName: "balanceOf",
        args: [address],
        onSuccess(data) {
            const balance = displayUnits(data);
            setVotingPower(balance);
        },
        onError(err) {
            console.log("gov token balance contract read error", err.message);
        },
        enabled: isConnected,
    });

    useContractRead({
        address: govTokenAddress,
        abi: govTokenAbi,
        functionName: "totalSupply",
        onSuccess(data) {
            const balance = displayUnits(data);
            setTotalVotingPower(balance);
        },
        onError(err) {
            console.log("gov token balance contract read error", err.message);
        },
        enabled: isConnected,
    });

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
        address: govTokenAddress,
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
            const abi = [
                "event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 weight, string reason)",
            ];
            findEvent(
                abi,
                data.logs.filter((log) => log.address == governorAddress),
                { proposal_id: loanProposal.id }
            ).then((events) => {
                events.map((event) => saveEvent(supabase, event));
                closeModal();
                onVoteSuccess?.();
            });
        },
        onError(err) {
            console.log("tx error", err);
        },
    });

    function closeModal() {
        setCastVoteModalOpen(false);
    }

    const percentage = (num, total) => {
        return (num / total) * 100;
    };

    useEffect(() => {
        setIsLoading(isDelegateLoading || isDelegateTxLoading || isVoteLoading || isVoteTxLoading);
    }, [isDelegateLoading, isDelegateTxLoading, isVoteLoading || isVoteTxLoading]);

    return (
        <>
            {hasVoted ? (
                <div className="flex items-center justify-center rounded-lg bg-green-600 px-4 py-2">
                    <CheckIcon className="inline h-6 fill-current text-gray-100" />
                    <div
                        className={`ml-2 text-base font-semibold leading-7 text-gray-100 md:inline ${
                            !forceLong && "hidden"
                        }`}
                    >
                        You have Voted
                    </div>
                </div>
            ) : (
                <div>
                    <button
                        className="btn-primary flex w-full items-center justify-center text-center"
                        onClick={(e) => {
                            e.preventDefault();
                            setCastVoteModalOpen(true);
                        }}
                    >
                        <EnvelopeOpenIcon className="inline h-6 fill-current text-gray-100 dark:text-gray-800" />
                        <span
                            className={`ml-2 text-base font-semibold leading-7 text-gray-100 dark:text-gray-800 md:inline ${
                                !forceLong && "hidden"
                            }`}
                        >
                            Vote on this Proposal
                        </span>
                    </button>
                </div>
            )}

            <DialogComponent
                heading="Vote on this Proposal"
                isModelOpen={castVoteModalOpen}
                modelCloseHandler={closeModal}
                explicitClose={true}
            >
                <div className="mt-4 w-full max-w-md">
                    <div className="rounded-lg border border-gray-500 px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="font-semibold text-gray-800">Your Voting Power</div>
                            <div className="font-semibold text-gray-800">{votingPower}</div>
                        </div>
                        <div className="mt-2 flex items-center justify-between ">
                            <div className="text-gray-800">% of Total Voting Power</div>
                            <div className="text-gray-800">
                                {percentage(votingPower, totalVotingPower)}%
                            </div>
                        </div>
                    </div>

                    <p className="mt-4 text-center text-lg">Step 1</p>
                    <p className="mt-2 text-center">Assign a delegate for voting</p>

                    <div className="mt-2 flex w-full items-center">
                        <button
                            className="btn-primary inline-flex w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() => handleDelegate?.()}
                            disabled={!isConnected || isLoading || isDelegated}
                        >
                            Self Delegate
                            {isMounted() && isLoading && !isDelegated ? (
                                <svg
                                    className="text-indigo ml-3 h-6 w-6 animate-spin"
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

                    <div className="mt-10 flex items-center">
                        <div className="flex-grow border-t border-gray-400 dark:border-gray-200"></div>
                        <span className="mx-4 flex-shrink text-gray-400 dark:text-gray-200">
                            And
                        </span>
                        <div className="flex-grow border-t border-gray-400 dark:border-gray-200"></div>
                    </div>

                    <p className="mt-6 text-center text-lg">Step 2</p>
                    <p className="mt-2 text-center">Make your voting selections</p>

                    <Listbox value={vote} onChange={setVote}>
                        <div className="relative mt-2">
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

                <div className="mt-4 w-full max-w-md">
                    <textarea
                        className="w-full rounded-lg border-gray-300 text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        rows={4}
                        placeholder="Provide a reasoning for your vote"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                    />
                </div>

                <div className="mt-2 flex w-full items-center">
                    <button
                        type="button"
                        className="btn-primary inline-flex w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => handleVote?.()}
                        disabled={!isConnected || isLoading || !isDelegated}
                    >
                        Vote
                        {isMounted() && isLoading && isDelegated ? (
                            <svg
                                className="text-indigo ml-3 h-6 w-6 animate-spin"
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

                {(isPrepareError || isError || isDelegatePrepareError || isDelegateError) && (
                    <div className="mt-4">
                        <div className="text-red-500">
                            {
                                (prepareError || error || delegateError || delegatePrepareError)
                                    ?.message
                            }
                        </div>
                    </div>
                )}
                {isSuccess && (
                    <div className="mt-4">
                        <div className="text-green-500">Transaction submitted, Check Wallet</div>
                    </div>
                )}
            </DialogComponent>
        </>
    );
}
