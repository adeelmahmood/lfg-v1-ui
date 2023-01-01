import { useAccount, useNetwork } from "wagmi";

export default function Tokens() {
    const { isConnected, address } = useAccount();
    const { chain } = useNetwork();
    const [tokens, setTokens] = useState([]);

    const chainId = "0x1";

    async function getTokenBalance() {
        const result = await fetch(
            "/api/tokenBalances?" +
                new URLSearchParams({
                    address: address,
                    chain: chainId,
                })
        );
        const data = await result.json();

        for (let i = 0; i < data.length; i++) {
            data[i].bal = (
                Number(data[i].balance) / Number(`1E${data[i].decimals}`).toFixed(4)
            ).toFixed(4);
        }

        setTokens(data);
    }

    return (
        <>
            <h3>Tokens</h3>
            <button onClick={getTokenBalance}>Get Tokens Balance</button>
            <br />
            {tokens.length > 0 &&
                tokens.map((t) => {
                    return (
                        <>
                            <div>
                                {t.symbol} {t.balance} == {t.bal} ({t.decimals})
                            </div>
                        </>
                    );
                })}
        </>
    );
}
