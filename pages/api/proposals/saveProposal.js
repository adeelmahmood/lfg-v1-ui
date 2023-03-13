import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
    SUPABASE_TABLE_LOAN_PROPOSALS,
    SUPABASE_TABLE_LOAN_PROPOSALS_STATUS,
} from "../../../utils/Constants";
import addresses from "../../../constants/contract.json";

const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
const baseUrl = process.env.VERCEL_URL
    ? "https://" + process.env.VERCEL_URL
    : "http://localhost:3000";

export default async function handler(req, res) {
    const supabase = createServerSupabaseClient({ req, res });
    const { loanProposal } = req.body;

    const borrowTokens = addresses[chainId].borrowTokens;

    const validate = async (p) => {
        // make sure proposal hasnt been published yet
        const { data: statuses, error } = await supabase
            .from(SUPABASE_TABLE_LOAN_PROPOSALS_STATUS)
            .select(`status`)
            .eq("proposal_id", p.id);
        if (error) {
            console.log(error);
            return error.message;
        }
        const isPublished = statuses.find((s) => s.status == "Published") !== undefined;
        return isPublished ? "Proposal has already been published. It cant be modified!" : null;
    };

    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
        // validate saving allowed
        if (!isNew(loanProposal)) {
            const cantSave = await validate(loanProposal);
            if (cantSave) {
                res.status(500).json({
                    failedAt: "during validation",
                    error: cantSave,
                });
                return;
            }
        }

        // remove relations
        const {
            loan_proposals_status,
            user_identity_verifications,
            loan_agreement_signatures,
            ...lp
        } = loanProposal;

        // get a circle wallet address if payout mode is fiat
        if (lp.payout_mode === "fiat" && !lp.payout_data?.cirleWalletAddress) {
            const response = await fetch(`${baseUrl}/api/circle/createWallet`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: lp.id }),
            });

            const data = await response.json();
            if (response.status !== 200) {
                res.status(500).json({
                    failedAt: "getting fiat payout wallet address from circle",
                    error: data.error,
                });
                return;
            }

            // set token
            lp.payout_data.fiatPayoutToken = borrowTokens.find((t) => t.fiatPayout)?.token;
            // set wallet address
            lp.payout_data.fiatToCryptoWalletAddress = data.data?.address;
        }

        const { data, error } = await supabase
            .from(SUPABASE_TABLE_LOAN_PROPOSALS)
            .upsert({
                ...lp,
                user_id: session?.user.id,
            })
            .select("id")
            .single();

        if (error) {
            res.status(500).json({ failedAt: "saving loan proposal", error: error.message });
            return;
        } else {
            if (isNew(lp)) {
                // add status entry
                const { error: statusError } = await supabase
                    .from(SUPABASE_TABLE_LOAN_PROPOSALS_STATUS)
                    .insert({
                        status: "Created",
                        proposal_id: data.id,
                    });

                if (statusError) {
                    res.status(500).json({
                        failedAt: "creating new status",
                        error: statusError.message,
                    });
                }
            }
        }

        res.status(200).json(data);
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).json({ error: "Method Not Allowed" });
    }
}

const isNew = (p) => {
    return p.id == null;
};
