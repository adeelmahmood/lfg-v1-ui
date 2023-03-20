const apiUrl = process.env.CIRCLE_API_URL;
const apiKey = process.env.CIRCLE_API_KEY;
const chain = process.env.NEXT_PUBLIC_CHAIN_ID === "80001" ? "MATIC" : "ETH";

export const createWallet = async (idempotencyKey) => {
    const response = await fetch(`${apiUrl}/wallets`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            idempotencyKey,
        }),
    });

    const results = await response.json();
    return results;
};

export const createAddress = async (idempotencyKey, walletId) => {
    const currency = "USD";

    const response = await fetch(`${apiUrl}/wallets/${walletId}/addresses`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            idempotencyKey,
            chain,
            currency,
        }),
    });

    const results = await response.json();
    return results;
};
export const listTransfers = async (walletId, returnIdentities = false) => {
    const response = await fetch(
        `${apiUrl}/transfers?walletId=${walletId}&returnIdentities=${returnIdentities}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
        }
    );

    const results = await response.json();
    return results;
};
