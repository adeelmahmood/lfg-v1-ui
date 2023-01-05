import { useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import addresses from "../constants/contract.json";
import abi from "../constants/lendingpool.json";
import { formatEther, formatUnits } from "ethers/lib/utils.js";
import { display1e4, displayUnits } from "../utils/Math";

export default function PoolLiquiditySection() {
    const { isConnected, address } = useAccount();
    const [isLoading, setIsLoading] = useState(true);

    const [liquidityData, setLiquidityData] = useState([]);

    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
    const lendingPoolAddress = addresses[chainId].LendingPool[0];

    useContractRead({
        address: lendingPoolAddress,
        abi,
        functionName: "getLiquidity",
        onSuccess(data) {
            setIsLoading(false);
            setLiquidityData(data);
        },
        enabled: isConnected,
    });

    return (
        <>
            <div className="mx-auto w-full rounded-lg bg-gray-300/20 shadow-md md:w-1/3">
                <h2 className="rounded-t-lg bg-slate-600 p-2 px-4 font-semibold text-white">
                    Pool Liquidity
                </h2>
                <div className="flex items-center justify-between p-2 px-4 ">
                    <div>Total Collateral</div>
                    <div>{displayUnits(liquidityData.totalCollateral)} ETH</div>
                </div>
                <div className="flex items-center justify-between p-2 px-4 ">
                    <div>Total Debt</div>
                    <div>{displayUnits(liquidityData.totalDebt)} ETH</div>
                </div>
                <div className="flex items-center justify-between p-2 px-4 ">
                    <div>Availabe to Borrow</div>
                    <div>{displayUnits(liquidityData.availableToBorrow)} ETH</div>
                </div>
                <div className="flex items-center justify-between p-2 px-4 ">
                    <div>Loan to Value</div>
                    <div>{display1e4(liquidityData.loanToValue)} %</div>
                </div>
            </div>
        </>
    );
}
