import { ArrowLongRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import addresses from "../../constants/contract.json";
import abi from "../../constants/LendPool.json";
import { displayPercent, displayRay } from "../../utils/Math";
import { addTokenToMetaMask } from "../../utils/Metamask";
import ListBoxComponent from "../ui/ListBoxComponent";
import RadioGroupComponent from "../ui/RadioGroupComponent";

export default function TellUsAboutYourself({ loanProposal, setLoanProposal, handle, ...rest }) {
    const [isCompleted, setIsCompleted] = useState(false);

    const { isConnected, address } = useAccount();
    const [isLoading, setIsLoading] = useState(true);

    const [liquidityData, setLiquidityData] = useState([]);
    const [variableRate, setVariableRate] = useState();

    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
    const lendingPoolAddress = addresses[chainId].LendPool;

    const [borrowTokensMD, setBorrowTokensMD] = useState();

    const [payoutData, setPayoutData] = useState(
        loanProposal.payout_data || {
            payoutToken: "",
            walletAddress: "",
        }
    );

    let USDollar = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

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
        functionName: "getBorrowTokens",
        onSuccess(data) {
            setIsLoading(false);
            setBorrowTokensMD(data);

            const selectedToken = loanProposal.payout_data?.payoutToken
                ? data.find((d) => d.token === loanProposal.payout_data?.payoutToken.address)
                : data[0];
            setPayoutData({
                ...payoutData,
                payoutToken: selectedToken ?? data[0],
            });
            console.log(data[0]);
        },
        onError(err) {
            console.log(err);
        },
        enabled: isConnected && loanProposal?.payout_mode === "crypto",
    });

    const borrowLimit = () => {
        return USDollar.format(liquidityData?.availableToBorrow?.mul(10).div(100) || 0);
    };

    const tokenDisplay = (token) => {
        return token?.tokenSymbol + " - " + token?.tokenName;
    };

    useEffect(() => {
        if (payoutData && payoutData.payoutToken) {
            setVariableRate(payoutData.payoutToken.variableBorrowRate);
        }
    }, [payoutData]);

    useEffect(() => {
        let completed = true;
        if (!loanProposal.amount || !loanProposal.payout_mode) completed = false;
        else {
            if (loanProposal.payout_mode == "crypto") {
                completed = payoutData.payoutToken && payoutData.walletAddress;
            }
        }
        setIsCompleted(completed);
    }, [loanProposal.amount, loanProposal.payout_mode, payoutData]);

    const handleNext = async () => {
        if (loanProposal.payout_mode === "crypto") {
            setLoanProposal({
                ...loanProposal,
                payout_data: {
                    ...payoutData,
                    payoutToken: {
                        address: payoutData.payoutToken.token,
                        decimals: payoutData.payoutToken.tokenDecimals.toNumber(),
                    },
                    walletAddress: payoutData.walletAddress,
                },
            });
        }

        handle?.();
    };

    return (
        <>
            <div className="mb-8 w-full max-w-2xl px-8" {...rest}>
                <h2 className="max-w-6xl text-4xl font-bold text-white">
                    <span className="bg-gradient-to-r from-indigo-500 to-green-600 bg-clip-text text-transparent">
                        Loan Information
                    </span>
                </h2>
                <div className="mt-6">
                    <div className="mt-2 flex max-w-md items-center justify-between rounded-lg border border-gray-200 px-4 py-4 text-sm text-gray-800 dark:border-gray-600 dark:text-gray-200">
                        <span>Current Pool Capacity:</span>
                        <div className="ml-1 font-semibold">
                            {USDollar.format(liquidityData.availableToBorrow || 0)}
                        </div>
                    </div>
                    <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
                        We limit indivudual borrowers to a max of
                        <span className="ml-1 font-semibold">10%</span> of the available borrowing
                        power
                    </p>

                    <div className="mt-4 flex max-w-md items-center justify-between rounded-lg border border-gray-200 px-4 py-4 text-sm text-gray-800 dark:border-gray-600 dark:text-gray-200">
                        <span>Your Borrowing Limit (suggested):</span>
                        <div className="ml-1 font-semibold">
                            {liquidityData ? borrowLimit() : "0"}
                        </div>
                    </div>
                    <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
                        The is a suggested limit but the pool liquidity may change by the time this
                        proposal is published. You can adjust until the proposal is published
                    </p>

                    <div className="mt-4 flex max-w-md items-center justify-between rounded-lg border border-gray-200 px-4 py-4 text-sm text-gray-800 dark:border-gray-600 dark:text-gray-200">
                        <span>Interest Rate (variable):</span>
                        <div className="ml-1 font-semibold">
                            {displayPercent(displayRay(variableRate))}%
                        </div>
                    </div>
                    <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
                        We currently only offer
                        <span className="ml-1 underline">variable interest rate</span> for all
                        borrowers
                    </p>

                    <label className="mt-8 mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Requested Amount in $
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

                    <RadioGroupComponent
                        value={loanProposal.payout_mode}
                        setValue={(value) =>
                            setLoanProposal({ ...loanProposal, payout_mode: value })
                        }
                        label="Choose how to receive borrowed money"
                        options={[
                            {
                                key: "fiat",
                                label: "Pay in USD",
                                info: "You will receive the borrowed amount in USD",
                            },
                            {
                                key: "crypto",
                                label: "Pay in Crypto",
                                info: "You will receive the borrowed amount in Stable Coins",
                            },
                        ]}
                    />

                    {loanProposal.payout_mode === "crypto" && (
                        <div className="mt-8 mb-2">
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                Choose which stable coin to receive borrowed amount in
                            </label>

                            <ListBoxComponent
                                value={payoutData.payoutToken}
                                setValue={(value) =>
                                    setPayoutData({ ...payoutData, payoutToken: value })
                                }
                                valueDisplay={tokenDisplay}
                                options={borrowTokensMD}
                            />

                            <a
                                href="#"
                                className="text-xs font-semibold text-indigo-500 dark:text-emerald-300"
                                onClick={(e) => {
                                    e.preventDefault();
                                    addTokenToMetaMask({
                                        token: payoutData.payoutToken?.token,
                                        tokenSymbol: payoutData.payoutToken?.tokenSymbol,
                                        tokenDecimals: payoutData.payoutToken?.tokenDecimals,
                                    });
                                }}
                            >
                                Add Borrow Token to Metamask
                            </a>

                            <label className="mt-8 mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                Wallet address to receive stable coins
                            </label>
                            <input
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-blue-600 dark:focus:ring-blue-400"
                                id="walletAddress"
                                type="text"
                                placeholder="0x Wallet Address"
                                onChange={(e) => {
                                    setPayoutData({
                                        ...payoutData,
                                        walletAddress: e.target.value,
                                    });
                                }}
                                value={payoutData.walletAddress}
                                required
                            />
                        </div>
                    )}
                </div>
                <div className="mt-6">
                    <button
                        className="btn-secondary w-full"
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
