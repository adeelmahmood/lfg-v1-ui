import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import {
    useAccount,
    useContractWrite,
    useNetwork,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import addresses from "../constants/contract.json";
import abi from "../constants/lendingpool.json";
import { parseEther } from "ethers/lib/utils.js";
import useIsMounted from "../hooks/useIsMounted";
import { erc20ABI } from "wagmi";

export default function DepositDialog({ isModelOpen, modelCloseHandler, token }) {
    let [isOpen, setIsOpen] = useState(isModelOpen || false);

    const { isConnected, address } = useAccount();
    const [amount, setAmount] = useState("");
    const [parsedAmount, setParsedAmount] = useState(0);
    const isMounted = useIsMounted();
    const [isLoading, setIsLoading] = useState(false);

    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
    const lendingPoolAddress = addresses[chainId].LendingPool[0];
    const lendingPoolCoreAddress = addresses[chainId].LendingPoolCore[0];
    const approveFunctionName = "approve";
    const depositFunctionName = "deposit";

    // first approve token transfer to our contract
    const {
        config: approveConfig,
        error: approvePrepareError,
        isError: isApprovePrepareError,
    } = usePrepareContractWrite({
        address: token?.token,
        abi: erc20ABI,
        functionName: approveFunctionName,
        args: [lendingPoolAddress, parseEther(parsedAmount?.toString())],
        enabled: parsedAmount > 0,
    });

    const {
        write: handleApprove,
        data: approveData,
        error: approveEror,
        isLoading: isApproveLoading,
        isError: isApproveError,
    } = useContractWrite(approveConfig);

    const { isLoading: isApproveTxLoading, isSuccess: isApproveSuccess } = useWaitForTransaction({
        hash: approveData?.hash,
        onSuccess(data) {
            // approved, call the swap function
            handleDeposit?.();
        },
    });

    // once approved then deposit
    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: lendingPoolAddress,
        abi,
        functionName: depositFunctionName,
        args: [token?.token, parseEther(parsedAmount?.toString())],
        enabled: parsedAmount > 0,
    });

    const {
        write: handleDeposit,
        data,
        error,
        isLoading: isDespoitLoading,
        isError,
    } = useContractWrite(config);

    const { isLoading: isDespoitTxLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess(data) {
            setAmount("");
        },
    });

    useEffect(() => {
        if (!isNaN(parseFloat(amount))) {
            setParsedAmount(parseFloat(amount));
        } else {
            setParsedAmount(0);
        }
    }, [amount]);

    useEffect(() => {
        setIsLoading(
            isApproveLoading || isApproveTxLoading || isDespoitLoading || isDespoitTxLoading
        );
    }, [isApproveLoading, isApproveTxLoading, isDespoitLoading || isDespoitTxLoading]);

    function closeModal() {
        setIsOpen(false);

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
                                        Deposit ERC20 Tokens
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Transfer your {token?.tokenName} - {token?.tokenSymbol}{" "}
                                            tokens to deposit in the contract
                                        </p>
                                    </div>

                                    <div className="flex-cols mt-3 flex space-x-4 sm:flex-row">
                                        <select
                                            className="block rounded border border-gray-200 bg-white py-2 px-4 leading-tight text-gray-700 focus:outline-none"
                                            id="grid-state"
                                        >
                                            <option value={token?.token}>
                                                {token?.tokenSymbol}
                                            </option>
                                        </select>
                                        <input
                                            type="text"
                                            placeholder="0.1"
                                            className="max-w-sm appearance-none border border-gray-400 py-2 px-3 leading-tight focus:outline-none"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                        />
                                    </div>

                                    <div className="mt-4 flex w-full items-center justify-between">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200
                                                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed 
                                                disabled:opacity-50"
                                            onClick={() => handleApprove?.()}
                                            disabled={!isConnected || isLoading}
                                        >
                                            Deposit
                                            {isMounted() && isLoading ? (
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
                                        {(isPrepareError ||
                                            isError ||
                                            isApprovePrepareError ||
                                            isApproveError) && (
                                            <div className="text-red-500">
                                                Error:{" "}
                                                {
                                                    (
                                                        prepareError ||
                                                        error ||
                                                        approveEror ||
                                                        approvePrepareError
                                                    )?.message
                                                }
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