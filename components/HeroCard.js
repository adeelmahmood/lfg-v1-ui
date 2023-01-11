export default function HeroCard({ heading, description, imgSrc, imgAltText, tags }) {
    return (
        <>
            <div class="w-full space-y-5 overflow-hidden rounded shadow-lg">
                <img
                    className="aspect-square h-80 w-full object-cover object-center"
                    src={imgSrc}
                    alt={imgAltText}
                />
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
                </div>
            </div>
        </>
    );
}
