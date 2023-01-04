import { useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import addresses from "../constants/contract.json";
import abi from "../constants/lendingpool.json";
import { formatEther } from "ethers/lib/utils.js";

export default function PortfolioSection() {
    const { isConnected, address } = useAccount();
    const [isLoading, setIsLoading] = useState(true);

    const [portfolioData, setPortfolioData] = useState([]);

    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
    const lendingPoolAddress = addresses[chainId].LendingPool[0];

    useContractRead({
        address: lendingPoolAddress,
        abi,
        functionName: "getUserBalances",
        args: [address],
        onSuccess(data) {
            setIsLoading(false);
            setPortfolioData(data);
        },
        enabled: isConnected,
    });

    const displayEth = (number) => {
        if (number == undefined) return 0;
        const eth = formatEther(number);
        const val = Math.round(eth * 1e6) / 1e6;
        return val;
    };

    return (
        <>
            <div className="w-full overflow-x-auto rounded-lg shadow-md md:w-2/3">
                <table className="w-full text-left text-sm text-gray-800">
                    <thead className="bg-slate-600 text-xs uppercase text-white">
                        <tr>
                            <th scope="col" className="py-3 px-6">
                                Your Deposits
                            </th>
                            <th scope="col" className="py-3 px-6">
                                Deposited Balance
                            </th>
                            <th scope="col" className="py-3 px-6">
                                Compounded Balance
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
                                    Loading Data ...
                                </td>
                            </tr>
                        )}
                        {!isLoading && portfolioData.length == 0 && (
                            <tr>
                                <td colSpan={5} className="py-4 px-6 font-semibold">
                                    No Deposits Yet
                                </td>
                            </tr>
                        )}
                        {portfolioData.map((token, index) => {
                            return (
                                <tr key={index} className="border-b bg-white hover:bg-gray-50">
                                    <td className="py-4 px-6">
                                        {token.symbol} - {token.name}
                                    </td>
                                    <td className="py-4 px-6">{displayEth(token.balance)}</td>
                                    <td className="py-4 px-6">{displayEth(token.totalBalance)}</td>
                                    <td className="py-4 px-6">
                                        <a
                                            href="#"
                                            className="rounded-lg border border-gray-400 bg-white py-2 px-4 text-gray-800 hover:bg-gray-100 md:font-semibold"
                                        >
                                            Withdraw
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
