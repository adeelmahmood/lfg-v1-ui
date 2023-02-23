import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { buffer } from "micro";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WH_SECRET;

export const config = {
    api: {
        bodyParser: false,
    },
};

const handler = async (req, res) => {
    const supabase = createServerSupabaseClient({ req, res });

    if (req.method == "POST") {
        const sig = req.headers["stripe-signature"];
        const buf = await buffer(req);

        let event;

        try {
            event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
        } catch (err) {
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        let userId;
        let pid;
        let verificationResult;
        let verificationMessage;

        switch (event.type) {
            case "identity.verification_session.verified": {
                const session = event.data.object;
                userId = session.metadata?.user_id;
                pid = session.metadata?.pid;
                verificationResult = session.status;

                break;
            }
            case "identity.verification_session.requires_input": {
                // At least one of the verification checks failed
                const verificationSession = event.data.object;

                userId = verificationSession.metadata?.user_id;
                pid = verificationSession.metadata?.pid;

                verificationResult = verificationSession.last_error.code;
                verificationMessage = verificationSession.last_error.reason;

                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
                break;
        }

        // update proposal application with verification results
        const { data, error } = await supabase.from("user_identity_verifications").insert({
            user_id: userId,
            verification_provider: "stripe",
            verification_status: verificationResult,
            verification_message: verificationMessage,
            received_at: new Date(),
            proposal_id: pid,
        });

        if (error && error.message) {
            console.log("Unable to update identity verification results", error.message);
            // do something else
        }

        res.json({ received: true });
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
};

export default handler;
