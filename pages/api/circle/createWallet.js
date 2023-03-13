const apiUrl = process.env.CIRCLE_API_URL;
const apiKey = process.env.CIRCLE_API_KEY;
const masterWalletAddress = process.env.CIRCLE_MASTER_WALLET;
const chain = process.env.NEXT_PUBLIC_CHAIN_ID === "80001" ? "MATIC" : "ETH";

export default async function handler(req, res) {
    try {
        const { id } = req.body;
        const currency = "USD";

        const response = await fetch(`${apiUrl}/wallets/${masterWalletAddress}/addresses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                idempotencyKey: id,
                chain,
                currency,
            }),
        });

        const results = await response.json();
        if (results?.data) {
            res.status(200).json(results);
        } else {
            res.status(500).json({ error: results.message });
        }
    } catch (e) {
        console.log("unable to create circle wallet address", e);
        res.status(500).json({ error: e.message });
    }
}
