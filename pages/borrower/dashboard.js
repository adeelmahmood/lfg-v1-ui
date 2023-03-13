import TopGradient from "../../components/ui/TopGradient";
import BottomGradient from "../../components/ui/BottomGradient";
import Navbar from "../../components/Navbar";
import AllProposalsListing from "../../components/borrower/AllProposalsListing";
import { useState } from "react";
import DialogComponent from "../../components/ui/DialogComponent";

export default function BorrowerDashboard() {
    const [fakeDataDialog, showFakeDataDialog] = useState();

    return (
        <>
            <TopGradient />
            <Navbar />

            <div className="mt-4 flex items-center justify-center">
                <div className="flex items-center">
                    <a
                        href="/borrower/dashboard"
                        className="mr-2 block rounded bg-indigo-200 px-4 py-2 font-semibold text-indigo-600 hover:bg-indigo-500 hover:text-white dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-600"
                    >
                        All Propopsals
                    </a>
                    <span className="hidden w-0.5 bg-gray-600/25 dark:bg-gray-400/25 sm:block">
                        &nbsp;
                    </span>
                    <a
                        href="/borrower/approved"
                        className="ml-2 block rounded px-4 py-2 font-semibold text-indigo-600 hover:bg-indigo-500 hover:text-white  dark:text-gray-300 dark:hover:bg-slate-600"
                    >
                        Approved Loans
                    </a>
                </div>
            </div>

            <div className="container mx-auto p-6">
                <div className="mt-4 mb-4 flex items-center justify-between md:mt-2">
                    <h2 className="max-w-6xl text-5xl font-bold tracking-wider text-white">
                        <span className="bg-gradient-to-r from-indigo-500 to-green-600 bg-clip-text text-transparent">
                            Borrwer Dashboard
                        </span>
                    </h2>
                </div>

                <p className="mt-2 text-left leading-8 text-gray-600 dark:text-gray-300">
                    Create a new loan proposal and let it go through the community approval process
                    to see if it gets approved.
                </p>

                <div className="mt-4 flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:space-x-4">
                    <a href="/borrower/proposals/create" className="btn-primary">
                        Create New Loan Proposal
                    </a>
                    <button className="btn-clear" onClick={() => showFakeDataDialog(true)}>
                        Create Fake Data
                    </button>
                </div>

                <DialogComponent
                    isModelOpen={fakeDataDialog}
                    modelCloseHandler={() => showFakeDataDialog(false)}
                    heading="Create Proposals With Fake Data"
                >
                    <div className="flex flex-col gap-4 p-4">
                        <a
                            href="/borrower/proposals/create-sample?type=simple"
                            className="rounded-lg border px-4 py-2 hover:underline"
                        >
                            Create simple proposal
                        </a>
                        <a
                            href="/borrower/proposals/create-sample?type=crypto-payout"
                            className="rounded-lg border px-4 py-2 hover:underline"
                        >
                            Create proposal with crypto payout
                        </a>
                        <a
                            href="/borrower/proposals/create-sample?type=fiat-payout"
                            className="rounded-lg border px-4 py-2 hover:underline"
                        >
                            Create proposal with fiat payout
                        </a>
                    </div>
                </DialogComponent>

                <AllProposalsListing />
            </div>

            <BottomGradient />
        </>
    );
}
