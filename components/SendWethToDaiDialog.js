import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import {
    useAccount,
    useContractWrite,
    useFeeData,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import addresses from "../constants/contract.json";
import abi from "../constants/swaprouter.json";
import { parseEther } from "ethers/lib/utils.js";
import useIsMounted from "../hooks/useIsMounted";
import { erc20ABI } from "wagmi";

export default function SendWethToDaiDialog({
    isModelOpen,
    modelCloseHandler,
    tokenMarketDataForCaller,
}) {
    let [isOpen, setIsOpen] = useState(isModelOpen || false);

    const { isConnected, address } = useAccount();

    const [amount, setAmount] = useState("");
    const [parsedAmount, setParsedAmount] = useState(0);

    // WETH as default for FROM
    const [fromToken, setFromToken] = useState("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");
    // DAI as default for TO
    const [toToken, setToToken] = useState("0x6B175474E89094C44Da98b954EedeAC495271d0F");

    const isMounted = useIsMounted();
    const [isLoading, setIsLoading] = useState(false);

    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
    const swapRouterAddress = addresses[chainId].SwapRouter[0];
    const approveFunctionName = "approve";
    const swapFunctionName = "swap";

    const { data: feeData } = useFeeData();

    // first approve weth transfer
    const {
        config: approveConfig,
        error: approvePrepareError,
        isError: isApprovePrepareError,
    } = usePrepareContractWrite({
        address: fromToken,
        abi: erc20ABI,
        functionName: approveFunctionName,
        args: [swapRouterAddress, parseEther(parsedAmount?.toString())],
        enabled: parsedAmount > 0,
        overrides: {
            gasPrice: feeData?.gasPrice,
        },
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
        args: [fromToken, toToken, parseEther(parsedAmount?.toString())],
        enabled: parsedAmount > 0,
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
            setAmount("");
            closeModal();
        },
    });

    useEffect(() => {
        setIsLoading(isApproveLoading || isApproveTxLoading || isSwapLoading || isSwapTxLoading);
    }, [isApproveLoading, isApproveTxLoading, isSwapLoading, isSwapTxLoading]);

    useEffect(() => {
        if (!isNaN(parseFloat(amount))) {
            setParsedAmount(parseFloat(amount));
        } else {
            setParsedAmount(0);
        }
    }, [amount]);

    function closeModal() {
        setIsOpen(false);
        modelCloseHandler?.();
    }

    useEffect(() => {
        setIsOpen(isModelOpen);
    }, [isModelOpen]);

    const handleFromTokenChange = (e) => {
        setFromToken(e.target.value);
    };
    const handleToTokenChange = (e) => {
        setToToken(e.target.value);
    };

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
                                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Swap Tokens
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Transfer from one ERC token to another
                                        </p>
                                    </div>

                                    <div className="flex-cols mt-3 flex space-x-4 sm:flex-row">
                                        <select
                                            className="block rounded border border-gray-200 bg-white py-2 px-4 leading-tight text-gray-700 focus:outline-none"
                                            id="fromTokenSelect"
                                            onChange={handleFromTokenChange}
                                            defaultValue={fromToken}
                                        >
                                            {tokenMarketDataForCaller.map((token, index) => {
                                                return (
                                                    <option key={index} value={token?.token}>
                                                        {token?.tokenSymbol}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <input
                                            type="text"
                                            placeholder="0.1"
                                            className="max-w-sm appearance-none border border-gray-400 py-2 px-3 leading-tight focus:outline-none"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                        />
                                        <select
                                            className="block rounded border border-gray-200 bg-white py-2 px-4 leading-tight text-gray-700 focus:outline-none"
                                            id="toTokenSelect"
                                            onChange={handleToTokenChange}
                                            defaultValue={toToken}
                                        >
                                            {tokenMarketDataForCaller.map((token, index) => {
                                                return (
                                                    <option key={index} value={token?.token}>
                                                        {token?.tokenSymbol}
                                                    </option>
                                                );
                                            })}
                                        </select>
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
