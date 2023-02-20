import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function middleware(req) {
    // We need to create a response and hand it to the supabase client to be able to modify the response headers.
    const res = NextResponse.next();
    // Create authenticated Supabase Client.
    const supabase = createMiddlewareSupabaseClient({ req, res });
    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession();

    // Check auth condition
    if (session?.user.email) {
        // Authentication successful, forward request to protected route.
        return res;
    }

    // Auth condition not met, redirect to login page
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
}

export const config = {
    matcher: ["/borrower/:path*", "/proposals"],
};
