import TopGradient from "../../components/TopGradient";
import BottomGradient from "../../components/BottomGradient";
import Navbar from "../../components/Navbar";
import { useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";

export default function BorrowerGenInfo() {
    const user = useUser();

    const loans = [
        {
            title: "Requesting loan for climate change technologies",
            status: "Being Voted On",
        },
        {
            title: "May be something for starting another side business",
            status: "Pending",
        },
        {
            title: "Non profit arm of the company needs money too",
            status: "In Progress",
        },
    ];

    return (
        <>
            <TopGradient />
            <Navbar />
            <div className="container mx-auto p-6">
                <div className="mt-8 mb-4 flex items-center justify-between">
                    <h2 className="text-4xl font-bold">Borrower Dashboard</h2>
                    <a
                        href="/borrower/loanproposal"
                        className="rounded-lg border border-gray-400 bg-indigo-500 py-2 px-4 text-white hover:bg-indigo-700 md:font-semibold"
                    >
                        Create New Loan Proposal
                    </a>
                </div>

                <div className="mt-2 hidden overflow-x-auto rounded-lg shadow-md sm:flex">
                    <table className="w-full text-left text-sm text-gray-800">
                        <thead className="bg-slate-600 text-xs uppercase text-white">
                            <tr>
                                <th scope="col" className="py-3 px-6">
                                    Loan Proposals
                                </th>
                                <th scope="col" className="border-l py-3 px-6 text-center">
                                    Status
                                </th>
                                <th scope="col" className="border-l py-3 px-6 text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loans.map((loan, index) => {
                                return (
                                    <tr key={index} className="border-b bg-white hover:bg-gray-50">
                                        <td className="py-4 px-6">
                                            <a href="#" className="hover:text-indigo-600">
                                                {loan.title}
                                            </a>
                                        </td>
                                        <td className="py-4 px-6 text-center">{loan.status}</td>
                                        <td className="py-4 px-6 text-center">
                                            <a
                                                href="#"
                                                className="rounded-lg border border-gray-400 bg-gray-100 py-2 px-4 text-gray-800 shadow hover:bg-gray-100 md:font-semibold"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    showDepositModal(token);
                                                }}
                                            >
                                                Withdraw
                                            </a>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
