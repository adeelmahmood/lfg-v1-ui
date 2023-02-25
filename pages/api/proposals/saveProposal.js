import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
    SUPABASE_TABLE_LOAN_PROPOSALS,
    SUPABASE_TABLE_LOAN_PROPOSALS_STATUS,
} from "../../../utils/Constants";

export default async function handler(req, res) {
    const supabase = createServerSupabaseClient({ req, res });
    const { loanProposal } = req.body;

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
                    failedAt: "saving loan proposal",
                    error: cantSave,
                });
                return;
            }
        }

        const { data, error } = await supabase
            .from(SUPABASE_TABLE_LOAN_PROPOSALS)
            .upsert({
                ...loanProposal,
                user_id: session?.user.id,
            })
            .select("id")
            .single();

        if (error) {
            res.status(500).json({ failedAt: "saving loan proposal", error: error.message });
            return;
        } else {
            if (isNew(loanProposal)) {
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
