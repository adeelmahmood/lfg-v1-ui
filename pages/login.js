import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import BottomGradient from "../components/BottomGradient";
import Navbar from "../components/Navbar";
import TopGradient from "../components/TopGradient";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export default function Borrower() {
    const router = useRouter();

    const redirectURL = () => {
        let url =
            router.query.redirectedFrom ?? // if redirected from another page
            process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
            process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
            "http://localhost:3000/";
        // Make sure to include `https://` when not localhost.
        url = url.includes("http") ? url : `https://${url}`;
        // Make sure to including trailing `/`.
        url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
        return url;
    };

    const supabase = useSupabaseClient();

    return (
        <>
            <div className="container relative mx-auto p-6">
                <TopGradient />
                <Navbar />

                <div className="w-full">
                    <div className="col-span-1 md:col-span-7">
                        <div className="flex flex-col items-center justify-center p-5">
                            <h2 className="max-w-md text-4xl font-bold tracking-tight md:mt-20 md:tracking-normal">
                                Login or Create Account
                            </h2>
                            <p className="mt-5 max-w-md text-gray-700">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                Voluptatibus quia, nulla! Maiores et perferendis eaque,
                                exercitationem praesentium nihil.
                            </p>
                        </div>
                        <div className="flex items-start justify-center">
                            <div className="w-96 rounded-lg p-6 shadow-lg md:mt-10">
                                <Auth
                                    supabaseClient={supabase}
                                    appearance={{
                                        theme: ThemeSupa,
                                    }}
                                    providers={["google"]}
                                    redirectTo={redirectURL()}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <BottomGradient />
            </div>
        </>
    );
}
