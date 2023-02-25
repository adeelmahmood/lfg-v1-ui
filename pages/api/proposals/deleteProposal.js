import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
    SUPABASE_TABLE_LOAN_PROPOSALS,
    SUPABASE_TABLE_LOAN_PROPOSALS_STATUS,
} from "../../../utils/Constants";

export default async function handler(req, res) {
    const supabase = createServerSupabaseClient({ req, res });
    const { id } = req.body;

    const validate = async (id) => {
        // make sure proposal hasnt been published yet
        const { data: statuses, error } = await supabase
            .from(SUPABASE_TABLE_LOAN_PROPOSALS_STATUS)
            .select(`status`)
            .eq("proposal_id", id);
        if (error) {
            return error.message;
        }
        const isPublished = statuses.find((s) => s.status == "Published") !== undefined;
        return isPublished ? "Proposal has already been published. It cant be deleted!" : null;
    };

    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (session?.user && id) {
        // validate deletion allowed
        const cantDelete = await validate(id);
        if (cantDelete) {
            res.status(500).json({
                failedAt: "deleting loan proposal",
                error: cantDelete,
            });
            return;
        }

        const { error } = await supabase
            .from(SUPABASE_TABLE_LOAN_PROPOSALS)
            .delete()
            .eq("id", id)
            .eq("user_id", session.user.id);

        if (error) {
            res.status(500).json({ failedAt: "deleting loan proposal", error: error.message });
        }

        res.status(200).json({ id });
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
