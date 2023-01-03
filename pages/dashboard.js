import Link from "next/link";
import Navbar from "../components/Navbar";
import TopGradient from "../components/TopGradient";
import BottomGradient from "../components/BottomGradient";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import addresses from "../constants/contract.json";
import abi from "../constants/lendingpool.json";

import { useEffect, useState } from "react";
import { formatEther, formatUnits } from "ethers/lib/utils.js";
import { BigNumber } from "ethers";
import SendEthToWethDialog from "../components/SendEthToWethDialog";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import SendWethToDaiDialog from "../components/SendWethToDaiDialog";
import DepositDialog from "../components/DepositDialog";

export default function Dashboard() {
    const { isConnected, address } = useAccount();
    const { chain } = useNetwork();
    const [isLoadingTokens, setIsLoadingTokens] = useState(true);
    const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(true);

    const [sendEthToWethModal, setSendEthToWethModal] = useState(false);
    const [sendWethToDaiModal, setSendWethToDaiModal] = useState(false);
    const [depositModal, setDepositModal] = useState(false);

    const [tokenMarketData, setTokenMarketData] = useState([]);
    const [portfolioData, setPortfolioData] = useState([]);

    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
    const lendingPoolAddress = addresses[chainId].LendingPool[0];

    useContractRead({
        address: lendingPoolAddress,
        abi,
        functionName: "getAvailableTokens",
        onSuccess(data) {
            setIsLoadingTokens(false);
            setTokenMarketData(data);
        },
        enabled: isConnected,
    });

    useContractRead({
        address: lendingPoolAddress,
        abi,
        functionName: "getUserBalances",
        args: [address],
        onSuccess(data) {
            setIsLoadingPortfolio(false);
            setPortfolioData(data);
        },
        enabled: isConnected,
    });

    const displayEth = (number) => {
        if (number == undefined) return 0;
        const eth = formatEther(number);
        const val = Math.round(eth * 1e4) / 1e4;
        return val;
    };

    const displayRay = (number) => {
        if (number == undefined) return 0;

        const RAY = 10 ** 27; // 10 to the power 27
        return number / RAY;
    };

    const displayPercent = (number) => {
        if (number == undefined) return 0;

        const percent = number * 100;
        return Math.round(percent * 1e4) / 1e4;
    };

    const calculateAPY = (token) => {
        const RAY = 10 ** 27; // 10 to the power 27
        const SECONDS_PER_YEAR = 31536000;

        const depositAPR = token.liquidityRate / RAY;
        const variableBorrowAPR = token.variableBorrowRate / RAY;
        const stableBorrowAPR = token.stableBorrowRate / RAY;

        const depositAPY = (1 + depositAPR / SECONDS_PER_YEAR) ** SECONDS_PER_YEAR - 1;
        const stableBorrowAPY = (1 + stableBorrowAPR / SECONDS_PER_YEAR) ** SECONDS_PER_YEAR - 1;
        const variableBorrowAPY =
            (1 + variableBorrowAPR / SECONDS_PER_YEAR) ** SECONDS_PER_YEAR - 1;

        return { depositAPY, stableBorrowAPY, variableBorrowAPY };
    };

    return (
        <>
            <div className="container relative mx-auto p-6">
                <TopGradient />
                <Navbar />

                <SendEthToWethDialog
                    isModelOpen={sendEthToWethModal}
                    modelCloseHandler={() => setSendEthToWethModal(false)}
                />

                <SendWethToDaiDialog
                    isModelOpen={sendWethToDaiModal}
                    modelCloseHandler={() => setSendWethToDaiModal(false)}
                />

                <DepositDialog
                    isModelOpen={depositModal}
                    modelCloseHandler={() => setDepositModal(false)}
                />

                <section id="heading">
                    <div className="items-left flex flex-col justify-between rounded border-gray-200 md:mt-6 md:flex-row md:items-center md:border">
                        <h2 className="px-5 pt-5 text-3xl font-semibold md:p-5 md:text-3xl">
                            Dashboard
                        </h2>
                        <div className="flex flex-col space-y-2 space-x-0 px-5 pt-5 md:flex-row md:space-y-0 md:space-x-3 md:p-5">
                            <button
                                className="rounded-full border border-gray-400 bg-white py-2 px-4 font-semibold text-gray-800 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={() => setSendEthToWethModal(!sendEthToWethModal)}
                            >
                                Send Eth to Weth
                            </button>
                            <button
                                className="rounded-full border border-gray-400 bg-white py-2 px-4 font-semibold text-gray-800 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={() => setSendWethToDaiModal(!sendWethToDaiModal)}
                            >
                                Send Weth to DAI
                            </button>
                            <button
                                className="rounded-full border border-gray-400 bg-indigo-500 py-2 px-4 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={() => setDepositModal(!depositModal)}
                            >
                                Deposit ERC20 Tokens
                            </button>
                        </div>
                    </div>
                </section>

                <section id="portfolio">
                    <div className="flex-cols mt-10 flex gap-8 md:flex-row">
                        <table className="w-2/3 text-left text-sm text-gray-800">
                            <thead className="bg-indigo-400 text-xs uppercase text-white">
                                <tr>
                                    <th scope="col" className="py-3 px-6">
                                        Token
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Deposited Balance
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Compounded Balance
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoadingPortfolio && (
                                    <tr>
                                        <td colSpan={5} className="py-4 px-6 font-semibold">
                                            Loading Data ...
                                        </td>
                                    </tr>
                                )}
                                {portfolioData.map((token, index) => {
                                    return (
                                        <tr
                                            key={index}
                                            className="border-b bg-white hover:bg-gray-50"
                                        >
                                            <td className="py-4 px-6">
                                                {token.symbol} - {token.name}
                                            </td>
                                            <td className="py-4 px-6">
                                                {displayEth(token.balance)}
                                            </td>
                                            <td className="py-4 px-6">
                                                {displayEth(token.totalBalance)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <h2 className="text-2xl">Pool Liquidity</h2>
                    </div>
                </section>

                <section id="marketTokens">
                    <div className="relative mt-10 overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-left text-sm text-gray-800">
                            <thead className="bg-indigo-400 text-xs uppercase text-white">
                                <tr>
                                    <th scope="col" className="py-3 px-6">
                                        Token
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        APY
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Stable APY
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Variable APY
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoadingTokens && (
                                    <tr>
                                        <td colSpan={5} className="py-4 px-6 font-semibold">
                                            Loading Tokens ...
                                        </td>
                                    </tr>
                                )}
                                {tokenMarketData.map((token, index) => {
                                    const { depositAPY, stableBorrowAPY, variableBorrowAPY } =
                                        calculateAPY(token);

                                    return (
                                        <tr
                                            key={index}
                                            className="border-b bg-white hover:bg-gray-50"
                                        >
                                            <td className="py-4 px-6">
                                                {token.tokenSymbol} - {token.tokenName}
                                            </td>
                                            <td className="py-4 px-6">
                                                {displayPercent(depositAPY)}
                                            </td>
                                            <td className="py-4 px-6">
                                                {displayPercent(stableBorrowAPY)}
                                            </td>
                                            <td className="py-4 px-6">
                                                {displayPercent(variableBorrowAPY)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <a
                                                    href="#"
                                                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                                                >
                                                    Deposit
                                                </a>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </>
    );
}
