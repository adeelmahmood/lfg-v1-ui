const apiUrl = process.env.CIRCLE_API_URL;
const apiKey = process.env.CIRCLE_API_KEY;
const chain = process.env.NEXT_PUBLIC_CHAIN_ID === "80001" ? "MATIC" : "ETH";

const SAMPLE_WIRE = "44746bf2-67f6-4dad-a4fd-f8862e448e81";

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

export const getBankAccountById = async (id = SAMPLE_WIRE) => {
    const response = await fetch(`${apiUrl}/banks/wires/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
    });

    const results = await response.json();
    return results;
};

export const createPayout = async (idempotencyKey, walletId, destinationId, amount) => {
    const response = await fetch(`${apiUrl}/payouts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            source: {
                type: "wallet",
                id: walletId,
            },
            destination: {
                type: "wire",
                id: destinationId,
            },
            amount: {
                currency: "USD",
                amount: amount,
            },
            metadata: {
                beneficiaryEmail: "adeelmahmood@gmail.com",
            },
            idempotencyKey,
        }),
    });
    const results = await response.json();
    return results;
};

export const getPayout = async (id) => {
    const response = await fetch(`${apiUrl}/payouts/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
    });

    const results = await response.json();
    return results;
};
