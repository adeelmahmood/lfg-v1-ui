import { createAddress, createWallet } from "./api";

export default async function handler(req, res) {
    try {
        const { id } = req.body;

        const walletResults = await createWallet(id);
        if (walletResults?.data) {
            const addressResults = await createAddress(id, walletResults.data.walletId);
            if (addressResults?.data) {
                res.status(200).json({
                    wallet: { ...walletResults.data },
                    address: { ...addressResults.data },
                });
            } else {
                res.status(500).json({ error: addressResults.message });
            }
        } else {
            res.status(500).json({ error: walletResults.message });
        }
    } catch (e) {
        console.log("unable to create circle wallet and address", e);
        res.status(500).json({ error: e.message });
    }
}
