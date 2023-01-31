import { useState } from "react";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import addresses from "../../constants/contract.json";
import abi from "../../constants/lendingpool.json";
import { displayUnits } from "../../utils/Math";
import WithdrawDialog from "./WithdrawDialog";
import ImageWithFallback from "../ImageWithFallback";

export default function PortfolioSection() {
    const { isConnected, address } = useAccount();
    const [isLoading, setIsLoading] = useState(true);

    const [selectedToken, setSelectedToken] = useState(null);
    const [withdrawModal, setWithdrawModal] = useState(false);

    const [portfolioData, setPortfolioData] = useState([]);

    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
    const lendingPoolAddress = addresses[chainId].LendingPool[0];

    useContractRead({
        address: lendingPoolAddress,
        abi,
        functionName: "getDeposits",
        args: [address],
        onSuccess(data) {
            setIsLoading(false);
            setPortfolioData(data);
        },
        onError(err) {
            console.log(err);
        },
        enabled: isConnected,
    });

    const showWithdrawModal = (token) => {
        setSelectedToken(token);
        setWithdrawModal(!withdrawModal);
    };

    return (
        <>
            <WithdrawDialog
                isModelOpen={withdrawModal}
                modelCloseHandler={() => setWithdrawModal(false)}
                token={selectedToken}
            />

            <div className="grid grid-cols-1 gap-y-4 sm:hidden">
                <h2 className="rounded-t-lg bg-gray-800 py-4 px-4 font-semibold uppercase tracking-wider text-gray-200 dark:bg-green-700 dark:text-gray-200">
                    Your Deposits
                </h2>
                {portfolioData.map((token, index) => {
                    return (
                        <div className="w-full rounded-lg shadow dark:bg-gray-800" key={index}>
                            <div className="flex items-center space-x-2 rounded-t-lg bg-gray-100 p-3 dark:bg-gray-700">
                                <ImageWithFallback
                                    width={32}
                                    height={32}
                                    src={`https://cdn.jsdelivr.net/npm/cryptocurrency-icons@latest/svg/icon/${token.symbol.toLowerCase()}.svg`}
                                    fallbackSrc="https://cdn.jsdelivr.net/npm/cryptocurrency-icons@latest/svg/icon/generic.svg"
                                />
                                <div className="font-semibold">
                                    {token.symbol} - {token.name}
                                </div>
                            </div>
                            <div className="mt-2 flex items-center justify-between p-2 px-4">
                                <div>Deposited Balance</div>
                                <div>{displayUnits(token.balance, token.decimals)}</div>
                            </div>
                            <div className="flex items-center justify-between p-2 px-4">
                                <div>Compounded Balance</div>
                                <div>{displayUnits(token.totalBalance, token.decimals)}</div>
                            </div>
                            <div className="mb-2 flex items-center justify-start p-2 px-4">
                                <a
                                    href="#"
                                    className="rounded-lg border border-gray-400 bg-white py-2 px-4 text-gray-800 shadow hover:bg-gray-100 md:font-semibold"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        showWithdrawModal(token);
                                    }}
                                >
                                    Withdraw
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="hidden w-full overflow-x-auto rounded-lg shadow-md sm:flex md:w-2/3">
                <table className="w-full table-auto text-left text-sm text-gray-800">
                    <thead className="bg-gray-800 text-xs uppercase tracking-wider text-gray-200 dark:bg-gray-500">
                        <tr>
                            <th scope="col" className="py-3 px-6">
                                Your Deposits
                            </th>
                            <th scope="col" className="py-3 px-6 text-center">
                                Deposited Balance
                            </th>
                            <th scope="col" className="py-3 px-6 text-center">
                                Compounded Balance
                            </th>
                            <th scope="col" className="py-3 px-6 text-center">
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
                                <tr
                                    key={index}
                                    className="border-t border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600"
                                >
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex items-center space-x-2 dark:text-gray-200">
                                            <ImageWithFallback
                                                width={25}
                                                height={25}
                                                src={`https://cdn.jsdelivr.net/npm/cryptocurrency-icons@latest/svg/icon/${token.symbol.toLowerCase()}.svg`}
                                                fallbackSrc="https://cdn.jsdelivr.net/npm/cryptocurrency-icons@latest/svg/icon/generic.svg"
                                            />
                                            <div>
                                                {token.symbol} - {token.name}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center dark:text-gray-200">
                                        {displayUnits(token.balance, token.decimals)}
                                    </td>
                                    <td className="py-4 px-6 text-center dark:text-gray-200">
                                        {displayUnits(token.totalBalance, token.decimals)}
                                    </td>
                                    <td className="py-4 px-6 text-center dark:text-gray-200">
                                        <a
                                            href="#"
                                            className="rounded-lg border border-gray-400 bg-white py-2 px-4 text-gray-800 hover:bg-gray-100 md:font-semibold"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                showWithdrawModal(token);
                                            }}
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
