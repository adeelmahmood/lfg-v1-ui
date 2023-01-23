import { Inter } from "@next/font/google";
import Link from "next/link";
import TopGradient from "../components/TopGradient";
import BottomGradient from "../components/BottomGradient";
import Navbar from "../components/Navbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import HeroCard from "../components/HeroCard";
import { useUser } from "@supabase/auth-helpers-react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const user = useUser();

    return (
        <>
            <TopGradient />
            <Navbar />

            <div className="container relative mx-auto p-6">
                <section id="hero">
                    <div className="mx-auto w-full max-w-screen-xl pt-10 pb-10 sm:pt-20">
                        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
                            <div className="flex flex-col items-center justify-center md:col-span-7">
                                <h2 className="max-w-6xl text-6xl font-bold tracking-tight text-white md:tracking-wider lg:text-center lg:text-7xl">
                                    <span className="bg-gradient-to-r from-indigo-500 to-green-600 bg-clip-text text-transparent">
                                        Enter the Social Marketplace for Lending
                                    </span>
                                </h2>

                                <div className="overflow:hidden mt-10 flex md:hidden">
                                    <div className="relative">
                                        <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-br from-yellow-600 to-green-300 opacity-75 blur-sm"></div>
                                        <img
                                            src="/images/eth-garden-ent.png"
                                            alt="Social markplace for lending"
                                            className="aspect-square relative max-w-xs rounded-lg object-cover object-center shadow-lg"
                                        />
                                    </div>
                                </div>
                                <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 sm:text-center">
                                    Unlock the power of your digital assets. Our platform allows you
                                    to lend and borrow a variety of cryptocurrencies with ease and
                                    security. Enjoy competitive interest rates and flexible terms on
                                    your loans, all while keeping your assets in your own wallet.
                                </p>
                                <p className="text-lg leading-8 text-gray-600 dark:text-gray-300 sm:text-center">
                                    Sign up now and start earning on your digital assets today!
                                </p>
                                <div className="mt-6 flex gap-x-4 sm:justify-center">
                                    {!user && (
                                        <Link
                                            href="/dashboard"
                                            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold 
                                            leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700 dark:bg-slate-800 dark:ring-slate-700 dark:hover:bg-slate-700 dark:hover:ring-slate-800"
                                        >
                                            Login
                                        </Link>
                                    )}
                                    <div className="">
                                        <ConnectButton />
                                    </div>
                                </div>
                            </div>
                            <div className="overflow:hidden hidden md:col-span-5 md:col-start-8 md:flex">
                                <div className="relative -z-10">
                                    <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-br from-yellow-600 to-green-300 opacity-75 blur-sm"></div>
                                    <img
                                        src="/images/eth-garden-ent.png"
                                        alt="Social markplace for lending"
                                        className="aspect-square relative rounded-lg object-cover object-center shadow-lg md:h-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="lendersHeroSection">
                    <div className="container mx-auto mt-10 max-w-screen-lg">
                        <h2 className="max-w-6xl text-6xl font-bold text-white lg:text-7xl">
                            <span className="bg-gradient-to-r from-indigo-500 to-green-600 bg-clip-text tracking-tight text-transparent">
                                What can you do as a Lender?
                            </span>
                        </h2>
                        <div className="mt-10 grid grid-cols-1 items-start gap-8 sm:mt-20 sm:grid-cols-2 sm:justify-items-center sm:gap-24">
                            <HeroCard
                                heading="Earn yield on your deposits"
                                description="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                    Voluptatibus quia, nulla! Maiores et perferendis eaque,
                                    exercitationem praesentium nihil."
                                imgSrc="/images/moneyjar.jpg"
                                imgAltText="Earn yield"
                                tags={["Aave", "Compound"]}
                                status={true}
                            />

                            <HeroCard
                                heading="Interact with borrowers and other lenders"
                                description="Maiores et perferendis eaque,
                                    exercitationem praesentium nihil."
                                imgSrc="/images/hands.jpg"
                                imgAltText="Earn yield"
                                tags={["Vote", "Review"]}
                            />

                            <HeroCard
                                heading="Learn about the work that borrowers are doing"
                                description="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                    Voluptatibus quia, nulla."
                                imgSrc="/images/taking-notes.jpg"
                                imgAltText="Earn yield"
                                tags={["Learn", "Get Involved"]}
                            />

                            <HeroCard
                                heading="Vote on borrowing proposals"
                                description="Maiores et perferendis eaque,
                                    exercitationem praesentium nihil."
                                imgSrc="/images/vote.jpg"
                                imgAltText="Earn yield"
                                tags={["Governance"]}
                            />
                        </div>
                        <div className="mt-20">
                            <h2 className="text-left text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-300 md:text-center md:text-4xl md:tracking-normal">
                                Ready to start lending in the protocol?
                            </h2>
                            <div className="mt-6 flex gap-x-4 sm:justify-center">
                                <Link
                                    href="/dashboard"
                                    className="inline-block rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold 
                                            leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700 dark:bg-slate-800 dark:ring-slate-700 dark:hover:bg-slate-700 dark:hover:ring-slate-800"
                                >
                                    Become a Lender
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="mt-20 h-1 bg-gradient-to-r from-indigo-200 to-indigo-100 dark:from-slate-600 dark:to-slate-800" />

                <section id="borrowersHeroSection">
                    <div className="container mx-auto mt-20 max-w-screen-lg">
                        <h2 className="max-w-6xl text-6xl font-bold text-white lg:text-7xl">
                            <span className="bg-gradient-to-r from-indigo-500 to-green-600 bg-clip-text tracking-tight text-transparent">
                                What can you do as a Borrower?
                            </span>
                        </h2>
                        <div className="mt-10 grid grid-cols-1 items-start gap-8 sm:mt-20 sm:grid-cols-2 sm:justify-items-center sm:gap-24">
                            <HeroCard
                                heading="Submit loan proposal for community"
                                description="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                    Voluptatibus quia, nulla! Maiores et perferendis eaque,
                                    exercitationem praesentium nihil."
                                imgSrc="/images/proposal.jpg"
                                imgAltText="Create Proposals"
                                tags={["Loan Proposal"]}
                                status={true}
                            />

                            <HeroCard
                                heading="Zero to low collateral lending"
                                description="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                    Voluptatibus quia, nulla! Maiores et perferendis eaque,
                                    exercitationem praesentium nihil."
                                imgSrc="/images/chilling.jpg"
                                imgAltText="Earn yield"
                                tags={["Conventional Lending"]}
                            />

                            <HeroCard
                                heading="Make payments using fiat"
                                description="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                    Voluptatibus quia, nulla! Maiores et perferendis eaque,
                                    exercitationem praesentium nihil."
                                imgSrc="/images/credit-card-computer.jpg"
                                imgAltText="Earn yield"
                                tags={["Buy Crypto"]}
                            />

                            <HeroCard
                                heading="Find ongoing support from investors"
                                description="Maiores et perferendis eaque,
                                    exercitationem praesentium nihil."
                                imgSrc="/images/piggybank.jpg"
                                imgAltText="Earn yield"
                                tags={["Investors", "Support"]}
                            />
                        </div>
                        <div className="mt-20">
                            <h2 className="text-left text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-300 md:text-center md:text-4xl md:tracking-normal">
                                Ready to sign up and submit a loan proposal?
                            </h2>
                            <div className="mt-6 flex gap-x-4 sm:justify-center">
                                <Link
                                    href="/borrower/dashboard"
                                    className="inline-block rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold 
                                            leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700 dark:bg-slate-800 dark:ring-slate-700 dark:hover:bg-slate-700 dark:hover:ring-slate-800"
                                >
                                    Become a Borrower
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="mt-20 h-1 bg-gradient-to-r from-indigo-200 to-indigo-100 dark:from-slate-600 dark:to-slate-800" />

                <BottomGradient />
            </div>
        </>
    );
}
