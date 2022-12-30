import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import {
    useAccount,
    useContractWrite,
    useNetwork,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import wethAbi from "../constants/abis/weth.json";
import addresses from "../constants/contract.json";
import abi from "../constants/swaprouter.json";
import { parseEther } from "ethers/lib/utils.js";
import useIsMounted from "../hooks/useIsMounted";

export default function SendWethToDaiDialog({ isModelOpen, modelCloseHandler }) {
    let [isOpen, setIsOpen] = useState(isModelOpen || false);

    const { isConnected, address } = useAccount();
    const [weth, setWeth] = useState("");
    const [wethAmount, setWethAmount] = useState(0);
    const isMounted = useIsMounted();
    const [isLoading, setIsLoading] = useState(false);

    const { chain } = useNetwork();
    const chainId = "31337"; // TODOD change this
    const swapRouterAddress = addresses[chainId].SwapRouter[0];
    const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const approveFunctionName = "approve";
    const swapFunctionName = "swapWETHForDai";

    // first approve weth transfer
    const {
        config: approveConfig,
        error: approvePrepareError,
        isError: isApprovePrepareError,
    } = usePrepareContractWrite({
        address: wethAddress,
        abi: wethAbi,
        functionName: approveFunctionName,
        args: [swapRouterAddress, parseEther(wethAmount?.toString())],
        enabled: wethAmount > 0,
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
            handleSwap?.();
        },
    });

    // once approve then swap
    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: swapRouterAddress,
        abi,
        functionName: swapFunctionName,
        args: [parseEther(wethAmount?.toString())],
        enabled: wethAmount > 0,
    });

    const {
        write: handleSwap,
        data,
        error,
        isLoading: isSwapLoading,
        isError,
    } = useContractWrite(config);

    const { isLoading: isSwapTxLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess(data) {
            setWeth("");
        },
    });

    useEffect(() => {
        setIsLoading(isApproveLoading || isApproveTxLoading || isSwapLoading || isSwapTxLoading);
    }, [isApproveLoading, isApproveTxLoading, isSwapLoading, isSwapTxLoading]);

    useEffect(() => {
        if (!isNaN(parseFloat(weth))) {
            setWethAmount(parseFloat(weth));
        } else {
            setWethAmount(0);
        }
    }, [weth]);

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
                                        Send Weth to DAI
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Transfer some of your weth to dai to deposit in the
                                            contract
                                        </p>
                                    </div>

                                    <div className="mt-3">
                                        <input
                                            type="text"
                                            placeholder="0.1 WETH"
                                            className="max-w-sm appearance-none border border-gray-400 py-2 px-3 leading-tight focus:outline-none"
                                            value={weth}
                                            onChange={(e) => setWeth(e.target.value)}
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
                                            Swap
                                            {isMounted() && isLoading ? (
                                                <svg
                                                    class="text-indigo ml-3 h-5 w-5 animate-spin"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        class="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        stroke-width="4"
                                                    ></circle>
                                                    <path
                                                        class="opacity-75"
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
