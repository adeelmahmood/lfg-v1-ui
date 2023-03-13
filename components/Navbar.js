import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { ArrowPathIcon, Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";
import AvatarMenu from "./AvatarMenu";
import { useRouter } from "next/router";
import ThemeSelector from "./ui/ThemeSelector";

const Navbar = ({}) => {
    const supabase = useSupabaseClient();
    const user = useUser();
    const router = useRouter();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                            Lend
                        </a>
                        <span className="mx-2 hidden w-0.5 bg-gray-600/25 dark:bg-gray-400/25 sm:block"></span>
                        <a
                            href="/borrower/dashboard"
                            className="block rounded px-2 py-1 font-semibold text-indigo-600 hover:bg-indigo-500 hover:text-white dark:text-gray-300 dark:hover:bg-slate-900"
                        >
                            Borrow
                        </a>
                        <span className="mx-2 hidden w-0.5 bg-gray-600/25 dark:bg-gray-400/25 sm:block"></span>
                        <a
                            href="/proposals"
                            className="block rounded px-2 py-1 font-semibold text-indigo-600 hover:bg-indigo-500 hover:text-white dark:text-gray-300 dark:hover:bg-slate-900"
                        >
                            Explore
                        </a>
                        <span className="mx-2 hidden w-0.5 bg-gray-600/25 dark:bg-gray-400/25 sm:block"></span>
                        <a
                            href="#"
                            className="block rounded px-2 py-1 font-semibold text-indigo-600 hover:bg-indigo-500 hover:text-white dark:text-gray-300 dark:hover:bg-slate-900"
                        >
                            Reserves
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
                                    <ThemeSelector />
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
                {/* TODO: MoonIcon throwing a SVG error fill-rule */}
                <div className="hidden items-center space-x-4 lg:flex">
                    <ThemeSelector />
                    {user ? (
                        <AvatarMenu />
                    ) : (
                        <a href="/login" className="btn-primary">
                            Login
                        </a>
                    )}
                    <div>
                        <ConnectButton />
                    </div>
                </div>
            </header>
        </>
    );
};

export default Navbar;
