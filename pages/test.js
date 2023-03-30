import React, { useEffect, useState } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { saveEvent } from "../utils/Events";

export default function LoanProposal() {
    const router = useRouter();
    const { type } = router.query;

    const { address } = useAccount();
    const supabase = useSupabaseClient();

    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";

    const user = useUser();

    useEffect(() => {
        if (user) {
            const events = [];
            for (let i = 100; i < 200; i++) {
                events.push({
                    event_type: "test" + i,
                    event_data: JSON.stringify({ a: "b", c: "d", e: "f" }),
                    address: address,
                });
            }

            const promises = events.map((event, i) => {
                return saveEvent(supabase, event);
            });
            Promise.all(promises).then(() => {
                console.log("ALL DONE");
            });
        }
    }, [user, router.isReady]);

    return <>Testing...</>;
}
