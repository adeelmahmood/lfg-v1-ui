export const getCircleTransactionLink = (chainId, hash) => {
    switch (chainId) {
        case "80001":
            return `https://mumbai.polygonscan.com/tx/${hash}`;
        default:
            return null;
    }
};
