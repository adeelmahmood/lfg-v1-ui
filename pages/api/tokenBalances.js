const Moralis = require("moralis").default;

export default async function handler(req, res) {
    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

    const { address, chain } = req.query;

    try {
        const response = await Moralis.EvmApi.token.getWalletTokenBalances({
            address: address,
            chain: chain,
        });

        let tokens = response.data;

        if (chain === "0x1") {
            for (let i = 0; i < tokens.length; i++) {
                const price = await Moralis.EvmApi.token.getTokenPrice({
                    address: tokens[i].token_address,
                    chain: chain,
                });
                console.log(price.data);
            }
        }

        res.status(200).json(tokens);
    } catch (e) {
        res.send(e.message);
    }
}
