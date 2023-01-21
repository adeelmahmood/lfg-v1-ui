import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

export default function ViewProposal({ loanProposal, ...rest }) {
    const supabase = useSupabaseClient();
    const user = useUser();

    const [bannerImage, setBannerImage] = useState();

    let USDollar = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    const getSelected = (value, genValue, manFlag, genFlag) => {
        if (genFlag) return genValue;
        if (manFlag) return value;
    };

    useEffect(() => {
        const loadImage = async () => {
            let bImage = loanProposal.banner_image;
            if (bImage && !bImage.startsWith("http")) {
                const { data, error } = await supabase.storage
                    .from("loanproposals")
                    .getPublicUrl(bImage);
                if (data) {
                    bImage = data.publicUrl;
                }
            }
            setBannerImage(bImage);
        };
        if (user) loadImage();
    }, [user]);

    return (
        <>
            <div className="mt-10 mb-10">
                <div className="mb-10 flex items-center justify-center">
                    <div className="block h-24 w-24 overflow-hidden rounded-full border-2 border-indigo-400 hover:shadow-md focus:outline-none">
                        <img
                            src={user?.user_metadata.avatar_url}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="ml-5 flex flex-col">
                        <span className="font-semibold">{user?.user_metadata.full_name}</span>
                        <span className="text-sm text-gray-500">CEO of Some Company</span>
                        <span className="text-sm text-gray-500">Jan 20th 2023</span>
                    </div>
                </div>
                <h2 className="text-left text-4xl font-bold uppercase md:text-center md:text-5xl md:tracking-wider">
                    {getSelected(
                        loanProposal.business_title,
                        loanProposal.business_tagline,
                        loanProposal.tagline_manual_picked,
                        loanProposal.tagline_gen_picked
                    )}
                </h2>
                <div className="relative mt-6 pb-2/3 shadow-lg">
                    <img
                        className="absolute h-full w-full rounded-xl object-cover object-center"
                        src={bannerImage}
                        alt=""
                    />
                </div>
                <div className="mt-6">
                    <p className="text-gray-500">
                        {getSelected(
                            loanProposal.business_description,
                            loanProposal.business_gen_description,
                            loanProposal.description_manual_picked,
                            loanProposal.description_gen_picked
                        )}
                    </p>
                </div>

                <div className="mt-6">
                    <p className="text-gray-800">
                        {getSelected(
                            loanProposal.loan_reasoning,
                            loanProposal.loan_gen_reasoning,
                            loanProposal.reasoning_manual_picked,
                            loanProposal.reasoning_gen_picked
                        )}
                    </p>
                </div>

                <div className="mt-6 font-semibold">
                    <p>Loan Amount Requested: {USDollar.format(loanProposal.amount)}</p>
                </div>
            </div>
        </>
    );
}
