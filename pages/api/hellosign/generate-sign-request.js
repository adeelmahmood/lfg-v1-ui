import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { SignatureRequestApi, EmbeddedApi } from "@dropbox/sign";
import {
    HELLOSIGN_TEMPLATE_PDF_PATH,
    SUPABASE_TABLE_LOAN_AGREEMENT_SIGNATURES,
    WEBSITE_EMAILADDRESS,
} from "../../../utils/Constants";

const fs = require("fs");

const signatureRequestApi = new SignatureRequestApi();
const embeddedApi = new EmbeddedApi();

const API_KEY = process.env.HELLOSIGN_API_KEY || "";
const CLIENT_ID = process.env.NEXT_PUBLIC_HELLOSIGN_CLIENT_ID || "";

// Configure HTTP basic authorization: api_key
signatureRequestApi.username = API_KEY;
embeddedApi.username = API_KEY;

// or, configure Bearer (JWT) authorization: oauth2
// signatureRequestApi.accessToken = "YOUR_ACCESS_TOKEN";

export default async function handler(req, res) {
    const supabase = createServerSupabaseClient({ req, res });
    const { proposalId } = req.body;
    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (session?.user && proposalId) {
        try {
            // first check in the database if there is already a signature
            const { data: signatureInDb, error } = await supabase
                .from(SUPABASE_TABLE_LOAN_AGREEMENT_SIGNATURES)
                .select("*")
                .eq("proposal_id", proposalId)
                .eq("user_id", session.user.id)
                .single();

            // generate sign url from persisted signature request
            if (signatureInDb) {
                const result = await embeddedApi.embeddedSignUrl(signatureInDb.signature_id);
                res.status(200).json({ ...result.body });
                return;
            }

            const signer1 = {
                emailAddress: session.user.email,
                name: session.user.user_metadata?.full_name || name,
                order: 0,
            };

            const signingOptions = {
                draw: true,
                type: true,
                upload: true,
                phone: true,
                defaultType: "draw",
            };

            const data = {
                clientId: CLIENT_ID,
                title: "Loan Agreement",
                subject: "Loan Agreement",
                message: "Sign this loan agreement",
                signers: [signer1],
                ccEmailAddresses: [WEBSITE_EMAILADDRESS],
                files: [fs.createReadStream(HELLOSIGN_TEMPLATE_PDF_PATH)],
                metadata: {
                    user_id: session.user.id,
                    proposal_id: proposalId,
                },
                signingOptions,
                testMode: true,
            };

            const result = await signatureRequestApi.signatureRequestCreateEmbedded(data);
            // persist this signature request in the database
            const { error: er } = await supabase
                .from(SUPABASE_TABLE_LOAN_AGREEMENT_SIGNATURES)
                .insert({
                    proposal_id: proposalId,
                    user_id: session.user.id,
                    signature_request_id: result.body.signatureRequest?.signatureRequestId,
                    signature_id: result.body.signatureRequest?.signatures[0]?.signatureId,
                    status: result.body.signatureRequest?.signatures[0]?.statusCode,
                    signed_at: result.body.signatureRequest?.signatures[0]?.signedAt,
                });

            if (er) {
                console.log("error in persisting signature request", er.message);
            }

            // generate sign url
            const results2 = await embeddedApi.embeddedSignUrl(
                result.body.signatureRequest?.signatures[0]?.signatureId
            );

            // return response including signature request and sign url
            // res.status(200).json({ ...result.body, ...result2.body });
            res.status(200).json({ ...results2.body });
        } catch (e) {
            res.status(500).json({ error: e.message });
            console.log("error", e.message);
        }
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
