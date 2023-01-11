export const addTokenToMetaMask = async (token) => {
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
