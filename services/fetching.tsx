import { isSignedIn, getToken } from '@/services/auth';
const API_VERSION = "v1";
// const API_ENDPOINT = `https://knowing-engaging-hare.ngrok-free.app/kopkar/api/${API_VERSION}/`;
const API_ENDPOINT = `https://calm-literally-beetle.ngrok-free.app/kopkar/api/${API_VERSION}/`;

const TIMEOUT = 25000; // Timeout 25 detik
const DELAY = 1000; // Delay 1 detik sebelum retry
const RETRY = 3; // Retru 3 kali

interface FetchOptions {
    headers?: { [key: string]: string };
    method?: string;
    body?: string;
}

// Create an async function to get headers with token if signed in
const getAuthHeaders = async (options: FetchOptions) => {
    const signedIn = await isSignedIn();
    const headers: { [key: string]: string } = {
        ...options.headers,
    };

    if (signedIn) {
        const token = await getToken();
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
};

export async function fetchWithTimeout(
    endpoint: string,
    options: FetchOptions = {},
    timeout = TIMEOUT
): Promise<Response> {
    const mode: RequestMode = "cors";

    const headers = await getAuthHeaders(options);

    const updatedOptions = { ...options, headers, mode };

    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), timeout)
    );

    const url = `${API_ENDPOINT}${endpoint}`;
    return Promise.race([fetch(url, updatedOptions), timeoutPromise]) as Promise<Response>;
}

export async function fetchWithRetry(
    endpoint: string,
    options = {},
    retries = RETRY,
    delay = DELAY,
    timeout = TIMEOUT
) {
    for (let i = 1; i <= retries; i++) {
        try {
            const response: Response = await fetchWithTimeout(
                endpoint,
                options,
                timeout
            );
            let responseData;
            try {
                responseData = await response.json();
            } catch (jsonError) {
                responseData = { message: await response.text() };
            }

            if (!response.ok) {
                throw new Error(JSON.stringify(responseData));
            }

            return responseData;
        } catch (error: any) {
            let errorData = {
                message: "An error occurred while parsing the error",
                statusCode: 500,
            };

            try {
                if (typeof error === "string") {
                    errorData = JSON.parse(error);
                } else if (error && error.message) {
                    let err = JSON.parse(error.message);
                    errorData = { message: err.message, statusCode: err.statusCode || 500 };
                }
            } catch (jsonError) {
                errorData = { message: "An error occurred while parsing the error", statusCode: 500 };
            }

            if (i < retries) {
                await new Promise((res) => setTimeout(res, delay));
            } else if (i === retries) {
                return { message: errorData.message, statusCode: errorData.statusCode };
            } else {
                throw new Error(
                    `Failed after ${retries} attempts: ${errorData.message}`
                );
            }
        }
    }
}
