import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import Head from "next/head";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { mainnet, polygon, optimism, arbitrum, hardhat, goerli } from "wagmi/chains";

const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
const chainsToUse = [hardhat, goerli, mainnet];
const chainToUse = chainsToUse.filter((chain) => chain.id == chainId);
console.log(chainToUse);

const { chains, provider } = configureChains(chainToUse, [publicProvider()]);
const { connectors } = getDefaultWallets({
    appName: "Lend for Good",
    chains,
});
const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>LFG</title>
                <meta name="description" content="LFG" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider chains={chains}>
                    <Component {...pageProps} />
                </RainbowKitProvider>
            </WagmiConfig>
        </>
    );
}
