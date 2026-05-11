const axios = require('axios');
require('dotenv').config();  // Add this line


const getLanguageById = (lang) => {
    const language = {
        python: 109,
        "c++": 105,
        c: 103,
        javascript: 102,
        java: 91
    };
    return language[lang.toLowerCase()];
};

const waiting = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const submitBatch = async (submissions) => {
    // Check if API key exists
    if (!process.env.RAPIDAPI_KEY) {
        throw new Error("RAPIDAPI_KEY is not set in environment variables");
    }

    try {
        const response = await axios.post(
            'https://judge0-ce.p.rapidapi.com/submissions/batch',
            { submissions },
            {
                params: { base64_encoded: 'false' },
                headers: {
                    'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("SUBMIT BATCH ERROR:", error.response?.data || error.message);
        console.error("Status:", error.response?.status);
        console.error("Headers:", error.response?.headers);
        
        if (error.response?.status === 401) {
            throw new Error("Invalid or missing RapidAPI key. Please check your .env file and RapidAPI subscription.");
        }
        throw error;
    }
};

const submitToken = async (resultToken) => {
    if (!process.env.RAPIDAPI_KEY) {
        throw new Error("RAPIDAPI_KEY is not set in environment variables");
    }

    const options = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            tokens: resultToken.join(","),
            base64_encoded: 'false',
            fields: '*'
        },
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        }
    };

    while (true) {
        try {
            const response = await axios.request(options);
            const result = response.data;

            if (!result || !result.submissions) {
                throw new Error("Invalid Judge0 response");
            }

            const isResultObtained = result.submissions.every(
                (r) => r.status.id > 2
            );

            if (isResultObtained) {
                return result.submissions;
            }

            await waiting(1000);

        } catch (error) {
            console.error("SUBMIT TOKEN ERROR:", error.response?.data || error.message);
            throw error;
        }
    }
};

module.exports = {
    getLanguageById,
    submitBatch,
    submitToken
};