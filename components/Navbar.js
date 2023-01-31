import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { ArrowPathIcon, Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";
import AvatarMenu from "./AvatarMenu";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";

const Navbar = ({}) => {
    const supabase = useSupabaseClient();
    const user = useUser();
    const router = useRouter();
    const { theme, setTheme } = useTheme();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <>
            <header className="rounded-md shadow-md lg:flex lg:items-center lg:justify-between lg:px-4 lg:py-3">
                <div className="flex items-center justify-between px-4 py-3 lg:p-0">
                    <div>
                        <Link href="/" className="focus:outline-none">
                            <ArrowPathIcon className="mb-2 inline h-6 fill-current text-gray-600 dark:text-gray-300" />
                            <span className="px-2 text-2xl font-bold tracking-tighter text-indigo-700 dark:text-gray-200">
                                Lending Marketplace
                            </span>
                        </Link>
                    </div>
                    <div className="lg:hidden">
                        <button
                            type="button"
                            className="block"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? (
                                <XMarkIcon className="h-8 fill-current text-indigo-700 focus:outline-none dark:text-gray-200" />
                            ) : (
                                <Bars3Icon className="h-8 fill-current text-indigo-700 focus:outline-none dark:text-gray-200" />
                            )}
                        </button>
                    </div>
                </div>
                <nav className={`${isMenuOpen ? "block" : "hidden lg:block"}`}>
                    <div className="px-2 pb-4 pt-2 lg:flex lg:p-0">
                        <a
                            href="/dashboard"
                            className="block rounded px-2 py-1 font-semibold text-indigo-600 hover:bg-indigo-500 hover:text-white dark:text-gray-300 dark:hover:bg-slate-900"
                        >
                            Become a Lender
                        </a>
                        <span className="mx-2 hidden w-0.5 bg-gray-600/25 sm:block"></span>
                        <a
                            href="/borrower/dashboard"
                            className="block rounded px-2 py-1 font-semibold text-indigo-600 hover:bg-indigo-500 hover:text-white dark:text-gray-300 dark:hover:bg-slate-900"
                        >
                            Become a Borrower
                        </a>

                        <div className="mt-3 mb-4 lg:hidden">
                            <ConnectButton />
                        </div>
                        <div className="mb-3 border-t border-indigo-400 opacity-50 dark:border-gray-200 lg:hidden" />
                        {!user && (
                            <div className="lg:hidden">
                                <a
                                    href="/login"
                                    className="block rounded px-2 py-1 font-semibold text-indigo-600 hover:bg-indigo-500 hover:text-white dark:text-gray-300 dark:hover:bg-slate-900"
                                >
                                    Login or Create an Account
                                </a>
                            </div>
                        )}
                        {user && (
                            <div className="lg:hidden">
                                <div className="flex items-center justify-between px-2 py-1">
                                    <div className="flex items-center">
                                        <img
                                            src={user?.user_metadata.avatar_url}
                                            className="h-10 w-10 rounded-full border-2 border-indigo-400 object-cover"
                                        />
                                        <div className="ml-2">
                                            <p className="text-sm leading-5 text-gray-800 dark:text-gray-300">
                                                Signed in as
                                            </p>
                                            <p className="truncate text-sm font-medium leading-5 text-gray-800 dark:text-gray-300">
                                                {user?.user_metadata.full_name}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={toggleTheme}>
                                        {theme === "dark" ? (
                                            <MoonIcon className="h-5 w-5 fill-current text-gray-300" />
                                        ) : (
                                            <SunIcon className="h-5 w-5 fill-current text-indigo-500" />
                                        )}
                                    </button>
                                </div>
                                <button
                                    href="#"
                                    onClick={async () => {
                                        await supabase.auth.signOut();
                                        router.push("/");
                                    }}
                                    className="mt-2 block rounded px-2 py-1 font-semibold text-indigo-600 hover:bg-indigo-500 hover:text-white dark:text-gray-300 dark:hover:bg-slate-700"
                                >
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </nav>
                <div className="flex items-center space-x-4">
                    <button onClick={toggleTheme} className="hidden lg:block">
                        {theme === "dark" ? (
                            <MoonIcon className="h-5 w-5 fill-current text-gray-300" />
                        ) : (
                            <SunIcon className="h-5 w-5 fill-current text-indigo-500" />
                        )}
                    </button>
                    {user && <AvatarMenu className="hidden lg:block" />}
                    {!user && (
                        <a
                            href="/login"
                            className="hidden rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700 dark:bg-slate-800 dark:ring-slate-700 dark:hover:bg-slate-700 dark:hover:ring-slate-800 lg:block"
                        >
                            Login
                        </a>
                    )}
                    <div className="hidden lg:block">
                        <ConnectButton />
                    </div>
                </div>
            </header>
        </>
    );
};

export default Navbar;
