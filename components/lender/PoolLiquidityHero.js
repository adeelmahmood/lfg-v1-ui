import { useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import addresses from "../../constants/contract.json";
import abi from "../../constants/lendingpool.json";
import { display1e4, displayUnits } from "../../utils/Math";

export default function PoolLiquidityHero() {
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
        onError(err) {
            console.log(err);
        },
        enabled: isConnected,
    });

    return (
        <>
            <div className="mt-4 flex w-full flex-col items-center space-y-4 rounded-2xl px-4 py-2 shadow-lg md:flex-row md:items-start md:justify-between md:space-y-0 md:space-x-4">
                <div className="text-center text-gray-600">
                    <div className="text-3xl font-bold tracking-wide">
                        {displayUnits(liquidityData.totalCollateral)} ETH
                    </div>
                    <h2 className="text-2xl tracking-tight">Deposited Collateral</h2>
                </div>

                <div className="text-center text-gray-600">
                    <div className="text-3xl font-bold tracking-wide">
                        {displayUnits(liquidityData.availableToBorrow)} ETH
                    </div>
                    <div className="text-2xl tracking-tight">Availabe to Borrow</div>
                </div>
                <div className="text-center text-gray-600">
                    <div className="text-3xl font-bold tracking-wide">
                        {displayUnits(liquidityData.totalDebt)} ETH
                    </div>
                    <div className="text-2xl tracking-tight">Total Debt</div>
                </div>
            </div>
        </>
    );
}
