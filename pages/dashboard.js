import Navbar from "../components/Navbar";
import TopGradient from "../components/TopGradient";
import BottomGradient from "../components/BottomGradient";

import { useState } from "react";
import SendEthToWethDialog from "../components/SendEthToWethDialog";
import SendWethToDaiDialog from "../components/SendWethToDaiDialog";
import DepositDialog from "../components/DepositDialog";
import PortfolioSection from "../components/PortfolioSection";
import TokensMarketDataSection from "../components/TokensMarketDataSection";
import PoolLiquiditySection from "../components/PoolLiquiditySection";

export default function Dashboard() {
    const [sendEthToWethModal, setSendEthToWethModal] = useState(false);
    const [sendWethToDaiModal, setSendWethToDaiModal] = useState(false);
    const [depositModal, setDepositModal] = useState(false);

    const [tokenMarketDataForCaller, setTokenMarketDataForCaller] = useState([]);

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
                    tokenMarketDataForCaller={tokenMarketDataForCaller}
                />

                <DepositDialog
                    isModelOpen={depositModal}
                    modelCloseHandler={() => setDepositModal(false)}
                />

                <section id="heading">
                    <div className="mt-5 flex items-center justify-between sm:items-end md:flex-row md:items-center">
                        <h2 className="text-4xl font-semibold sm:max-w-md md:p-5 md:px-5 md:pt-5 md:text-3xl">
                            Dashboard
                        </h2>
                        <div className="hidden space-y-2 space-x-0 sm:flex sm:flex-col md:flex-row md:space-y-0 md:space-x-3 md:p-5 md:px-5">
                            <button
                                className="rounded-lg border border-gray-400 bg-white py-2 px-4 text-gray-800 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 md:rounded-full md:font-semibold"
                                onClick={() => setSendEthToWethModal(!sendEthToWethModal)}
                            >
                                Send Eth to Weth
                            </button>
                            <button
                                className="rounded-lg border border-gray-400 bg-white py-2 px-4 text-gray-800 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 md:rounded-full md:font-semibold"
                                onClick={() => setSendWethToDaiModal(!sendWethToDaiModal)}
                            >
                                Swap Tokens
                            </button>
                        </div>
                    </div>
                </section>

                <section id="portfolio">
                    <div className="items-left mt-10 flex flex-col gap-8 md:mt-6 md:flex-row md:items-start">
                        <PortfolioSection />
                        <PoolLiquiditySection />
                    </div>
                </section>

                <section id="tokensMarketData">
                    <TokensMarketDataSection
                        setTokenMarketDataForCaller={setTokenMarketDataForCaller}
                    />
                </section>

                <BottomGradient />
            </div>
        </>
    );
}
