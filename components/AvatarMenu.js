import * as React from "react";
import { Menu, Transition } from "@headlessui/react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export default function ({ ...rest }) {
    const supabase = useSupabaseClient();
    const user = useUser();
    const router = useRouter();

    const signOut = async () => {
        console.log("signing out");
        await supabase.auth.signOut();
        router.push("/");
    };

    return (
        <div className="flex items-center justify-center" {...rest}>
            <div className="relative text-left">
                <Menu>
                    {({ open }) => (
                        <>
                            <span className="rounded-md shadow-sm">
                                <Menu.Button className="block h-8 w-8 overflow-hidden rounded-full border-2 border-indigo-400 hover:shadow-md focus:outline-none">
                                    <img
                                        src={user?.user_metadata.avatar_url}
                                        className="h-full w-full object-cover"
                                    />
                                </Menu.Button>
                            </span>

                            <Transition
                                show={open}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items
                                    static
                                    className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md border border-gray-200 bg-white shadow-lg outline-none"
                                >
                                    <div className="px-4 py-3">
                                        <p className="text-sm leading-5 text-gray-800">
                                            Signed in as
                                        </p>
                                        <p className="truncate text-sm font-medium leading-5 text-gray-800">
                                            {user?.user_metadata.full_name}
                                        </p>
                                    </div>

                                    <div className="py-1">
                                        {/* <Menu.Item>
                                            {({ active }) => (
                                                <a
                                                    href="#account-settings"
                                                    className={`${
                                                        active
                                                            ? "bg-gray-100 text-gray-900"
                                                            : "text-gray-700"
                                                    } flex w-full justify-between px-4 py-2 text-left text-sm leading-5`}
                                                >
                                                    Account settings
                                                </a>
                                            )}
                                        </Menu.Item> */}
                                        <Menu.Item
                                            as="span"
                                            disabled
                                            className="flex w-full cursor-not-allowed justify-between px-4 py-2 text-left text-sm leading-5 text-gray-700 opacity-50"
                                        >
                                            New feature (soon)
                                        </Menu.Item>
                                    </div>

                                    <div className="py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <a
                                                    href="#sign-out"
                                                    className={`${
                                                        active
                                                            ? "bg-gray-100 text-gray-900"
                                                            : "text-gray-700"
                                                    } flex w-full justify-between px-4 py-2 text-left text-sm leading-5`}
                                                    onClick={signOut}
                                                >
                                                    Sign out
                                                </a>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </>
                    )}
                </Menu>
            </div>
        </div>
    );
}
