import { ArrowLongRightIcon, MagnifyingGlassIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";
import { Fragment, useEffect, useState, useMemo } from "react";
import debounce from "lodash.debounce";

export default function GatherImages({ loanProposal, setLoanProposal, handle, ...rest }) {
    const appName = process.env.NEXT_PUBLIC_APP_NAME;

    const [bannerImage, setBannerImage] = useState();

    const PhotoComp = ({ photo }) => {
        const { user, urls } = photo;
        const selected = urls.regular === bannerImage;

        return (
            <Fragment>
                <div>
                    <div
                        className={`relative pb-2/3 ${
                            selected && "rounded-lg border-8 border-green-500"
                        }`}
                    >
                        <img
                            className="absolute h-full w-full object-cover object-center hover:cursor-pointer"
                            src={urls.regular}
                            onClick={() => setBannerImage(urls.regular)}
                        />
                        {selected && (
                            <CheckBadgeIcon className="absolute -top-5 -left-5 inline h-6 fill-current text-teal-600" />
                        )}
                    </div>
                    <a
                        className="text-sm text-gray-600"
                        target="_blank"
                        href={`https://unsplash.com/@${user.username}?utm_source=${appName}&utm_medium=referral`}
                    >
                        by {user.name}
                    </a>
                </div>
            </Fragment>
        );
    };

    const [photos, setPhotos] = useState(null);

    const fetchImages = async (event) => {
        const q = event?.target?.value ?? loanProposal.business_title;
        if (q) {
            const resp = await fetch(`/api/unsplash/search?query=${q}`);
            const response = await resp.json();
            setPhotos(response);
        }
    };

    const debouncedFetchImages = useMemo(() => debounce(fetchImages, 500), []);

    useEffect(() => {
        fetchImages();
    }, []);

    return (
        <>
            <div className="mb-8 w-full px-8" {...rest}>
                <h2 className="text-3xl font-bold text-gray-700">Banner image for your proposal</h2>
                <p className="mt-4 max-w-2xl text-left leading-8 text-gray-600">
                    Upload a banner image that will be featured on the loan proposal page
                </p>

                <div className="mt-6">
                    <label className="form-label mb-2 inline-block text-gray-700">
                        Upload Banner Image
                    </label>
                    <input
                        className="form-control m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                        type="file"
                        id="bannerImage"
                    />
                </div>

                <div className="mt-8 flex items-center">
                    <div className="flex-grow border-t border-gray-400"></div>
                    <span className="mx-4 flex-shrink text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-400"></div>
                </div>

                <p className="mt-8 max-w-2xl text-left leading-8 text-gray-600">
                    Use one of these images or search by keywords
                </p>

                <div className="mt-6 flex items-center rounded-lg border px-4 py-2">
                    <MagnifyingGlassIcon className="inline h-6 fill-current text-gray-800" />
                    <input
                        type="text"
                        className="ml-2 w-full appearance-none border-0 text-gray-600 focus:ring-0"
                        placeholder="Search by keywords"
                        onChange={debouncedFetchImages}
                    />
                </div>

                {photos && photos?.results && photos.results.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 gap-4 rounded-lg border-gray-500 px-4 py-3 md:grid-cols-2">
                        {photos?.results?.map((p) => (
                            <PhotoComp photo={p} />
                        ))}
                    </div>
                )}

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
