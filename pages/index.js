import { Inter } from "@next/font/google";
import { useAccount } from "wagmi";
import Link from "next/link";
import TopGradient from "../components/TopGradient";
import BottomGradient from "../components/BottomGradient";
import Navbar from "../components/Navbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";

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
                                    <span className="pl-3 text-indigo-700">
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
                                        href="/causes"
                                        className="rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold 
                                            leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700"
                                    >
                                        Launch App
                                    </Link>
                                    <ConnectButton />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="infoGrid">
                    <div className="container mx-auto mt-10 grid grid-cols-1 items-start gap-4 px-6 md:grid-cols-2 md:gap-8">
                        <div className="flex w-full flex-col items-center pb-10">
                            <div className="space-y-5">
                                <h2 className="max-w-md text-center text-3xl font-bold text-gray-700 md:text-left lg:text-4xl">
                                    Support causes you care about
                                </h2>
                                <p className="max-w-md text-center text-gray-700 md:text-left">
                                    Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
                                    lorem cupidatat commodo.
                                </p>
                                <div className="flex w-full justify-center md:justify-start">
                                    <div className="rounded border border-gray-400 bg-white py-2 px-4 font-semibold text-gray-800 shadow hover:bg-gray-100">
                                        <a href="#">Learn More</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full flex-col items-center pb-10">
                            <div className="space-y-5">
                                <h2 className="max-w-md text-center text-3xl font-bold text-gray-700 md:text-left lg:text-4xl">
                                    Earn yield from Aave
                                </h2>
                                <p className="max-w-md text-center text-gray-700 md:text-left">
                                    Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
                                    lorem cupidatat commodo.
                                </p>
                                <div className="flex w-full justify-center md:justify-start">
                                    <div className="rounded border border-gray-400 bg-white py-2 px-4 font-semibold text-gray-800 shadow hover:bg-gray-100">
                                        <a href="#">Learn More</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full flex-col items-center pb-10">
                            <div className="space-y-5">
                                <h2 className="max-w-md text-center text-3xl font-bold text-gray-700 md:text-left lg:text-4xl">
                                    Participate in governance
                                </h2>
                                <p className="max-w-md text-center text-gray-700 md:text-left">
                                    Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
                                    lorem cupidatat commodo.
                                </p>
                                <div className="flex w-full justify-center md:justify-start">
                                    <div className="rounded border border-gray-400 bg-white py-2 px-4 font-semibold text-gray-800 shadow hover:bg-gray-100">
                                        <a href="#">Learn More</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full flex-col items-center pb-10">
                            <div className="space-y-5">
                                <h2 className="max-w-md text-center text-3xl font-bold text-gray-700 md:text-left lg:text-4xl">
                                    Improve the state of Defi lending
                                </h2>
                                <p className="max-w-md text-center text-gray-700 md:text-left">
                                    Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
                                    lorem cupidatat commodo.
                                </p>
                                <div className="flex w-full justify-center md:justify-start">
                                    <div className="rounded border border-gray-400 bg-white py-2 px-4 font-semibold text-gray-800 shadow hover:bg-gray-100">
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
