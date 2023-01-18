export default function ReviewAndSubmit({ loanProposal, setLoanProposal, handle, ...rest }) {
    let USDollar = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    return (
        <>
            <div className="w-full max-w-2xl bg-white/25 px-8 pt-6 pb-8 shadow-md" {...rest}>
                <h2 className="text-3xl font-bold text-gray-700">Review and Submit</h2>

                <div className="mt-6 mb-10">
                    <div className="mb-4 w-full">
                        <div className="text-sm font-medium text-gray-600">
                            Title for loan proposal:
                        </div>
                        <div class="text-gray-800">{loanProposal.title}</div>
                    </div>
                    <div className="mb-4 w-full">
                        <div className="text-sm font-medium text-gray-600">
                            Business or work description:
                        </div>
                        <p class="font-light text-gray-800">{loanProposal.business}</p>
                    </div>
                    <div className="mb-4 w-full">
                        <div className="text-sm font-medium text-gray-600">
                            Reasoning for the loan:
                        </div>
                        <p class="font-light text-gray-800">{loanProposal.reasoning}</p>
                    </div>
                    <div className="mb-4 w-full">
                        <div className="text-sm font-medium text-gray-600">
                            Amount needed (in USD):
                        </div>
                        <div className="text-gray-800">{USDollar.format(loanProposal.amount)}</div>
                    </div>
                </div>

                <div className="mt-4">
                    <button
                        className="w-full rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={handle}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </>
    );
}
