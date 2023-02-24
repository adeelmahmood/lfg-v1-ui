import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SUPABASE_TABLE_LOAN_AGREEMENT_SIGNATURES } from "../../../utils/Constants";
const formidable = require("formidable");
const crypto = require("crypto");

export const config = {
    api: {
        bodyParser: false,
    },
};

const API_KEY = process.env.HELLOSIGN_API_KEY || "";

const handler = async (req, res) => {
    const verifyHash = (event) => {
        const hash = crypto
            .createHmac("sha256", API_KEY)
            .update(event.event_time + event.event_type)
            .digest("hex")
            .toString();
        return hash === event.event_hash;
    };

    const getDateFromSeconds = (seconds) => {
        const d = new Date(0);
        d.setUTCSeconds(seconds);
        return d;
    };

    const form = formidable({ multiples: true });

    const supabase = createServerSupabaseClient({ req, res });

    const parseForm = async (req) =>
        new Promise((resolve, reject) =>
            form.parse(req, (err, fields) => (err ? reject(err) : resolve([fields])))
        );

    const [fields] = await parseForm(req);

    const { event, signature_request } = JSON.parse(fields.json);

    if (!verifyHash(event)) {
        res.status(400).send("Incorrect event hash");
        return;
    }

    if (event.event_type === "signature_request_all_signed") {
        const signature = signature_request.signatures[0];

        const { error: err } = await supabase
            .from(SUPABASE_TABLE_LOAN_AGREEMENT_SIGNATURES)
            .update({
                status: signature.status_code,
                signed_at: signature.signed_at ? getDateFromSeconds(signature.signed_at) : null,
            })
            .eq("proposal_id", signature_request.metadata.proposal_id)
            .eq("user_id", signature_request.metadata.user_id)
            .eq("signature_request_id", signature_request.signature_request_id)
            .eq("signature_id", signature.signature_id);

        if (err) {
            console.log(err.message);
            res.status(400).send(`Webhook Error: ${err}`);
            return;
        }
    }

    res.send("Hello API Event Received");
};

export default handler;
