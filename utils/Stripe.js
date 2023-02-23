import { loadStripe } from "@stripe/stripe-js";

let stripePromise;

export const getStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    }
    return stripePromise;
};

export const stripeVerification = async (params) => {
    const stripe = await getStripe();

    const response = await fetch("/api/stripe/verifyIdentity", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    });
    const session = await response.json();

    const { error } = await stripe.verifyIdentity(session.clientSecret);
    return error;
};

export default getStripe;
