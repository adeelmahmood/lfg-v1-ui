import React, { useEffect, useState } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import {
    SUPABASE_TABLE_LOAN_PROPOSALS,
    SUPABASE_TABLE_LOAN_PROPOSALS_STATUS,
} from "../../../utils/Constants";
import { useRouter } from "next/router";
import addresses from "../../../constants/contract.json";

export default function LoanProposal() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    const router = useRouter();
    const { type } = router.query;

    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
    const borrowTokens = addresses[chainId].borrowTokens;
    const fiatBorrowToken = borrowTokens.find((t) => t.fiatPayout);

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

    const supabase = useSupabaseClient();
    const user = useUser();

    useEffect(() => {
        async function saveP() {
            const id = await save();

            if (type == "crypto-payout") {
                const payoutData = {
                    id,
                    payout_mode: "crypto",
                    payout_data: {
                        token: fiatBorrowToken.token,
                        walletAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
                    },
                };

                await save(payoutData);
            } else if (type == "fiat-payout") {
                const response = await fetch("/api/circle/createWallet", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id }),
                });
                const data = await response.json();

                const payoutData = {
                    id,
                    payout_mode: "fiat",
                    payout_data: {
                        fiatPayoutToken: fiatBorrowToken.token,
                        fiatToCryptoWalletAddress: data.data?.address,
                    },
                };
                await save(payoutData);
            }

            router.push("/borrower/dashboard");
        }

        if (user && router.isReady) {
            saveP();
        }
    }, [user, router.isReady]);

    const save = async (moreData) => {
        console.log("saving lp", loanProposal);
        const { data } = await supabase
            .from(SUPABASE_TABLE_LOAN_PROPOSALS)
            .upsert({
                ...loanProposal,
                ...moreData,
                user_id: user.id,
            })
            .select("id")
            .single();

        // add status entry
        if (!loanProposal.id && data?.id) {
            await supabase.from(SUPABASE_TABLE_LOAN_PROPOSALS_STATUS).insert({
                status: "Created",
                proposal_id: data.id,
            });
        }

        return data.id;
    };

    return <>Creating fake data...</>;
}
