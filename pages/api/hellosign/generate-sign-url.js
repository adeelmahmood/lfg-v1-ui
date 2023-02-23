import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import * as DropboxSign from "@dropbox/sign";

const embeddedApi = new DropboxSign.EmbeddedApi();

const API_KEY = process.env.HELLOSIGN_API_KEY || "";

// Configure HTTP basic authorization: api_key
embeddedApi.username = API_KEY;

// or, configure Bearer (JWT) authorization: oauth2
// signatureRequestApi.accessToken = "YOUR_ACCESS_TOKEN";

export default async function handler(req, res) {
    const supabase = createServerSupabaseClient({ req, res });
    const { signatureRequestId } = req.body;

    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
        try {
            const result = await embeddedApi.embeddedSignUrl(signatureRequestId);

            res.status(200).json({ ...result.body });
        } catch (e) {
            res.status(500).json({ error: e.body });
        }
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
}
