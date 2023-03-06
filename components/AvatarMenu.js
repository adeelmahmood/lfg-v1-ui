import * as React from "react";
import { Menu, Transition } from "@headlessui/react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";

export default function ({ ...rest }) {
    const supabase = useSupabaseClient();
    const user = useUser();
    const router = useRouter();

    const signOut = async (e) => {
        e.preventDefault();
        await supabase.auth.signOut();
        router.push("/");
    };

    return (
        <div className="relative z-10">
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
                            <div className="absolute right-0 lg:right-auto lg:-left-12">
                                <Menu.Items
                                    as="div"
                                    className="mt-2 flex flex-col divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-100 lg:mt-6"
                                >
                                    <div className="px-6 py-3">
                                        <p className="text-sm leading-5 text-gray-800">
                                            Signed in as
                                        </p>
                                        <p className="truncate text-sm font-medium leading-5 text-gray-800">
                                            {user?.user_metadata.full_name}
                                        </p>
                                    </div>

                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={signOut}
                                                className={`flex items-center px-4 py-2 dark:text-gray-800 ${
                                                    active ? "bg-yellow-300" : ""
                                                }`}
                                            >
                                                <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5 fill-current text-gray-800 focus:outline-none dark:text-gray-800" />
                                                Sign out
                                            </button>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </div>
                        </Transition>
                    </>
                )}
            </Menu>
        </div>
    );
}
