import { ArrowLongRightIcon, MagnifyingGlassIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";
import { Fragment, useEffect, useState, useMemo } from "react";
import debounce from "lodash.debounce";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { SUPABASE_STORAGE_LOAN_PROPOSALS } from "../../utils/Constants";

export default function GatherImages({ loanProposal, setLoanProposal, handle, ...rest }) {
    const appName = process.env.NEXT_PUBLIC_APP_NAME;

    const [bannerImage, setBannerImage] = useState(loanProposal.banner_image);
    const [bannerImageMetadata, setBannerImageMetadata] = useState(
        loanProposal.banner_image_metadata
    );
    const [uploadBannerImage, setUploadBannerImage] = useState();

    const [isUploading, setIsUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState();

    const [isCompleted, setIsCompleted] = useState(false);

    const supabase = useSupabaseClient();
    const user = useUser();

    const PhotoComp = ({ photo }) => {
        const { user, urls } = photo;
        const selected = urls.regular === bannerImage;

        return (
            <Fragment>
                <div>
                    <div
                        className={`relative rounded-lg border-8 pb-2/3 ${
                            selected && "rounded-lg border-8 border-green-500"
                        }`}
                    >
                        <img
                            className="absolute h-full w-full object-cover object-center hover:cursor-pointer"
                            src={urls.regular}
                            onClick={() => {
                                if (bannerImage == urls.regular) {
                                    setBannerImage(null);
                                    setBannerImageMetadata({});
                                } else {
                                    setBannerImage(urls.regular);
                                    setBannerImageMetadata({
                                        photoCreditLink: `https://unsplash.com/@${user.username}?utm_source=${appName}&utm_medium=referral`,
                                        artistName: user.name,
                                    });
                                }
                            }}
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

    const uploadHandler = (e) => {
        setUploadBannerImage(e.target.files[0]);
    };

    const handleUpload = async () => {
        setIsUploading(true);
        setError(null);
        setSuccess(false);

        try {
            if (uploadBannerImage) {
                const { data, error } = await supabase.storage
                    .from(SUPABASE_STORAGE_LOAN_PROPOSALS)
                    .upload(
                        `${user.id}/banner-images/${uploadBannerImage.name}`,
                        uploadBannerImage,
                        { upsert: true }
                    );

                if (error && error.message) {
                    setError(error.message);
                } else {
                    setSuccess(true);

                    // get public url after upload
                    const { data: d, error: e } = await supabase.storage
                        .from(SUPABASE_STORAGE_LOAN_PROPOSALS)
                        .getPublicUrl(data.path);

                    if (e && e.message) {
                        setError(e.message);
                    } else {
                        setBannerImage(d.publicUrl);
                        setBannerImageMetadata({ path: data.path });
                    }
                }
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        if (loanProposal.business_title) fetchImages();
    }, []);

    useEffect(() => {
        setIsCompleted(bannerImage);
    }, [bannerImage]);

    const handleNext = async () => {
        setLoanProposal({
            ...loanProposal,
            banner_image: bannerImage,
            banner_image_metadata: bannerImageMetadata,
        });

        handle?.();
    };

    return (
        <>
            <div className="mb-8 w-full px-8" {...rest}>
                <h2 className="max-w-6xl text-4xl font-bold text-white">
                    <span className="bg-gradient-to-r from-indigo-500 to-green-600 bg-clip-text text-transparent">
                        Banner Image For Your Proposal
                    </span>
                </h2>
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
                        onChange={uploadHandler}
                    />
                    <button
                        className="mt-2 inline-flex rounded-lg border border-gray-400 bg-white py-2 px-4 text-gray-800 shadow hover:bg-gray-100 disabled:cursor-not-allowed  disabled:opacity-50"
                        disabled={!uploadBannerImage}
                        onClick={handleUpload}
                    >
                        Upload
                        {isUploading && (
                            <svg
                                className="text-indigo ml-3 h-5 w-5 animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        )}
                    </button>
                    {error && <p className="mt-2 text-red-500">{error}</p>}
                    {success && <p className="mt-2 text-green-500">Uploaded successfully</p>}
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
                    <div className="mt-6 grid grid-cols-1 gap-4 rounded-lg border-gray-500 md:grid-cols-2">
                        {photos?.results?.map((p, index) => (
                            <PhotoComp key={index} photo={p} />
                        ))}
                    </div>
                )}

                <div className="mt-4">
                    <button
                        className="w-full rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={handleNext}
                        disabled={!isCompleted}
                    >
                        Next <ArrowLongRightIcon className="inline h-6 fill-current text-white" />
                    </button>
                </div>
            </div>
        </>
    );
}
