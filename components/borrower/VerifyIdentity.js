import getStripe from "../../utils/Stripe";

export default function VerifyIdentity({
    loanProposal,
    setLoanProposal,
    handlePrev,
    handleNext,
    ...rest
}) {
    const startVerification = async () => {
        const stripe = await getStripe();

        const response = await fetch("/api/stripe/verifyIdentity", { method: "POST" });
        const session = await response.json();

        const { error } = await stripe.verifyIdentity(session.clientSecret);
        if (error && error.message) {
            alert(error.message);
        } else {
            // verification completed
            console.log("verification completed successfully");
        }
    };

    return (
        <>
            <div className="w-full max-w-2xl bg-white/25 px-8 pt-6 pb-8 shadow-md" {...rest}>
                <h2 className="text-3xl font-bold">Verify your identity </h2>
                <div className="mt-6">
                    <button
                        className="mt-2 rounded-lg border border-gray-400 bg-gray-100 py-1 px-4 text-gray-800 shadow hover:bg-gray-100 md:font-semibold"
                        onClick={startVerification}
                    >
                        Start Verification
                    </button>
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
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
