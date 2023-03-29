import { getBankAccountById, listTransfers } from "./api";

export default async function handler(req, res) {
    try {
        const results = await getBankAccountById();

        if (results?.data) {
            res.status(200).json(results);
        } else {
            res.status(500).json({ error: results.message });
        }
    } catch (e) {
        console.log("unable to get circle bank account for wire transfer", e);
        res.status(500).json({ error: e.message });
    }
}
