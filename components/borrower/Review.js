export default function Review({ loanProposal, setLoanProposal, handlePrev, handleNext, ...rest }) {
    return (
        <>
            <div className="w-full max-w-2xl bg-white/25 px-8 pt-6 pb-8 shadow-md" {...rest}>
                <h2 className="text-3xl font-bold">Review And Submit</h2>
                <div className="mt-6">
                    <div class="flex justify-center">...</div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <a href="#" className="text-xs font-semibold text-indigo-700">
                        Need help filling this out?
                    </a>
                    <div>
                        <button
                            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold 
                                            leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700"
                            onClick={handlePrev}
                        >
                            Prev
                        </button>
                        <button
                            className="ml-4 rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold 
                                            leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700"
                            onClick={handleNext}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
