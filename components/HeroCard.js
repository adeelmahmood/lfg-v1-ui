export default function HeroCard({ heading, description, imgSrc, imgAltText, tags, status }) {
    return (
        <>
            <div className="w-full space-y-5 overflow-hidden rounded shadow-lg">
                <div className="relative bg-red-400 pb-2/3">
                    <img
                        className="absolute h-full w-full object-cover object-center"
                        src={imgSrc}
                        alt={imgAltText}
                    />
                </div>
                <div className="px-6 py-4">
                    <div className="mb-2 text-xl font-bold">{heading}</div>
                    <p className="text-base text-gray-700">{description}</p>
                </div>
                <div className="px-6 pb-2">
                    {tags?.map((tag) => {
                        return (
                            <span className="mr-2 mb-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
                                {tag}
                            </span>
                        );
                    })}

                    {status && (
                        <span className="mr-2 mb-2 inline-block rounded-full bg-green-800 px-3 py-1 text-sm font-semibold text-white">
                            Completed
                        </span>
                    )}
                </div>
            </div>
        </>
    );
}
