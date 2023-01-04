import { useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import addresses from "../constants/contract.json";
import abi from "../constants/lendingpool.json";
import DepositDialog from "../components/DepositDialog";

export default function TokensMarketDataSection({ setTokenMarketDataForCaller }) {
    const { isConnected, address } = useAccount();
    const [isLoading, setIsLoading] = useState(true);

    const [selectedToken, setSelectedToken] = useState(null);
    const [depositModal, setDepositModal] = useState(false);

    const [tokenMarketData, setTokenMarketData] = useState([]);

    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
    const lendingPoolAddress = addresses[chainId].LendingPool[0];

    useContractRead({
        address: lendingPoolAddress,
        abi,
        functionName: "getAvailableTokens",
        onSuccess(data) {
            setIsLoading(false);
            setTokenMarketData(data);
            setTokenMarketDataForCaller(data);
            console.log(tokenMarketData);
        },
        enabled: isConnected,
    });

    const showDepositModal = (token) => {
        setSelectedToken(token);
        setDepositModal(!depositModal);
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
            <DepositDialog
                isModelOpen={depositModal}
                modelCloseHandler={() => setDepositModal(false)}
                token={selectedToken}
            />

            <div className="mt-10 w-full overflow-x-auto rounded-lg shadow-md">
                <table className="w-full text-left text-sm text-gray-800">
                    <thead className="bg-slate-600 text-xs uppercase text-white">
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
                        {isLoading && (
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
                                <tr key={index} className="border-b bg-white hover:bg-gray-50">
                                    <td className="py-4 px-6">
                                        {token.tokenSymbol} - {token.tokenName}
                                    </td>
                                    <td className="py-4 px-6">{displayPercent(depositAPY)}</td>
                                    <td className="py-4 px-6">{displayPercent(stableBorrowAPY)}</td>
                                    <td className="py-4 px-6">
                                        {displayPercent(variableBorrowAPY)}
                                    </td>
                                    <td className="py-4 px-6">
                                        <a
                                            href="#"
                                            className="rounded-lg border border-gray-400 bg-indigo-500 py-2 px-4 text-white hover:bg-indigo-700 md:font-semibold"
                                            onClick={() => showDepositModal(token)}
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
        </>
    );
}
