export const addTokenToMetaMask = async (token) => {
    if (!window.ethereum) return;

    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
            params: [],
        });
        const wasAdded = await window.ethereum?.request({
            method: "wallet_watchAsset",
            params: {
                type: "ERC20", // Initially only supports ERC20, but eventually more!
                options: {
                    address: token?.token, // The address that the token is at.
                    symbol: token?.tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                    decimals: token?.tokenDecimals?.toNumber?.() || token?.tokenDecimals || 18, // The number of decimals in the token
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
