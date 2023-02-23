import { ArrowLongRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import addresses from "../../constants/contract.json";
import abi from "../../constants/LendPool.json";
import { displayPercent, displayRay, displayUnits } from "../../utils/Math";

export default function TellUsAboutYourself({ loanProposal, setLoanProposal, handle, ...rest }) {
    const [isCompleted, setIsCompleted] = useState(false);

    const { isConnected, address } = useAccount();
    const [isLoading, setIsLoading] = useState(true);

    const [liquidityData, setLiquidityData] = useState([]);
    const [variableRate, setVariableRate] = useState();

    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
    const lendingPoolAddress = addresses[chainId].LendPool;

    useContractRead({
        address: lendingPoolAddress,
        abi,
        functionName: "getLiquidity",
        onSuccess(data) {
            setIsLoading(false);
            setLiquidityData(data);
        },
        onError(err) {
            console.log(err);
        },
        enabled: isConnected,
    });

    useContractRead({
        address: lendingPoolAddress,
        abi,
        functionName: "getBorrowToken",
        onSuccess(data) {
            setIsLoading(false);
            setVariableRate(data.variableBorrowRate);
        },
        onError(err) {
            console.log(err);
        },
        enabled: isConnected,
    });

    const borrowLimit = () => {
        return displayUnits(liquidityData?.availableToBorrow?.mul(10).div(100));
    };

    useEffect(() => {
        setIsCompleted(loanProposal.amount && loanProposal.recipientAddress);
    }, [loanProposal.amount, loanProposal.recipientAddress]);

    return (
        <>
            <div className="mb-8 w-full max-w-2xl px-8" {...rest}>
                <h2 className="max-w-6xl text-4xl font-bold text-white">
                    <span className="bg-gradient-to-r from-indigo-500 to-green-600 bg-clip-text text-transparent">
                        Loan Information
                    </span>
                </h2>
                <div className="mt-6">
                    <h2 className="text-xl font-bold text-gray-500 dark:text-gray-300">
                        How much can I borrow?
                    </h2>
                    <div className="mt-2 flex max-w-md items-center justify-between rounded-lg border border-gray-300 px-4 py-4 text-gray-800 dark:text-gray-200">
                        <div>Current Pool Capacity:</div>
                        <div className="ml-1 font-semibold">
                            {displayUnits(liquidityData.availableToBorrow)} eth
                        </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        We limit indivudual borrowers to a max of
                        <span className="ml-1 font-semibold">10%</span> of the available borrowing
                        power.
                    </p>

                    <div className="mt-4 flex max-w-md  items-center justify-between rounded-lg border border-gray-300 px-4 py-4 text-gray-800 dark:text-gray-200">
                        <div>Your Borrowing Limit (suggested):</div>
                        <div className="ml-1 font-semibold">
                            {liquidityData ? borrowLimit() : "0"} eth
                        </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        The limit is suggested because the pool liquidity may change by the time
                        this proposal is published.
                    </p>

                    <div className="mt-4 flex max-w-md  items-center justify-between rounded-lg border border-gray-300 px-4 py-4 text-gray-800 dark:text-gray-200">
                        <div>Interest Rate (variable):</div>
                        <div className="ml-1 font-semibold">
                            {displayPercent(displayRay(variableRate))}%
                        </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        We currently only offer
                        <span className="ml-1 underline">variable interest rate</span> for all
                        borrowers.
                    </p>

                    <div className="mt-10 flex items-center">
                        <div className="flex-grow border-t border-gray-400"></div>
                        <span className="mx-4 flex-shrink text-gray-400">
                            Provide Loan Information
                        </span>
                        <div className="flex-grow border-t border-gray-400"></div>
                    </div>

                    <label className="mt-8 mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Requested Amount
                    </label>
                    <input
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-blue-600 dark:focus:ring-blue-400"
                        id="amount"
                        type="number"
                        placeholder="Amount in USD"
                        onChange={(e) => {
                            setLoanProposal({
                                ...loanProposal,
                                amount: e.target.value,
                            });
                        }}
                        value={loanProposal.amount}
                        required
                    />

                    <label className="mt-8 mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Disburse To Wallet Address
                    </label>
                    <input
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-blue-600 dark:focus:ring-blue-400"
                        id="recipientAddress"
                        type="text"
                        placeholder="0x Wallet Address"
                        onChange={(e) => {
                            setLoanProposal({
                                ...loanProposal,
                                recipientAddress: e.target.value,
                            });
                        }}
                        value={loanProposal.recipientAddress}
                        required
                    />
                </div>
                <div className="mt-4">
                    <button
                        className="btn-secondary w-full"
                        onClick={handle}
                        disabled={!isCompleted}
                    >
                        Next <ArrowLongRightIcon className="inline h-6 fill-current text-white" />
                    </button>
                </div>
            </div>
        </>
    );
}
