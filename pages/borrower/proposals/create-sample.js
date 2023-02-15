import React, { useEffect, useState } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import {
    SUPABASE_STORAGE_LOAN_PROPOSALS,
    SUPABASE_TABLE_LOAN_PROPOSALS,
    SUPABASE_TABLE_LOAN_PROPOSALS_STATUS,
} from "../../../utils/Constants";

export default function LoanProposal() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    function s(length) {
        let result = " ";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    const [loanProposal, setLoanProposal] = useState({
        business_title: s(10),
        business_tagline: s(10),
        business_description: s(10),
        business_gen_description: s(10),
        loan_reasoning: s(10),
        loan_gen_reasoning: s(10),
        tagline_manual_picked: true,
        tagline_gen_picked: false,
        description_manual_picked: true,
        description_gen_picked: false,
        reasoning_manual_picked: true,
        reasoning_gen_picked: false,
        banner_image: "https://source.unsplash.com/random",
        banner_image_metadata: {},
        identity_verification_requested: false,
        amount: 1000,
    });

    const supabase = useSupabaseClient();
    const user = useUser();

    useEffect(() => {
        if (user) save();
    }, [user]);

    const save = async () => {
        const { data, error } = await supabase
            .from(SUPABASE_TABLE_LOAN_PROPOSALS)
            .insert({
                ...loanProposal,
                user_id: user.id,
            })
            .select("id")
            .single();
        console.log(data, error);

        // add status entry
        const { data: statusData, error: statusError } = await supabase
            .from(SUPABASE_TABLE_LOAN_PROPOSALS_STATUS)
            .insert({
                status: "Created",
                proposal_id: data?.id,
            });
        console.log(statusData, statusError);
    };

    return <>done</>;
}
