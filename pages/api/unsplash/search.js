import { createApi } from "unsplash-js";

const unsplashApi = createApi({
    accessKey: process.env.UNSPLASH_API_KEY,
});

export default async function handler(req, res) {
    const q = req.query;
    const { query, page = 1, perPage = 6, orientation = "squarish" } = q;
    let results;

    await unsplashApi.search
        .getPhotos({
            query,
            orientation,
            perPage,
            page,
        })
        .then((result) => {
            results = result.response;
        })
        .catch((e) => {
            console.log("unable to fetch images", e);
            res.status(500).json({ error: e.message });
        });

    res.status(200).json(results);
}
