import { useEffect, useState } from "react";
import {
    useAccount,
    useContractRead,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import addresses from "../../constants/contract.json";
import abi from "../../constants/LendPool.json";
import { parseUnits } from "ethers/lib/utils.js";
import useIsMounted from "../../hooks/useIsMounted";
import { erc20ABI } from "wagmi";
import { findEvent, saveEvent } from "../../utils/Events";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import DialogComponent from "../ui/DialogComponent";
import { displayUnits, displayUnits8 } from "../../utils/Math";

export default function DepositDialog({ isModelOpen, modelCloseHandler, token }) {
    let [isOpen, setIsOpen] = useState(isModelOpen || false);

    const { isConnected, address } = useAccount();

    const supabase = useSupabaseClient();
    const user = useUser();

    const [amount, setAmount] = useState("");
    const [parsedAmount, setParsedAmount] = useState(0);

    const [tokenBalance, setTokenBalance] = useState();

    const isMounted = useIsMounted();
    const [isLoading, setIsLoading] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [otherError, setOtherError] = useState();

    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
    const lendingPoolAddress = addresses[chainId].LendPool;
    const approveFunctionName = "approve";
    const depositFunctionName = "deposit";

    useContractRead({
        address: token?.token,
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [address],
        onSuccess(data) {
            const balance = displayUnits8(data);
            setTokenBalance(balance);
        },
        onError(err) {
            console.log("token balance contract read error", err.message);
        },
        enabled: isConnected,
    });

    // first approve token transfer to our contract
    const {
        config: approveConfig,
        error: approvePrepareError,
        isError: isApprovePrepareError,
    } = usePrepareContractWrite({
        address: token?.token,
        abi: erc20ABI,
        functionName: approveFunctionName,
        args: [
            lendingPoolAddress,
            parseUnits(parsedAmount?.toString(), token?.tokenDecimals?.toNumber()),
        ],
        enabled: parsedAmount > 0,
        onError(err) {
            console.log("Approve prepare error", err);
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
            setIsApproved(true);
            handleDeposit?.();
        },
        onError(err) {
            console.log("Approve tx error", err);
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
        args: [
            token?.token,
            parseUnits(parsedAmount?.toString(), token?.tokenDecimals?.toNumber()),
        ],
        enabled: parsedAmount > 0,
        onError(err) {
            console.log("Deposit prepare error", err);
            setOtherError(err);
        },
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
            const eventsAbi = [
                "event DepositMade(address indexed user, address indexed token, uint256 amount)",
            ];

            findEvent(
                eventsAbi,
                data.logs.filter((log) => log.address == lendingPoolAddress)
            ).then((events) => {
                events.map((event) => saveEvent(supabase, event));
                closeModal(true);
            });
        },
        onError(err) {
            console.log("Deposit tx error", err.message);
            setOtherError(err.message);
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
        setAmount("");
        setIsApproved(false);
        modelCloseHandler?.();
    }

    useEffect(() => {
        setIsOpen(isModelOpen);
    }, [isModelOpen]);

    return (
        <>
            <DialogComponent
                heading={`Deposit ${token?.tokenSymbol} Tokens`}
                isModelOpen={isModelOpen}
                modelCloseHandler={closeModal}
                explicitClose={true}
            >
                <div className="mt-4 mb-4 w-full max-w-md">
                    <div className="rounded-lg border border-gray-500 px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="font-semibold text-gray-700 dark:text-gray-200">
                                Your {token?.tokenSymbol} Balance
                            </div>
                            <div className="font-semibold text-gray-700 dark:text-gray-200">
                                {tokenBalance}
                            </div>
                        </div>
                    </div>
                    {/* <p className="mt-4 text-sm text-gray-500">
                        Transfer your
                        <span className="font-bold"> {token?.tokenName} </span>
                        tokens to deposit in the contract
                    </p> */}

                    <p className="mt-8 text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Amount To Deposit
                    </p>

                    <div className="mt-2">
                        <input
                            type="number"
                            placeholder="0.1"
                            className="w-full appearance-none rounded-lg border-gray-300 accent-red-500 shadow-sm outline-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-white dark:text-gray-800 dark:focus:border-slate-600 dark:focus:ring-slate-600"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <div className="mt-4 flex w-full items-center">
                        <button
                            type="button"
                            className="btn-secondary inline-flex w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() => (!isApproved ? handleApprove?.() : handleDeposit?.())}
                            disabled={!isConnected || isLoading}
                        >
                            {!isApproved ? "Approve (1/2)" : "Deposit (2/2)"}
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

                    <div className="mt-4">
                        <p className="text-sm dark:text-gray-200">
                            After deposit, make sure to add governance tokens to your wallet from
                            the link on the page.
                        </p>
                    </div>
                </div>

                {(isPrepareError ||
                    isError ||
                    isApprovePrepareError ||
                    isApproveError ||
                    otherError) && (
                    <div className="mt-4 flex w-full items-center">
                        <div className="text-red-500">
                            {
                                (
                                    prepareError ||
                                    error ||
                                    approveEror ||
                                    approvePrepareError ||
                                    otherError
                                )?.message
                            }
                        </div>
                    </div>
                )}
                {isSuccess && (
                    <div className="mt-4 flex w-full items-center">
                        <div className="text-green-500">Transaction submitted, Check Wallet</div>
                    </div>
                )}
            </DialogComponent>
        </>
    );
}
