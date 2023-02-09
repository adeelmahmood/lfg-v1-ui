import Navbar from "../components/Navbar";
import TopGradient from "../components/TopGradient";
import BottomGradient from "../components/BottomGradient";

import { useState } from "react";
import SendEthToWethDialog from "../components/lender/SendEthToWethDialog";
import SendWethToDaiDialog from "../components/lender/SendWethToDaiDialog";
import PortfolioSection from "../components/lender/PortfolioSection";
import TokensMarketDataSection from "../components/lender/TokensMarketDataSection";

export default function Dashboard() {
    const [sendEthToWethModal, setSendEthToWethModal] = useState(false);
    const [sendWethToDaiModal, setSendWethToDaiModal] = useState(false);

    const [tokenMarketDataForCaller, setTokenMarketDataForCaller] = useState([]);

    const TEST_ENV = process.env.NEXT_PUBLIC_TEST_ENV;

    return (
        <>
            <TopGradient />
            <Navbar />

            <div className="container mx-auto p-6">
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

                <div className="mt-8 mb-4 flex items-center justify-between">
                    <h2 className="max-w-6xl text-5xl font-bold tracking-wider text-white">
                        <span className="bg-gradient-to-r from-indigo-500 to-green-600 bg-clip-text text-transparent">
                            Lender Dashboard
                        </span>
                    </h2>

                    {TEST_ENV == "true" && (
                        <div className="hidden space-x-2 sm:flex sm:justify-end">
                            <button
                                className="btn-clear"
                                onClick={() => setSendEthToWethModal(!sendEthToWethModal)}
                            >
                                Send Eth to Weth
                            </button>
                            <button
                                className="btn-clear"
                                onClick={() => setSendWethToDaiModal(!sendWethToDaiModal)}
                            >
                                Swap Tokens
                            </button>
                        </div>
                    )}
                </div>

                <p className="mt-2 max-w-3xl text-left leading-8 text-gray-600 dark:text-gray-300">
                    Here you can deposit tokens and earn interest. Later on we will add some way to
                    show open proposals or it might be on another page. Either way, you should be
                    able to do all the lender stuff here. Some other things might go here. Another
                    one and another one.
                </p>

                <section id="portfolio">
                    <div className="items-left mt-10 mb-20 flex flex-col gap-8 md:mt-6 md:flex-row md:items-start">
                        <PortfolioSection />
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
