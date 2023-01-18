import Navbar from "../components/Navbar";
import TopGradient from "../components/TopGradient";
import BottomGradient from "../components/BottomGradient";

import { useState } from "react";
import SendEthToWethDialog from "../components/lender/SendEthToWethDialog";
import SendWethToDaiDialog from "../components/lender/SendWethToDaiDialog";
import DepositDialog from "../components/lender/DepositDialog";
import PortfolioSection from "../components/lender/PortfolioSection";
import TokensMarketDataSection from "../components/lender/TokensMarketDataSection";
import PoolLiquiditySection from "../components/lender/PoolLiquiditySection";

export default function Dashboard() {
    const [sendEthToWethModal, setSendEthToWethModal] = useState(false);
    const [sendWethToDaiModal, setSendWethToDaiModal] = useState(false);
    const [depositModal, setDepositModal] = useState(false);

    const [tokenMarketDataForCaller, setTokenMarketDataForCaller] = useState([]);

    const TEST_ENV = process.env.NEXT_PUBLIC_TEST_ENV;

    return (
        <>
            <div className="relative mx-auto p-6 lg:container">
                <TopGradient />
                <Navbar />

                {TEST_ENV == "true" && (
                    <SendEthToWethDialog
                        isModelOpen={sendEthToWethModal}
                        modelCloseHandler={() => setSendEthToWethModal(false)}
                    />
                )}

                {TEST_ENV == "true" && (
                    <SendWethToDaiDialog
                        isModelOpen={sendWethToDaiModal}
                        modelCloseHandler={() => setSendWethToDaiModal(false)}
                        tokenMarketDataForCaller={tokenMarketDataForCaller}
                    />
                )}

                <DepositDialog
                    isModelOpen={depositModal}
                    modelCloseHandler={() => setDepositModal(false)}
                />

                <section id="heading">
                    <div className="mt-5 flex items-center justify-between p-5 shadow sm:items-end md:flex-row md:items-center">
                        <h2 className="px-5 text-4xl font-semibold sm:max-w-md md:text-3xl">
                            Dashboard
                        </h2>
                        {TEST_ENV == "true" && (
                            <div className="hidden space-y-2 space-x-0 sm:flex sm:flex-row sm:space-y-0 sm:space-x-3">
                                <button
                                    className="rounded-lg border border-gray-400 bg-white py-2 px-4 text-gray-800 hover:bg-gray-100 md:font-semibold"
                                    onClick={() => setSendEthToWethModal(!sendEthToWethModal)}
                                >
                                    Send Eth to Weth
                                </button>
                                <button
                                    className="rounded-lg border border-gray-400 bg-white py-2 px-4 text-gray-800 hover:bg-gray-100 md:font-semibold"
                                    onClick={() => setSendWethToDaiModal(!sendWethToDaiModal)}
                                >
                                    Swap Tokens
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                <section id="portfolio">
                    <h2 className="mt-10 mb-5 text-4xl font-semibold text-slate-700 sm:max-w-md md:mt-5 md:text-3xl">
                        Your Deposits
                    </h2>
                    <div className="items-left flex flex-col gap-8 md:mt-6 md:flex-row md:items-start">
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
