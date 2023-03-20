import { listTransfers } from "./api";

export default async function handler(req, res) {
    try {
        const { walletId } = req.body;
        console.log(walletId);

        const results = await listTransfers(walletId);

        if (results?.data) {
            console.log(results);
            res.status(200).json(results);
        } else {
            res.status(500).json({ error: results.message });
        }
    } catch (e) {
        console.log("unable to list circle transfers", e);
        res.status(500).json({ error: e.message });
    }
}
