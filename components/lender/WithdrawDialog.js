import { Dialog, Switch, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import {
    useAccount,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import addresses from "../../constants/contract.json";
import abi from "../../constants/LendPool.json";
import { parseEther, parseUnits } from "ethers/lib/utils.js";
import useIsMounted from "../../hooks/useIsMounted";

export default function WithdrawDialog({ isModelOpen, modelCloseHandler, token }) {
    let [isOpen, setIsOpen] = useState(isModelOpen || false);

    const { isConnected, address } = useAccount();

    const [amount, setAmount] = useState("");
    const [parsedAmount, setParsedAmount] = useState(0);

    const [maxWithdrawl, setMaxWithdral] = useState(false);

    const isMounted = useIsMounted();
    const [isLoading, setIsLoading] = useState(false);

    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
    const lendingPoolAddress = addresses[chainId].LendPool;
    const withdrawFunctionName = "withdraw";

    // request withdraw
    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: lendingPoolAddress,
        abi,
        functionName: withdrawFunctionName,
        args: [token?.token, parseEther(parsedAmount?.toString())],
        enabled: parsedAmount > 0 || maxWithdrawl,
        onSettled(data, err) {
            console.log("prepare Settled", { data, error });
        },
        onError(err) {
            console.log("prepare error", err);
        },
    });

    const {
        write: handleWithdraw,
        data,
        error,
        isLoading: isWithdrawLoading,
        isError,
    } = useContractWrite(config);

    const { isLoading: isWithdrawTxLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess(data) {
            closeModal();
        },
        onError(err) {
            console.log("tx error", err);
        },
    });

    useEffect(() => {
        if (maxWithdrawl) {
            setParsedAmount(0);
        } else {
            if (!isNaN(parseFloat(amount))) {
                setParsedAmount(parseFloat(amount));
            } else {
                setParsedAmount(0);
            }
        }
    }, [amount, maxWithdrawl]);

    useEffect(() => {
        setIsLoading(isWithdrawLoading || isWithdrawTxLoading);
    }, [isWithdrawLoading || isWithdrawTxLoading]);

    function closeModal() {
        setIsOpen(false);
        setAmount("");
        setMaxWithdral(false);
        modelCloseHandler?.();
    }

    useEffect(() => {
        setIsOpen(isModelOpen);
    }, [isModelOpen]);

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Withdraw
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Withdraw your{" "}
                                            <span className="font-semibold">
                                                {token?.name} - {token?.symbol}
                                            </span>{" "}
                                            tokens from the contract
                                        </p>
                                    </div>

                                    <div className="mt-3">
                                        <input
                                            type="text"
                                            placeholder="0.1"
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500  dark:bg-gray-800 dark:text-gray-200 dark:focus:border-blue-600 dark:focus:ring-blue-400"
                                            value={amount}
                                            disabled={maxWithdrawl}
                                            onChange={(e) => setAmount(e.target.value)}
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <div className="mb-4 flex items-center">
                                            <Switch
                                                checked={maxWithdrawl}
                                                onChange={setMaxWithdral}
                                                className={`${
                                                    maxWithdrawl ? "bg-indigo-600" : "bg-gray-200"
                                                } h-6 w-8 rounded-full`}
                                            />
                                            <div className="ml-2 text-gray-600">Max amount</div>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex w-full items-center justify-between">
                                        <button
                                            type="button"
                                            className="btn-primary mt-2 inline-flex w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
                                            onClick={() => handleWithdraw?.()}
                                            disabled={!isConnected || isLoading}
                                        >
                                            Withdraw
                                            {isMounted() && isLoading ? (
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
                                    <div className="mt-4 flex w-full items-center">
                                        {(isPrepareError || isError) && (
                                            <div className="text-red-500">
                                                Error: {(prepareError || error)?.message}
                                            </div>
                                        )}
                                        {isSuccess && (
                                            <div className="text-green-500">
                                                Transaction submitted, Check Wallet
                                            </div>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
