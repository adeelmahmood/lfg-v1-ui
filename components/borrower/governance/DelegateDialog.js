import {
    useAccount,
    useContractRead,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import addresses from "../../../constants/contract.json";
import govTokenAbi from "../../../constants/GovToken.json";
import { useEffect, useState } from "react";
import useIsMounted from "../../../hooks/useIsMounted";
import { CheckIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import DialogComponent from "../../DialogComponent";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { displayUnits } from "../../../utils/Math";

export default function DelegateDialog({ loanProposal, onDelegateSuccess, forceLong = false }) {
    let [delegateModalOpen, setDelegateModalOpen] = useState();

    const supabase = useSupabaseClient();
    const user = useUser();

    const isMounted = useIsMounted();
    const [isLoading, setIsLoading] = useState(false);
    const [hasDelegated, setHasDelegated] = useState(false);
    const [votingPower, setVotingPower] = useState();
    const [totalVotingPower, setTotalVotingPower] = useState();

    const { address, isConnected } = useAccount();
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
    const govTokenAddress = addresses[chainId].GovToken;

    useContractRead({
        address: govTokenAddress,
        abi: govTokenAbi,
        functionName: "delegates",
        args: [address],
        onSuccess(data) {
            if (data && data != "0x0000000000000000000000000000000000000000") setHasDelegated(true);
        },
        onError(err) {
            console.log("gov token balance contract read error", err.message);
        },
        enabled: isConnected,
    });

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

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: govTokenAddress,
        abi: govTokenAbi,
        functionName: "delegate",
        args: [address],
        enabled: isConnected,
        onError(err) {
            console.log("delegate prepare error", err);
        },
    });

    const {
        write: handle,
        data,
        error,
        isLoading: isDelLoading,
        isError,
    } = useContractWrite(config);

    const { isLoading: isTxLoading, isSuccess: isSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess() {
            closeModal();
            onDelegateSuccess?.();
        },
        onError(err) {
            console.log("Delegate tx error", err);
        },
    });

    function closeModal() {
        setDelegateModalOpen(false);
    }

    const percentage = (num, total) => {
        const p = (num / total) * 100;
        return !isNaN(p) && p > 0 ? Math.round(p * 1e2) / 1e2 : 0;
    };

    useEffect(() => {
        setIsLoading(isDelLoading || isTxLoading);
    }, [isTxLoading, isDelLoading]);

    return (
        <>
            {hasDelegated ? (
                <div className="flex items-center justify-center rounded-lg bg-green-600 px-4 py-2">
                    <CheckIcon className="inline h-6 fill-current text-gray-100" />
                    <div
                        className={`ml-2 text-base font-semibold leading-7 text-gray-100 md:inline ${
                            !forceLong && "hidden"
                        }`}
                    >
                        You have Delegated
                    </div>
                </div>
            ) : (
                <div>
                    <button
                        className="btn-primary flex w-full items-center justify-center text-center"
                        onClick={(e) => {
                            e.preventDefault();
                            setDelegateModalOpen(true);
                        }}
                    >
                        <UserCircleIcon className="inline h-6 fill-current text-gray-100 dark:text-gray-800" />
                        <span
                            className={`ml-2 text-base font-semibold leading-7 text-gray-100 dark:text-gray-800 md:inline ${
                                !forceLong && "hidden"
                            }`}
                        >
                            Assign Delegate
                        </span>
                    </button>
                </div>
            )}

            <DialogComponent
                heading="Assign Delegate For Voting"
                isModelOpen={delegateModalOpen}
                modelCloseHandler={closeModal}
                explicitClose={true}
            >
                <div className="mt-4 w-full max-w-md">
                    <div className="rounded-lg border border-gray-500 px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="font-semibold text-gray-800 dark:text-gray-200">
                                Your Voting Power
                            </div>
                            <div className="font-semibold text-gray-800 dark:text-gray-200">
                                {votingPower}
                            </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between ">
                            <div className="text-gray-800 dark:text-gray-200">
                                % of Total Voting Power
                            </div>
                            <div className="text-gray-800 dark:text-gray-200">
                                {percentage(votingPower, totalVotingPower)}%
                            </div>
                        </div>
                    </div>

                    <p className="mt-8 text-lg dark:text-gray-200">Assign a delegate for voting</p>

                    <div className="mt-2 flex w-full items-center">
                        <button
                            className="btn-secondary inline-flex w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() => handle?.()}
                            disabled={!isConnected || isLoading}
                        >
                            Self Delegate
                            {isMounted() && isLoading ? (
                                <svg
                                    className="text-indigo ml-3 h-6 w-6 animate-spin dark:text-gray-200"
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

                    {/* <div className="mt-10 flex items-center">
                        <div className="flex-grow border-t border-gray-400"></div>
                        <span className="mx-4 flex-shrink text-gray-400">OR</span>
                        <div className="flex-grow border-t border-gray-400"></div>
                    </div>

                    <div className="mt-6 flex flex-col space-y-2">
                        <p className="text-lg dark:text-gray-200">
                            Pass voting rights to another address
                        </p>
                        <input
                            type="text"
                            placeholder="0x Delegate Address"
                            className="w-full appearance-none rounded-lg border-gray-300 accent-red-500 shadow-sm outline-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-200 dark:text-gray-800 dark:focus:border-slate-600 dark:focus:ring-slate-600"
                        />
                        <button
                            className="btn-secondary inline-flex w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() => handle?.()}
                            disabled={!isConnected || isLoading}
                        >
                            Delegate To
                            {isMounted() && isLoading ? (
                                <svg
                                    className="text-indigo ml-3 h-6 w-6 animate-spin dark:text-gray-200"
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

                    <div className="mt-4">
                        <p className="text-sm dark:text-gray-200">
                            The above address will be able to vote on this proposal on your behalf
                        </p>
                    </div> */}
                </div>

                {(isPrepareError || isError) && (
                    <div className="mt-4">
                        <div className="text-red-500">{(prepareError || error)?.message}</div>
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
