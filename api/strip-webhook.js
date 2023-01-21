import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
// import { buffer } from "micro";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WH_SECRET;


const handler = async (req, res) => {
    const supabase = createServerSupabaseClient({ req, res });

    if (req.method == "POST") {
        const sig = req.headers["stripe-signature"];
        // const buf = await buffer(req);

        let event;

        try {
            event = stripe.webhooks.constructEvent(req, sig, webhookSecret);
        } catch (err) {
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        switch (event.type) {
            case "identity.verification_session.verified":
                const session = event.data.object;
                const userId = session.metadata?.user_id;
                const pid = session.metadata?.pid;

                console.log(session);

                // update proposal application with verification results
                const { data, error } = await supabase.from("user_identity_verifications").insert({
                    user_id: userId,
                    verification_provider: "stripe",
                    verification_status: session.status,
                    received_at: new Date(),
                    proposal_id: pid,
                });

                if (error && error.message) {
                    console.log("Unable to update identity verification results", error.message);
                    // do something else
                }
                break;
                default
        }

        res.json({ received: true });
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
};

export default handler;
