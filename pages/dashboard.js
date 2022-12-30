import Link from "next/link";
import Navbar from "../components/Navbar";
import TopGradient from "../components/TopGradient";
import BottomGradient from "../components/BottomGradient";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import SwapEthToWeth from "../components/SwapEthToWeth";
import SwapWethToDAI from "../components/SwapWethToDAI";
import Deposit from "../components/Deposit";
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
    const { isConnected } = useAccount();
    const { chain } = useNetwork();

    const [liqduitityResult, setLiquidityResult] = useState({});
    const [sendEthToWethModal, setSendEthToWethModal] = useState(false);
    const [sendWethToDaiModal, setSendWethToDaiModal] = useState(false);
    const [depositModal, setDepositModal] = useState(false);

    useEffect(() => {
        const lendingPoolAddress = addresses[chain?.id].LendingPool[0];
    }, []);

    // useContractRead({
    //     address: lendingPoolAddress,
    //     abi,
    //     functionName: "getAvailableTokens",
    //     onSuccess(data) {
    //         console.log(data);
    //     },
    //     enabled: isConnected,
    // });

    const displayEth = (number) => {
        if (number == undefined) return 0;
        const eth = formatEther(number);
        const val = Math.round(eth * 1e4) / 1e4;
        return val;
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

                {/* <SwapEthToWeth />
                <SwapWethToDAI />
                <Deposit /> */}
                <section id="poolLiquidity">
                    <div className="mx-auto mt-10 flex w-full flex-col border border-indigo-500 p-5 shadow md:flex-row md:rounded-full">
                        <div className="bg-indigo-300 p-4 font-bold tracking-tight">
                            Pool Liquidity
                        </div>
                        <div className="bg-indigo-300 p-4 font-bold tracking-tight">
                            Total Collateral {displayEth(liqduitityResult.totalCollateral)} Eth
                        </div>
                        <div className="bg-indigo-300 p-4 font-bold tracking-tight">Total Debt</div>
                        <div className="bg-indigo-300 p-4 font-bold tracking-tight">
                            Available to Borrow {displayEth(liqduitityResult.availableToBorrow)}
                        </div>
                        <div className="bg-indigo-300 p-4 font-bold tracking-tight">
                            Loan to Value {String(liqduitityResult.loanToValue)}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
