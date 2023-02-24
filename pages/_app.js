import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import Head from "next/head";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { mainnet, polygon, optimism, arbitrum, hardhat, goerli } from "wagmi/chains";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { ThemeProvider } from "next-themes";

const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
const chainsToUse = [hardhat, goerli, mainnet];
const chainToUse = chainsToUse.filter((chain) => chain.id == chainId);

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

const { chains, provider } = configureChains(chainToUse, [
    alchemyProvider({ apiKey: ALCHEMY_API_KEY }),
    publicProvider(),
]);
const { connectors } = getDefaultWallets({
    appName: "XYZ Lending Marketplace",
    chains,
});
const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});

export default function App({ Component, pageProps }) {
    const [supabase] = useState(() => createBrowserSupabaseClient());

    return (
        <>
            <Head>
                <title>LFG</title>
                <meta name="description" content="LFG" />
                <link rel="icon" href="/favicon.ico" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
                ></meta>
            </Head>
            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider chains={chains}>
                    <SessionContextProvider
                        supabaseClient={supabase}
                        initialSession={pageProps.initialSession}
                    >
                        <ThemeProvider attribute="class" defaultTheme="dark">
                            <Component {...pageProps} />
                        </ThemeProvider>
                    </SessionContextProvider>
                </RainbowKitProvider>
            </WagmiConfig>
        </>
    );
}
