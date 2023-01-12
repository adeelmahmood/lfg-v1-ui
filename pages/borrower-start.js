import { Auth, ThemeSupa, ThemeMinimal } from "@supabase/auth-ui-react";
import BottomGradient from "../components/BottomGradient";
import Navbar from "../components/Navbar";
import TopGradient from "../components/TopGradient";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import HeroCard from "../components/HeroCard";

export default function Borrower() {
    const redirectURL = () => {
        let url =
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

                <div className="mt-10 grid w-full grid-cols-1 md:grid-cols-12">
                    <div className="col-span-1 md:col-span-7">
                        <div className="flex flex-col items-center justify-center p-5">
                            <h2 className="max-w-md text-4xl font-bold tracking-tight md:mt-20 md:tracking-normal">
                                Create an account to start the borrow process
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
                    <div className="overflow:hidden mt-10 hidden md:col-span-5 md:flex">
                        <div className="relative">
                            <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-br from-stone-700 to-stone-300 opacity-75 blur-sm"></div>
                            <img
                                src="/images/welcome.jpg"
                                alt="Social markplace for lending"
                                className="relative h-full w-full max-w-2xl rounded-lg object-cover object-center shadow-lg"
                            />
                        </div>
                    </div>
                </div>
                <BottomGradient />
            </div>
        </>
    );
}
