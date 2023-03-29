import { createWallet } from "./api";

export default async function handler(req, res) {
    try {
        const { id, description } = req.body;

        const results = await createWallet(id, description);
        if (results?.data) {
            res.status(200).json(results);
        } else {
            res.status(500).json({ error: results.message });
        }
    } catch (e) {
        console.log("unable to create circle wallet", e);
        res.status(500).json({ error: e.message });
    }
}
