import { Fragment } from "react";
import Navbar from "../components/Navbar";
import TopGradient from "../components/ui/TopGradient";
import Link from "next/link";
import useIsMounted from "../hooks/useIsMounted";

export default function Causes() {
    const isMounted = useIsMounted();

    const causes = [
        {
            title: "Climate Change Technologies",
            imgId: Math.floor(Math.random() * 10) + 1,
            selected: false,
        },
        {
            title: "Human Rights Organizations",
            imgId: Math.floor(Math.random() * 200) + 100,
            selected: false,
        },
        {
            title: "Non Profit Causes",
            imgId: Math.floor(Math.random() * 20) + 10,
            selected: false,
        },
        {
            title: "Help Crypto Adoption",
            imgId: Math.floor(Math.random() * 50) + 10,
            selected: false,
        },
        {
            title: "Awareness",
            imgId: Math.floor(Math.random() * 100) + 20,
            selected: false,
        },
    ];

    return (
        <>
            <div className="container mx-auto p-6">
                <TopGradient />
                <Navbar />

                <section id="heading">
                    <div className="items-left flex flex-col justify-between rounded border-gray-200 md:mt-6 md:flex-row md:items-center md:border">
                        <h2 className="px-5 pt-5 text-4xl font-semibold md:p-5 md:text-3xl">
                            Causes you support
                        </h2>
                        <div className="hidden max-w-xs md:flex md:p-5">
                            <Link
                                className="rounded-full border border-gray-400 bg-indigo-500 py-2 px-4 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                href="/dashboard"
                            >
                                Next: Deposit Tokens
                            </Link>
                        </div>
                    </div>
                </section>

                <section id="causes">
                    <div className="mx-auto mt-10 grid grid-cols-1 gap-x-0 gap-y-10 p-5 sm:grid-cols-2 sm:gap-y-10 sm:gap-x-4 md:grid-cols-3 md:gap-y-20">
                        {causes.map((cause, index) => {
                            return (
                                <div
                                    key={index}
                                    className="max-w-sm overflow-hidden rounded shadow-lg hover:cursor-pointer hover:shadow-2xl"
                                >
                                    <img
                                        className="w-full"
                                        src={`https://picsum.photos/id/${cause.imgId}/200`}
                                        alt="Sunset in the mountains"
                                    />
                                    <div className="px-6 py-4">
                                        <div className="mb-2 text-xl font-bold">{cause.title}</div>
                                        <p className="text-base text-gray-700">
                                            Lorem ipsum dolor sit amet, consectetur adipisicing
                                            elit. Voluptatibus quia, nulla! Maiores et perferendis
                                            eaque, exercitationem praesentium nihil.
                                        </p>
                                    </div>
                                    <div className="px-6 pt-2 pb-4">
                                        <div className="flex items-center rounded border border-gray-200 pl-4">
                                            <input
                                                id={`cause-${index}`}
                                                type="checkbox"
                                                value={cause.selected}
                                                name="bordered-radio"
                                                className="h-4 w-4 border-gray-300 bg-gray-100 text-indigo-600 focus:ring-0 focus:ring-indigo-500"
                                            />
                                            <label className="ml-2 w-full py-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                Select This Cause
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex w-full items-center justify-end p-5 md:hidden">
                        <Link
                            className="rounded-full border border-gray-400 bg-indigo-500 py-2 px-4 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                            href="/dashboard"
                        >
                            Next: Deposit Tokens
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}
