export default function TellUsAboutYourself({
    loanProposal,
    setLoanProposal,
    handleNext,
    ...rest
}) {
    return (
        <>
            <div className="w-full max-w-2xl bg-white/25 px-8 pt-6 pb-8 shadow-md" {...rest}>
                <h2 className="text-3xl font-bold">Tell us about yourself</h2>
                <div className="mt-6">
                    <label className="mb-2 block text-sm font-bold text-gray-800">
                        A title for your loan proposal
                    </label>
                    <input
                        className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                        id="title"
                        type="text"
                        placeholder="Title for loan proposal"
                        onChange={(e) => {
                            setLoanProposal({
                                ...loanProposal,
                                title: e.target.value,
                            });
                        }}
                        value={loanProposal.title}
                        required
                    />
                </div>
                <div className="mt-4 flex flex-col">
                    <label className="mb-2 block text-sm font-bold  text-gray-800">
                        Detailed reasoning for the loan proposal
                    </label>
                    <textarea
                        className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                        rows={15}
                        placeholder="Reasoning for the loan"
                        onChange={(e) => {
                            setLoanProposal({
                                ...loanProposal,
                                reasoning: e.target.value,
                            });
                        }}
                        value={loanProposal.reasoning}
                    ></textarea>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <a href="#" className="text-xs font-semibold text-indigo-700">
                        Need help filling this out?
                    </a>
                    <button
                        className="rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold 
                                            leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700"
                        onClick={handleNext}
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
}
