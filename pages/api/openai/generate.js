import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
    if (!configuration.apiKey) {
        res.status(500).json({
            error: {
                message: "OpenAI API key not configured, please follow instructions in README.md",
            },
        });
        return;
    }

    const action = req.body.action || "tagline";
    const description = req.body.text || "";
    if (description.trim().length === 0) {
        res.status(400).json({
            error: {
                message: "Please enter a valid description",
            },
        });
        return;
    }

    if (!["tagline", "summarize", "emphasize"].includes(action)) {
        res.status(400).json({
            error: {
                message: "Please enter a valid action (tagline or summarize)",
            },
        });
        return;
    }

    try {
        let completion;

        if (action == "tagline") {
            completion = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: generateTaglinePrompt(description),
                temperature: 0.6,
            });
        } else if (action == "summarize") {
            completion = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: generateReSummarizePrompt(description),
                temperature: 0.3,
                max_tokens: 150,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
        } else if (action == "emphasize") {
            completion = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: generateEmphasizePrompt(description),
                temperature: 0.7,
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
        }

        res.status(200).json({ result: completion?.data?.choices[0].text });
    } catch (error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: "An error occurred during your request.",
                },
            });
        }
    }
}

function generateTaglinePrompt(description) {
    return `Write a tagline for given description of a business

Description: an ice cream shop
Tagline: We serve up smiles with every scoop!
Description: ${description}
Tagline:`;
}

function generateReSummarizePrompt(description) {
    return `Please rewrite the following description of a business in a formal and elegant manner, making sure to convey the company's mission, values, and the products or services they offer:

${description}

`;
}

function generateEmphasizePrompt(description) {
    return `Please rewrite the following reason for a loan in a formal and elegant manner, making sure the company's mission and value are highlighted, and that the lenders to be able to develop a sense of compassion towards the need for money:

${description}

`;
}
