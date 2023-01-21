import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { ArrowPathIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";
import AvatarMenu from "./AvatarMenu";
import { useRouter } from "next/router";

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
                            <ArrowPathIcon className="mb-2 inline h-6 fill-current text-gray-600" />
                            <span className="px-2 text-2xl font-bold tracking-tighter text-indigo-700">
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
                                <XMarkIcon className="h-8 focus:outline-none" fill="#4F46E5" />
                            ) : (
                                <Bars3Icon className="h-8 focus:outline-none" fill="#4F46E5" />
                            )}
                        </button>
                    </div>
                </div>
                <nav className={`${isMenuOpen ? "block" : "hidden lg:block"}`}>
                    <div className="px-2 pb-4 pt-2 lg:flex lg:p-0">
                        <a
                            href="/dashboard"
                            className="block rounded px-2 py-1 font-semibold text-indigo-600 hover:bg-indigo-500 hover:text-white"
                        >
                            Become a Lender
                        </a>
                        <span className="mx-2 hidden w-0.5 bg-gray-600/25 sm:block"></span>
                        <a
                            href="/borrower/dashboard"
                            className="block rounded px-2 py-1 font-semibold text-indigo-600 hover:bg-indigo-500 hover:text-white"
                        >
                            Become a Borrower
                        </a>

                        <div className="mt-3 mb-4 lg:hidden">
                            <ConnectButton />
                        </div>
                        <div className="mb-3 border-t border-indigo-400 opacity-50 lg:hidden" />
                        {!user && (
                            <div className="lg:hidden">
                                <a
                                    href="/login"
                                    className="block rounded px-2 py-1 font-semibold text-indigo-600 hover:bg-indigo-500 hover:text-white"
                                >
                                    Login or Create an Account
                                </a>
                            </div>
                        )}
                        {user && (
                            <div className="lg:hidden">
                                <div className="flex items-center px-2 py-1 lg:hidden">
                                    <img
                                        src={user?.user_metadata.avatar_url}
                                        className="h-10 w-10 rounded-full border-2 border-indigo-400 object-cover"
                                    />
                                    <div className="ml-2">
                                        <p className="text-sm leading-5">Signed in as</p>
                                        <p className="truncate text-sm font-medium leading-5 text-gray-900">
                                            {user?.user_metadata.full_name}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    href="#"
                                    onClick={async () => {
                                        await supabase.auth.signOut();
                                        router.push("/");
                                    }}
                                    className="mt-2 block rounded px-2 py-1 font-semibold text-indigo-600 hover:bg-indigo-500 hover:text-white"
                                >
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </nav>
                <div className="flex items-center space-x-4">
                    {user && <AvatarMenu className="hidden lg:block" />}
                    {!user && (
                        <a
                            href="/login"
                            className="hidden rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 
                                            text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700 lg:block"
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
