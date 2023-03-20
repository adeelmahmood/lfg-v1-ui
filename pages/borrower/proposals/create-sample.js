import React, { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import addresses from "../../../constants/contract.json";
import { useAccount } from "wagmi";

export default function LoanProposal() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    const router = useRouter();
    const { type } = router.query;

    const { address } = useAccount();

    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
    const borrowTokens = addresses[chainId].borrowTokens;
    const fiatPayoutToken = addresses[chainId].fiatPayoutToken;

    function s(words, chars) {
        let result = "";
        for (let i = 0; i < words; i++) {
            result += c(chars) + " ";
        }
        return result;
    }

    function c(length) {
        let result = " ";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    const [loanProposal, setLoanProposal] = useState({
        business_title: s(3, 3) + s(3, 4) + s(2, 2) + s(1, 4),
        business_tagline: "",
        business_description: s(50, 10),
        business_gen_description: "",
        loan_reasoning: s(50, 10),
        loan_gen_reasoning: "",
        tagline_manual_picked: true,
        tagline_gen_picked: false,
        description_manual_picked: true,
        description_gen_picked: false,
        reasoning_manual_picked: true,
        reasoning_gen_picked: false,
        banner_image: "https://source.unsplash.com/random",
        banner_image_metadata: {},
        identity_verification_requested: false,
        amount: 5,
    });

    const user = useUser();

    useEffect(() => {
        async function saveP() {
            let payoutData;
            if (type == "crypto-payout") {
                payoutData = {
                    payout_mode: "crypto",
                    payout_token: borrowTokens[0].address,
                    payout_address: address,
                };
            } else if (type == "fiat-payout") {
                payoutData = {
                    payout_mode: "fiat",
                    payout_token: fiatPayoutToken.address,
                    payout_address: address,
                };
            }

            const lp = {
                ...loanProposal,
                ...payoutData,
            };
            console.log(lp);

            const response = await fetch("/api/proposals/saveProposal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ loanProposal: lp, address: address }),
            });

            const data = await response.json();
            if (response.status !== 200) {
                console.log(data.error);
            } else {
                router.push("/borrower/dashboard");
            }
        }

        if (user && router.isReady) {
            saveP();
        }
    }, [user, router.isReady]);

    return <>Creating fake data...</>;
}
