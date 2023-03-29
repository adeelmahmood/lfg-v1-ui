import TopGradient from "../../components/ui/TopGradient";
import BottomGradient from "../../components/ui/BottomGradient";
import Navbar from "../../components/Navbar";
import ApprovedProposalsListing from "../../components/borrower/ApprovedProposalsListing";

export default function BorrowerDashboard() {
    return (
        <>
            <TopGradient />
            <Navbar />

            <div className="mt-4 flex items-center justify-center">
                <div className="flex items-center">
                    <a
                        href="/borrower/dashboard"
                        className="mr-2 block rounded px-4 py-2 font-semibold text-indigo-600 hover:bg-indigo-500 hover:text-white  dark:text-gray-300 dark:hover:bg-slate-600"
                    >
                        All Propopsals
                    </a>
                    <span className="hidden w-0.5 bg-gray-600/25 dark:bg-gray-400/25 sm:block">
                        &nbsp;
                    </span>
                    <a
                        href="/borrower/approved"
                        className="ml-2 block rounded bg-indigo-200 px-4 py-2 font-semibold text-indigo-600 hover:bg-indigo-500 hover:text-white dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
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

                <h3 className="mt-6 text-3xl font-bold text-gray-700 dark:text-gray-300">
                    Approved Loans
                </h3>
                <p className="mt-2 text-left leading-8 text-gray-600 dark:text-gray-300">
                    This is the list of approved loans and the actions related to those loans.
                </p>

                <ApprovedProposalsListing />
            </div>

            <BottomGradient />
        </>
    );
}
