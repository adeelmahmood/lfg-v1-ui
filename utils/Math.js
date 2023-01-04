import { formatEther, formatUnits } from "ethers/lib/utils.js";

export const displayRay = (number) => {
    if (number == undefined) return 0;

    const RAY = 10 ** 27; // 10 to the power 27
    return number / RAY;
};

export const displayPercent = (number) => {
    if (number == undefined) return 0;

    const percent = number * 100;
    return Math.round(percent * 1e4) / 1e4;
};

export const displayEth = (number) => {
    if (number == undefined) return 0;
    const eth = formatEther(number);
    const val = Math.round(eth * 1e4) / 1e4;
    return val;
};

export const calculateAPY = (token) => {
    const RAY = 10 ** 27; // 10 to the power 27
    const SECONDS_PER_YEAR = 31536000;

    const depositAPR = token.liquidityRate / RAY;
    const variableBorrowAPR = token.variableBorrowRate / RAY;
    const stableBorrowAPR = token.stableBorrowRate / RAY;

    const depositAPY = (1 + depositAPR / SECONDS_PER_YEAR) ** SECONDS_PER_YEAR - 1;
    const stableBorrowAPY = (1 + stableBorrowAPR / SECONDS_PER_YEAR) ** SECONDS_PER_YEAR - 1;
    const variableBorrowAPY = (1 + variableBorrowAPR / SECONDS_PER_YEAR) ** SECONDS_PER_YEAR - 1;

    return { depositAPY, stableBorrowAPY, variableBorrowAPY };
};

export const display1e4 = (number) => {
    if (number == undefined) return 0;
    const val = Math.round(number * 1e4) / 1e4;
    return val / 100;
};
