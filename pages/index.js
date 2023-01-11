import { Inter } from "@next/font/google";
import { useAccount } from "wagmi";
import Link from "next/link";
import TopGradient from "../components/TopGradient";
import BottomGradient from "../components/BottomGradient";
import Navbar from "../components/Navbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import HeroCard from "../components/HeroCard";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        <>
            <div className="container relative mx-auto p-6">
                <TopGradient />
                <Navbar />

                <section id="hero">
                    <div className="mx-auto w-full max-w-screen-xl pt-10 pb-10 sm:pt-20">
                        <div className="grid grid-cols-1 gap-12 sm:grid-cols-12 sm:gap-8">
                            <div className="col-span-7 flex flex-col items-center justify-center">
                                <h1 className="text-5xl font-bold tracking-tight sm:text-center md:text-6xl md:tracking-normal">
                                    <span className="text-indigo-700">Enter</span> the Social
                                    Marketplace for
                                    <span className="pl-3 text-indigo-700">Lending</span>
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-center">
                                    Lend your crypto assets to earn yield from Aave. Interact with
                                    borrowers and get involved in the governance of the protocol.
                                    Review and vote on the loan proposals by borrowers. Learn about
                                    the work the borrowers are doing.
                                </p>
                                <div className="mt-6 flex gap-x-4 sm:justify-center">
                                    <Link
                                        href="/dashboard"
                                        className="rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold 
                                            leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700"
                                    >
                                        Launch App
                                    </Link>
                                    <div className="sm:hidden">
                                        <ConnectButton />
                                    </div>
                                </div>
                            </div>
                            <div className="overflow:hidden col-span-5 row-start-1 sm:col-start-8">
                                <div className="relative">
                                    <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-br from-stone-700 to-stone-300 opacity-75 blur-sm"></div>
                                    <img
                                        src="/images/garden-entrance.jpg"
                                        alt="Social markplace for lending"
                                        className="relative aspect-square h-96 w-full rounded-lg object-cover object-center shadow-lg md:h-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="lendersHeroSection">
                    <div className="container mx-auto mt-10 max-w-screen-xl">
                        <h2 className="text-left text-5xl font-bold tracking-tight md:text-center md:text-6xl md:tracking-normal">
                            What can you do as a Lender?
                        </h2>
                        <div className="mt-10 grid grid-cols-1 items-start gap-8 sm:mt-20 sm:grid-cols-2 sm:justify-items-center sm:gap-24">
                            <HeroCard
                                heading="Earn yield on your deposits"
                                description="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                    Voluptatibus quia, nulla! Maiores et perferendis eaque,
                                    exercitationem praesentium nihil."
                                imgSrc="/images/moneyjar.jpg"
                                imgAltText="Earn yield"
                                tags={["Aave", "Compound", "Another one"]}
                            />

                            <HeroCard
                                heading="Interact with borrowers and other lenders"
                                description="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                    Voluptatibus quia, nulla! Maiores et perferendis eaque,
                                    exercitationem praesentium nihil."
                                imgSrc="/images/hands.jpg"
                                imgAltText="Earn yield"
                                tags={["Vote", "Review"]}
                            />

                            <HeroCard
                                heading="Learn about the work that borrowers are doing"
                                description="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                    Voluptatibus quia, nulla! Maiores et perferendis eaque,
                                    exercitationem praesentium nihil."
                                imgSrc="/images/taking-notes.jpg"
                                imgAltText="Earn yield"
                                tags={["Learn", "Get Involved"]}
                            />

                            <HeroCard
                                heading="Vote on borrowing proposals"
                                description="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                    Voluptatibus quia, nulla! Maiores et perferendis eaque,
                                    exercitationem praesentium nihil."
                                imgSrc="/images/vote.jpg"
                                imgAltText="Earn yield"
                                tags={["Governance"]}
                            />
                        </div>
                    </div>
                </section>

                <section id="borrowersHeroSection">
                    <div className="container mx-auto mt-20 max-w-screen-xl">
                        <h2 className="text-left text-5xl font-bold tracking-tight md:text-center md:text-6xl md:tracking-normal">
                            What can you do as a Borrower?
                        </h2>
                        <div className="mt-10 grid grid-cols-1 items-start gap-8 sm:mt-20 sm:grid-cols-2 sm:justify-items-center sm:gap-24">
                            <HeroCard
                                heading="Zero to low colltareral lending"
                                description="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                    Voluptatibus quia, nulla! Maiores et perferendis eaque,
                                    exercitationem praesentium nihil."
                                imgSrc="/images/chilling.jpg"
                                imgAltText="Earn yield"
                                tags={["Conventional Lending"]}
                            />

                            <HeroCard
                                heading="Make payments using Fiat"
                                description="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                    Voluptatibus quia, nulla! Maiores et perferendis eaque,
                                    exercitationem praesentium nihil."
                                imgSrc="/images/credit-card-computer.jpg"
                                imgAltText="Earn yield"
                                tags={["Crypto On/Off Ramp"]}
                            />

                            <HeroCard
                                heading="Find ongoing support from investors"
                                description="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                    Voluptatibus quia, nulla! Maiores et perferendis eaque,
                                    exercitationem praesentium nihil."
                                imgSrc="/images/piggybank.jpg"
                                imgAltText="Earn yield"
                                tags={["Investors", "Support"]}
                            />
                        </div>
                    </div>
                </section>

                <div className="container mx-auto mt-20">
                    <div className="flex items-center justify-end gap-x-4">
                        <Link
                            href="/dashboard"
                            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold 
                                            leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700"
                        >
                            Launch App
                        </Link>
                        <div className="sm:hidden">
                            <ConnectButton />
                        </div>
                    </div>
                </div>

                <BottomGradient />
            </div>
        </>
    );
}
