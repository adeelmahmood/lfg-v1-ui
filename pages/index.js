import { Inter } from "@next/font/google";
import { useAccount } from "wagmi";
import Link from "next/link";
import TopGradient from "../components/TopGradient";
import BottomGradient from "../components/BottomGradient";
import Navbar from "../components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        <>
            <div className="container relative mx-auto p-6">
                <TopGradient />
                <Navbar />

                <section id="hero">
                    <div className="mx-auto max-w-3xl pt-20 pb-10">
                        <div>
                            <div>
                                <h1 className="text-5xl font-bold tracking-tight sm:text-center sm:text-6xl">
                                    Lend tokens to
                                    <span className="text-indigo-700 pl-3">
                                        causes you care about
                                    </span>
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-center">
                                    Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
                                    lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat
                                    fugiat aliqua.
                                </p>
                                <div className="mt-6 flex gap-x-4 sm:justify-center">
                                    <Link
                                        href="/dashboard"
                                        className="divide-x divide-white inline-block rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold 
                                            leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700"
                                    >
                                        <span className="pr-6">Launch App</span>
                                        <span className="pl-6">Connect</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="infoGrid">
                    <div className="container px-6 mt-10 mx-auto grid gap-4 md:gap-8 grid-cols-1 items-start md:grid-cols-2">
                        <div className="flex flex-col pb-10 w-full items-center">
                            <div className="space-y-5">
                                <h2 className="max-w-md text-3xl font-bold text-center text-gray-700 lg:text-4xl md:text-left">
                                    Support causes you care about
                                </h2>
                                <p className="max-w-md text-center text-gray-700 md:text-left">
                                    Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
                                    lorem cupidatat commodo.
                                </p>
                                <div className="flex w-full justify-center md:justify-start">
                                    <div className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                                        <a href="#">Learn More</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col pb-10 w-full items-center">
                            <div className="space-y-5">
                                <h2 className="max-w-md text-3xl font-bold text-center text-gray-700 lg:text-4xl md:text-left">
                                    Earn yield from Aave
                                </h2>
                                <p className="max-w-md text-center text-gray-700 md:text-left">
                                    Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
                                    lorem cupidatat commodo.
                                </p>
                                <div className="flex w-full justify-center md:justify-start">
                                    <div className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                                        <a href="#">Learn More</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col pb-10 w-full items-center">
                            <div className="space-y-5">
                                <h2 className="max-w-md text-3xl font-bold text-center text-gray-700 lg:text-4xl md:text-left">
                                    Participate in governance
                                </h2>
                                <p className="max-w-md text-center text-gray-700 md:text-left">
                                    Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
                                    lorem cupidatat commodo.
                                </p>
                                <div className="flex w-full justify-center md:justify-start">
                                    <div className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                                        <a href="#">Learn More</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col pb-10 w-full items-center">
                            <div className="space-y-5">
                                <h2 className="max-w-md text-3xl font-bold text-center text-gray-700 lg:text-4xl md:text-left">
                                    Improve the state of Defi lending
                                </h2>
                                <p className="max-w-md text-center text-gray-700 md:text-left">
                                    Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
                                    lorem cupidatat commodo.
                                </p>
                                <div className="flex w-full justify-center md:justify-start">
                                    <div className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                                        <a href="#">Learn More</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <BottomGradient />
            </div>
        </>
    );
}
