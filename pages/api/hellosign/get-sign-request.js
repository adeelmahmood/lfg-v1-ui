import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { SignatureRequestApi, EmbeddedApi } from "@dropbox/sign";

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
    // const supabase = createServerSupabaseClient({ req, res });
    const { signatureId } = req.body;
    console.log("looking up for " + signatureId);
    // Check if we have a session
    // const {
    //     data: { session },
    // } = await supabase.auth.getSession();

    // if (session?.user) {
    const result = signatureRequestApi.signatureRequestGet(signatureId);
    result
        .then((response) => {
            res.status(200).json(response.body);
        })
        .catch((e) => {
            res.status(500).json({ error: e.body });
        });
    // } else {
    //     res.setHeader("Allow", "POST");
    //     res.status(405).end("Method Not Allowed");
    // }
}
