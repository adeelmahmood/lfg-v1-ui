import { ArrowLongRightIcon } from "@heroicons/react/24/solid";
import { Fragment, useEffect, useState } from "react";
import { createApi } from "unsplash-js";

export default function GatherImages({ loanProposal, setLoanProposal, handle, ...rest }) {
    const unsplashApi = createApi({
        accessKey: process.env.NEXT_PUBLIC_UNSPLASH_API_KEY,
    });

    const PhotoComp = ({ photo }) => {
        const { user, urls } = photo;

        return (
            <Fragment>
                <div>
                    <div className="relative pb-2/3">
                        <img
                            className="absolute h-full w-full object-cover object-center"
                            src={urls.regular}
                        />
                    </div>
                    {/* <img src={urls.regular} className="aspect-square object-cover object-center" /> */}
                    <a
                        className="text-sm text-gray-600"
                        target="_blank"
                        href={`https://unsplash.com/@${user.username}`}
                    >
                        by {user.name}
                    </a>
                </div>
            </Fragment>
        );
    };

    const [photos, setPhotos] = useState(null);

    useEffect(() => {
        unsplashApi.search
            .getPhotos({ query: loanProposal.title, orientation: "squarish", perPage: 6 })
            .then((result) => {
                setPhotos(result.response ? result.response : result);
            })
            .catch((e) => console.log("unable to fetch images", e));
    }, []);

    return (
        <>
            <div className="mb-8 w-full px-8" {...rest}>
                <h2 className="text-3xl font-bold text-gray-700">Attach Some Pictures</h2>
                <p className="mt-4 max-w-2xl text-left leading-8 text-gray-600">
                    Attaching some pictures will be nice for your proposal home page. Search by
                    keywords associated to your business or upload your own pictures
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4 rounded-lg border-2 border-gray-500 px-4 py-3 md:grid-cols-3">
                    {!photos && <div className="font-semibold">Loading ...</div>}
                    {photos?.results?.map((p) => (
                        <PhotoComp photo={p} />
                    ))}
                </div>

                <div className="mt-4">
                    <button
                        className="w-full rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={handle}
                    >
                        Next <ArrowLongRightIcon className="inline h-6 fill-current text-white" />
                    </button>
                </div>
            </div>
        </>
    );
}
