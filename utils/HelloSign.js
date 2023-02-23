let client;

export const getHelloSignClient = async () => {
    if (!client) {
        const HelloSign = (await import("hellosign-embedded")).default;
        client = new HelloSign({
            allowCancel: false,
            clientId: process.env.NEXT_PUBLIC_HELLOSIGN_CLIENT_ID,
            skipDomainVerification: true,
        });
    }
    return client;
};

export const generateSignatureRequest = async (params) => {
    const response = await fetch("/api/hellosign/generate-sign-request", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    });

    const data = await response.json();
    if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
    }

    return data.embedded?.signUrl;
};
