import { createPayout } from "./api";

export default async function handler(req, res) {
    try {
        const { id, walletId, destinationId, amount } = req.body;

        const results = await createPayout(id, walletId, destinationId, amount);
        if (results?.data) {
            res.status(200).json(results);
        } else {
            res.status(500).json({ error: results.message });
        }
    } catch (e) {
        console.log("unable to create circle payout", e);
        res.status(500).json({ error: e.message });
    }
}
