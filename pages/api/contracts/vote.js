export default async function (req, res) {
    if (false) {
        res.status(500).json({
            error: {
                message: "Something went wrong",
            },
        });
        return;
    }

    res.status(200).json({});
}
