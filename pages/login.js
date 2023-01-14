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
            process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
            process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
            "http://localhost:3000/";
        // Make sure to include `https://` when not localhost.
        url = url.includes("http") ? url : `https://${url}`;
        // Make sure to including trailing `/`.
        url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
        // if redirect query is provided, add that too
        if (router.query.redirectedFrom) {
            url = `${url}login-redirect?redirectedFrom=${encodeURI(router.query.redirectedFrom)}`;
        }
        console.log(url);
        return url;
    };

    const supabase = useSupabaseClient();

    return (
        <>
            <div className="container relative  mx-auto p-6">
                <TopGradient />
                <Navbar />

                <div className="mt-10 grid w-full grid-cols-1 lg:grid-cols-12">
                    <div className="col-span-1 lg:col-span-7">
                        <div className="flex flex-col items-center justify-center p-5">
                            <h2 className="max-w-md text-4xl font-bold tracking-tight md:mt-20 md:tracking-normal">
                                Login or Create an Account
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
                    <div className="overflow:hidden mt-10 hidden lg:col-span-5 lg:flex">
                        <div className="relative">
                            <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-br from-stone-700 to-slate-300 opacity-75 blur-sm"></div>
                            <img
                                src="/images/welcome-on-wall.png"
                                alt="Social markplace for lending"
                                className="aspect-square relative rounded-lg object-cover object-left shadow-lg sm:h-full"
                            />
                        </div>
                    </div>
                </div>
                <BottomGradient />
            </div>
        </>
    );
}
