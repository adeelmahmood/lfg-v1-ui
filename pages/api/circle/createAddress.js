import { createAddress } from "./api";

export default async function handler(req, res) {
    try {
        const { id, walletId } = req.body;

        const results = createAddress(id, walletId);
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
