import React, { useEffect, useState } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { saveEvent } from "../utils/Events";
import { SUPABASE_TABLE_LOAN_PROPOSALS_EVENTS } from "../utils/Constants";

export default function Testt() {
    const router = useRouter();
    const { type } = router.query;

    const { address } = useAccount();
    const supabase = useSupabaseClient();

    const user = useUser();

    const save = async () => {
        saveEvent(supabase, {});
    };

    return (
        <div className="container mx-auto p-8">
            <h2 className="text-5xl">Test Page</h2>

            <button className="btn-primary mt-8" onClick={save}>
                Save Event
            </button>
        </div>
    );
}
