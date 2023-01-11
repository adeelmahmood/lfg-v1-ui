import { useState, useEffect } from "react";
import { useAccount, useContractRead } from "wagmi";
import addresses from "../constants/contract.json";
import abi from "../constants/lendingpool.json";
import DepositDialog from "../components/DepositDialog";
import { calculateAPY, displayPercent, displayUnits } from "../utils/Math";
import ImageWithFallback from "./ImageWithFallback";
import { Switch } from "@headlessui/react";

export default function TokensMarketDataSection({ setTokenMarketDataForCaller }) {
    const { isConnected, address } = useAccount();
    const [isLoading, setIsLoading] = useState(true);

    const [selectedToken, setSelectedToken] = useState(null);
    const [depositModal, setDepositModal] = useState(false);

    const [isShowZeroBalanceTokens, setIsShowZeroBalanceTokens] = useState(false);

    const [tokenMarketData, setTokenMarketData] = useState([]);
    const [filteredTokenMarketData, setFilteredTokenMarketData] = useState([]);

    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
    const lendingPoolAddress = addresses[chainId].LendingPool[0];

    useContractRead({
        address: lendingPoolAddress,
        abi,
        functionName: "getAvailableTokens",
        args: [address],
        onSuccess(data) {
            setIsLoading(false);
            setTokenMarketData(data);
            setTokenMarketDataForCaller(data);
            // set filtered data based on show zero balance flag
            setFilteredTokenMarketData(
                data.filter((token) => isShowZeroBalanceTokens || token.walletBalance > 0)
            );
        },
        onError(err) {
            console.log(window.ethereum);
            console.log("Error in retrieving data from contract", lendingPoolAddress, err);
        },
        enabled: isConnected,
    });

    const showDepositModal = (token) => {
        setSelectedToken(token);
        setDepositModal(!depositModal);
    };

    useEffect(() => {
        setFilteredTokenMarketData(
            tokenMarketData.filter((token) => isShowZeroBalanceTokens || token.walletBalance > 0)
        );
    }, [isShowZeroBalanceTokens]);

    return (
        <>
            <DepositDialog
                isModelOpen={depositModal}
                modelCloseHandler={() => setDepositModal(false)}
                token={selectedToken}
            />

            <h2 className="mt-20 mb-2 text-4xl font-semibold text-slate-700 sm:mt-10 sm:max-w-md md:text-3xl">
                Tokens Available to Supply
            </h2>
            <div className="mb-4 flex items-center">
                <Switch
                    checked={isShowZeroBalanceTokens}
                    onChange={setIsShowZeroBalanceTokens}
                    className={`${
                        isShowZeroBalanceTokens ? "bg-indigo-600" : "bg-gray-200"
                    } h-6 w-8 rounded-full`}
                />
                <div className="ml-2 text-gray-600">Show tokens with zero balance in wallet</div>
            </div>

            <div className="grid grid-cols-1 gap-y-4 sm:hidden">
                {filteredTokenMarketData.map((token, index) => {
                    const { depositAPY, stableBorrowAPY, variableBorrowAPY } = calculateAPY(token);
                    return (
                        <div className="w-full rounded-lg shadow" key={index}>
                            <div className="flex items-center space-x-2 rounded-t-lg bg-gray-100 p-3">
                                <ImageWithFallback
                                    width={32}
                                    height={32}
                                    src={`https://cdn.jsdelivr.net/npm/cryptocurrency-icons@latest/svg/icon/${token.tokenSymbol.toLowerCase()}.svg`}
                                    fallbackSrc="https://cdn.jsdelivr.net/npm/cryptocurrency-icons@latest/svg/icon/generic.svg"
                                />
                                <div className="font-semibold">
                                    {token.tokenSymbol} - {token.tokenName}
                                </div>
                            </div>
                            <div className="mt-2 flex items-center justify-between p-2 px-4">
                                <div>Wallet Balance</div>
                                <div>{displayUnits(token.walletBalance, token.tokenDecimals)}</div>
                            </div>
                            <div className="flex items-center justify-between p-2 px-4">
                                <div>APY</div>
                                <div>{displayPercent(depositAPY)} %</div>
                            </div>
                            <div className="mb-2 flex items-center justify-center p-2 px-4">
                                <a
                                    href="#"
                                    className="rounded-lg border border-gray-400 bg-indigo-500 py-2 px-8 text-white hover:bg-indigo-700 md:font-semibold"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        showDepositModal(token);
                                    }}
                                >
                                    Deposit
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="hidden max-w-4xl overflow-x-auto rounded-lg shadow-md sm:flex">
                <table className="w-full text-left text-sm text-gray-800">
                    <thead className="bg-slate-600 text-xs uppercase text-white">
                        <tr>
                            <th scope="col" className="py-3 px-6">
                                Token
                            </th>
                            <th scope="col" className="border-l py-3 px-6 text-center">
                                Wallet Balance
                            </th>
                            <th scope="col" className="border-l py-3 px-6 text-center">
                                APY
                            </th>
                            <th scope="col" className="border-l py-3 px-6 text-center">
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
                        {filteredTokenMarketData.map((token, index) => {
                            const { depositAPY, stableBorrowAPY, variableBorrowAPY } =
                                calculateAPY(token);

                            return (
                                <tr key={index} className="border-b bg-white hover:bg-gray-50">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center space-x-2">
                                            <ImageWithFallback
                                                width={25}
                                                height={25}
                                                src={`https://cdn.jsdelivr.net/npm/cryptocurrency-icons@latest/svg/icon/${token.tokenSymbol.toLowerCase()}.svg`}
                                                fallbackSrc="https://cdn.jsdelivr.net/npm/cryptocurrency-icons@latest/svg/icon/generic.svg"
                                                altText={token.tokenSymbol}
                                            />
                                            <div>
                                                {token.tokenSymbol} - {token.tokenName}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        {displayUnits(token.walletBalance, token.tokenDecimals)}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        {displayPercent(depositAPY)} %
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <a
                                            href="#"
                                            className="rounded-lg border border-gray-400 bg-indigo-500 py-2 px-4 text-white hover:bg-indigo-700 md:font-semibold"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                showDepositModal(token);
                                            }}
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
