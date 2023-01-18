import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    // Create authenticated Supabase Client
    const supabase = createServerSupabaseClient({ req, res });
    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
        const userId = session?.user?.id;
        try {
            const session = await stripe.identity.verificationSessions.create({
                type: "document",
                metadata: {
                    user_id: userId,
                },
                options: {
                    document: {
                        require_matching_selfie: true,
                    },
                },
            });

            res.status(200).json({ clientSecret: session.client_secret });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
}
