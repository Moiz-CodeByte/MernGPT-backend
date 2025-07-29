import { Groq } from "groq-sdk";

export const configureOpenAI = () => {
    const groq = new Groq({
        apiKey: process.env.GROK_API_KEY
    });
    return groq;
}