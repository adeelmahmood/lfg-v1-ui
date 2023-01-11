import { useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import addresses from "../constants/contract.json";
import abi from "../constants/lendingpool.json";
import DepositDialog from "../components/DepositDialog";
import { calculateAPY, displayPercent, displayUnits } from "../utils/Math";
import ImageWithFallback from "./ImageWithFallback";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

export default function TokensMarketDataSection({ setTokenMarketDataForCaller }) {
    const { isConnected, address } = useAccount();
    const [isLoading, setIsLoading] = useState(true);

    const [selectedToken, setSelectedToken] = useState(null);
    const [depositModal, setDepositModal] = useState(false);

    const [allowAddTokensToMM, setAllowAddTokensToMM] = useState(false);

    const [tokenMarketData, setTokenMarketData] = useState([]);

    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
    const lendingPoolAddress = addresses[chainId].LendingPool[0];

    const addTokenToMetaMask = async (token) => {
        if (!allowAddTokensToMM || !window.ethereum) return;

        try {
            const wasAdded = await window.ethereum?.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20", // Initially only supports ERC20, but eventually more!
                    options: {
                        address: token?.token, // The address that the token is at.
                        symbol: token?.tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                        decimals: token?.tokenDecimals?.toNumber(), // The number of decimals in the token
                        //   image: tokenImage, // A string url of the token logo
                    },
                },
            });

            if (wasAdded) {
                console.log("Token added");
            } else {
                console.log("Not added!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useContractRead({
        address: lendingPoolAddress,
        abi,
        functionName: "getAvailableTokens",
        args: [address],
        onSuccess(data) {
            setIsLoading(false);
            setTokenMarketData(data);
            setTokenMarketDataForCaller(data);
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

    return (
        <>
            <DepositDialog
                isModelOpen={depositModal}
                modelCloseHandler={() => setDepositModal(false)}
                token={selectedToken}
            />

            <h2 className="mt-10 mb-5 text-4xl font-semibold text-slate-700 sm:max-w-md md:text-3xl">
                Tokens Available to Supply
            </h2>
            <div className="max-w-4xl overflow-x-auto rounded-lg shadow-md">
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
                        {tokenMarketData.map((token, index) => {
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
                                                <a
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        addTokenToMetaMask(token);
                                                    }}
                                                >
                                                    {allowAddTokensToMM && (
                                                        <ChevronUpIcon className="mb-2 inline h-4 pl-2" />
                                                    )}
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        {displayUnits(token.walletBalance, token.tokenDecimals)}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        {displayPercent(depositAPY)}
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
            <div className="mt-8 p-2">
                <button
                    className="rounded-lg border border-gray-400 bg-white py-2 px-4 text-gray-800 hover:bg-gray-100 md:font-semibold"
                    onClick={() => setAllowAddTokensToMM(!allowAddTokensToMM)}
                >
                    Add Tokens to MetaMask
                </button>
            </div>
        </>
    );
}
