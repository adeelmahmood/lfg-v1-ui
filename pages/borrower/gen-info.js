import TopGradient from "../../components/TopGradient";
import BottomGradient from "../../components/BottomGradient";
import Navbar from "../../components/Navbar";
import { useUser } from "@supabase/auth-helpers-react";

export default function BorrowerGenInfo() {
    const user = useUser();
    console.log(user);

    return (
        <>
            <div className="container mx-auto p-6">
                <TopGradient />
                <Navbar />

                <section id="heading">
                    <div className="mt-5 flex items-center justify-between p-5 shadow sm:items-end md:flex-row md:items-center">
                        <h2 className="px-5 text-4xl font-semibold md:text-3xl">
                            Borrower Dashboard
                        </h2>
                    </div>
                    <div className="flex items-center justify-center">
                        <form className="mt-10 mb-4 w-[80%] rounded bg-zinc-300/25 px-8 pt-6 pb-8 shadow-md">
                            <div className="mb-8">
                                <label
                                    className="mb-2 flex justify-center text-sm font-bold text-gray-700"
                                    for="businessName"
                                >
                                    Provide a heading for your business
                                </label>
                                <input
                                    className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                                    id="businessName"
                                    type="text"
                                    placeholder="Business Title"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="mb-6">
                                <label
                                    className="mb-2 flex justify-center text-sm font-bold text-gray-700"
                                    for="password"
                                >
                                    Provide a detailed reason for requesting the loan
                                </label>
                                <textarea
                                    className="focus:shadow-outline mb-3 w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                                    id="reasoning"
                                    rows={10}
                                    placeholder="Loan Reasoning"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <a
                                    className="inline-block align-baseline text-sm font-bold text-blue-500 hover:text-blue-800"
                                    href="#"
                                >
                                    Need help filling this out?
                                </a>
                                <button
                                    className="focus:shadow-outline rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
                                    type="button"
                                >
                                    Next
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </>
    );
}
