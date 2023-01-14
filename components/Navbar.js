import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

const Navbar = ({}) => {
    const supabase = useSupabaseClient();
    const user = useUser();
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="pt-2">
                    <Link href="/" className="focus:outline-none">
                        <ArrowPathIcon className="mb-2 inline h-6" fill="#4F46E5" />
                        <span className="px-2 text-2xl font-bold tracking-tighter text-indigo-600 hover:text-indigo-800">
                            Lending Marketplace
                        </span>
                    </Link>
                </div>
                <div className="hidden space-x-6">
                    <a href="#" className="hover:text-indigo-600">
                        Launch App
                    </a>
                    <a href="#" className="hover:text-indigo-600">
                        Learn More
                    </a>
                </div>
                <div className="hidden sm:flex">
                    <div className="flex items-center justify-center space-x-4">
                        {user && (
                            <div className="font-semibold">
                                Welcome {user?.user_metadata.full_name}
                            </div>
                        )}
                        {user && (
                            <button
                                onClick={async () => {
                                    await supabase.auth.signOut();
                                    router.push("/");
                                }}
                                className="rounded-lg p-2 shadow hover:bg-stone-200"
                            >
                                Sign out
                            </button>
                        )}
                        <ConnectButton />
                    </div>
                </div>
            </div>
            {user && (
                <div className="flex items-center justify-between px-4 py-2 shadow sm:hidden">
                    <div className="font-semibold">Welcome, {user?.user_metadata.full_name}</div>
                    <button
                        onClick={async () => {
                            await supabase.auth.signOut();
                            router.push("/");
                        }}
                        className="rounded-lg p-2 shadow hover:bg-stone-200"
                    >
                        Sign out
                    </button>
                </div>
            )}
        </>
    );
};

export default Navbar;
