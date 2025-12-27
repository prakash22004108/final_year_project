const axios = require('axios');
require('dotenv').config();

const MODEL = process.env.OLLAMA_MODEL || "deepseek-r1:1.5b";
const URL = "http://localhost:11434/api/generate";

console.log(`[Ollama Service] Initialized using model: ${MODEL}`);

// Helper: Clean JSON from potential markdown or extra text
const cleanJSON = (text) => {
    try {
        let clean = text.replace(/```json|```/g, "").trim();
        // Remove thinking tokens if any (DeepSeek sometimes has <think> tags, though standard output usually doesn't if not streamed? 
        // We will assume standard text. 
        // Regex to find the first '{' and last '}'
        const firstOpen = clean.indexOf('{');
        const lastClose = clean.lastIndexOf('}');
        if (firstOpen !== -1 && lastClose !== -1) {
            clean = clean.substring(firstOpen, lastClose + 1);
        }
        return JSON.parse(clean);
    } catch (e) {
        return null;
    }
};

const callOllama = async (prompt, format = 'json') => {
    try {
        const payload = {
            model: MODEL,
            prompt: prompt,
            stream: false,
            format: format // Ollama supports 'json' mode which triggers constrained sampling
        };

        const res = await axios.post(URL, payload);

        if (!res.data || !res.data.response) {
            throw new Error("Empty response from Ollama");
        }

        return res.data.response;
    } catch (err) {
        console.error("Ollama Connection Error:", err.message);
        if (err.code === 'ECONNREFUSED') {
            throw new Error("Ollama is not running! Run 'ollama serve' or open the Ollama app.");
        }
        throw err;
    }
};

exports.classifyIntent = async (text) => {
    const prompt = `
    Analyze this grievance and return a JSON object with:
    - category: (Road, Water, Electricity, Corruption, RTI, Other)
    - urgency: (Complaint, Scam Alert, RTI Request, Status Check)
    - confidence: (0.0 to 1.0)
    - action_words: [list of verbs/nouns]
    - explanation: (short reason)

    User Input: "${text}"
    
    Respond ONLY with JSON.
    `;

    try {
        const response = await callOllama(prompt, 'json');
        const json = cleanJSON(response);
        if (!json) throw new Error("Failed to parse JSON");
        return json;
    } catch (err) {
        console.error("Intent Classification Failed:", err.message);
        return { category: "General", urgency: "Complaint", confidence: 0, action_words: [] };
    }
};

exports.extractNER = async (text) => {
    const prompt = `
    Extract entities from this text into JSON:
    - persons: []
    - locations: []
    - organizations: []
    - dates: []
    - money: []

    User Input: "${text}"

    Respond ONLY with JSON.
    `;

    try {
        const response = await callOllama(prompt, 'json');
        const json = cleanJSON(response);
        return json || { persons: [], locations: [], organizations: [] };
    } catch (err) {
        console.error("NER Extraction Failed:", err.message);
        return {};
    }
};

exports.draftRTI = async (userText, intent, ner) => {
    const prompt = `
    Write a formal Indian RTI Application (Right to Information Act 2005) to the Public Information Officer.
    
    Context:
    - Issue: ${userText}
    - Category: ${intent.category}
    - Details: ${JSON.stringify(ner)}

    Structure:
    1. To The PIO, [Department]
    2. Subject
    3. Respect Sir/Madam
    4. Body (ask specific questions)
    5. Closing

    Do NOT output JSON. Output the letter text only.
    `;

    try {
        // For writing tasks, we don't enforce JSON format
        const response = await callOllama(prompt, '');
        return response;
    } catch (err) {
        return `[Drafting Failed] ${err.message}`;
    }
};
