const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDYP4Xm2NjS83hFQy-Dvi02ae9cMFea4Pc";
const URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const INTENT_PROMPT = `
You are a highly reliable AI system designed for classifying citizen issues in India for a government grievance platform.
Your job is to analyze the user's message and generate a STRICTLY VALID JSON (machine-readable, no extra text).

Follow these instructions exactly:

--- CATEGORY (pick one) ---
"Road", "Water", "Electricity", "Health", "RTI",
"Corruption", "Land", "Scam", "Other"

--- URGENCY (pick one) ---
"Complaint", "Scam Alert", "RTI Request",
"Status Check", "Feedback"

--- CONFIDENCE ---
A float 0-1 representing certainty.

--- ACTION WORDS ---
Extract meaningful verbs/nouns from the message.

--- EXPLANATION ---
1–2 sentences explaining your classification.

--- OUTPUT FORMAT ---
Return ONLY raw JSON like:

{
  "category": "",
  "urgency": "",
  "confidence": 0.0,
  "action_words": [],
  "explanation": ""
}

No Markdown, no \`\`\`json, no extra text.

User message:
`;

const NER_PROMPT = `
You are an expert NER (Named Entity Extraction) AI designed for Indian citizen complaint processing.

Extract ONLY the entities actually present in the user’s message.

Required output format (STRICT JSON, no markdown, no explanations):

{
  "persons": ["names"],
  "locations": ["locations"],
  "dates": ["dates"],
  "money": ["amounts"],
  "organizations": ["orgs/departments"],
  "projects": ["project or scheme names"]
}

Rules:
- Do NOT generate fields if they do not exist. Only include detected ones.
- No empty arrays.
- No extra text.
- No markdown.
- No commentary.
- Entity values must be EXACTLY as they appear in the user's message.

User message:
`;

// ===================================================
// 2. STRICT JSON SCHEMA VALIDATION
// ===================================================
const validateIntentSchema = (obj) => {
    const requiredFields = ["category", "urgency", "confidence", "action_words", "explanation"];
    for (const field of requiredFields) {
        if (!obj.hasOwnProperty(field)) return { valid: false, msg: `Missing field: ${field}` };
    }
    return { valid: true, msg: "OK" };
};

// ===================================================
// 3. CLEAN JSON FROM MODEL TEXT
// ===================================================
const cleanJSON = (text) => {
    let clean = text.replace(/```json|```/g, "").trim();
    clean = clean.replace(/\n/g, " ").trim();
    const match = clean.match(/\{.*\}/s);
    if (match) clean = match[0];
    return clean;
};

// ===================================================
// LOGGING
// ===================================================
const logRequest = (type, input, output, error = null) => {
    console.log(`\n\x1b[36m=========== ${type} LOG ===========\x1b[0m`);
    console.log(`\x1b[33m📝 USER INPUT:\x1b[0m "${input}"`);
    if (error) {
        console.log(`\x1b[31m❌ ERROR:\x1b[0m ${error}`);
    } else {
        console.log(`\x1b[32m🤖 OUTPUT:\x1b[0m`, JSON.stringify(output, null, 2));
    }
    console.log(`\x1b[36m====================================\x1b[0m\n`);
};

// ===================================================
// 4. CALL GEMINI + RETRY ON FAILURE
// ===================================================
const callGemini = async (promptText, maxRetries = 3) => {
    const payload = {
        contents: [{ parts: [{ text: promptText }] }]
    };

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const res = await axios.post(`${URL}?key=${API_KEY}`, payload, {
                headers: { 'Content-Type': 'application/json' }
            });

            const candidate = res.data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!candidate) throw new Error("Empty response from Gemini");

            const cleaned = cleanJSON(candidate);
            const parsed = JSON.parse(cleaned);

            return parsed; // Success
        } catch (err) {
            console.error(`[Gemini Retry ${attempt}/${maxRetries}] Failed:`, err.message);
            if (attempt === maxRetries) throw err;
            await new Promise(r => setTimeout(r, 1000)); // Sleep 1s
        }
    }
};

// ===================================================
// EXPORTS
// ===================================================

exports.classifyIntent = async (text) => {
    try {
        const prompt = INTENT_PROMPT + text;
        const result = await callGemini(prompt);

        // Validate Schema
        const validation = validateIntentSchema(result);
        if (!validation.valid) {
            console.warn("Intent Schema Warning:", validation.msg);
            // We might still use it or fallback, for now logging it.
        }

        logRequest("INTENT", text, result);
        return result;
    } catch (err) {
        logRequest("INTENT", text, null, err.message);
        // Fallback
        return { category: "General", urgency: "Complaint", confidence: 0, action_words: [], explanation: "Fallback due to AI Error" };
    }
};

exports.extractNER = async (text) => {
    try {
        const prompt = NER_PROMPT + text;
        const result = await callGemini(prompt);
        logRequest("NER", text, result);
        return result;
    } catch (err) {
        logRequest("NER", text, null, err.message);
        return { persons: [], locations: [], organizations: [], dates: [], money: [], projects: [] };
    }
};

exports.draftRTI = async (userText, intent, ner) => {
    const draftPrompt = `
    You are an expert RTI Filing Assistant for India.
    Your task is to write a formal RTI Application based on the following USER INPUT and ANALYZED DATA.
    
    USER INPUT: "${userText}"
    
    ANALYZED DATA:
    - Category: ${intent.category}
    - Urgency: ${intent.urgency}
    - Key Entities: ${JSON.stringify(ner)}
    
    FORMAT:
    Write a complete, formal RTI application addressed to the Public Information Officer (PIO).
    - Subject: Formal RTI Application regarding [Subject derived from input]
    - Body: specific questions asking for information, certified copies, and funds utilization details.
    - Style: Professional, Legal, Concise.
    - Do not include placeholders like "[Your Name]" -> use "The Applicant".
    
    Return ONLY the application text.
    `;

    try {
        // Direct call without JSON parsing since draft is text
        const payload = { contents: [{ parts: [{ text: draftPrompt }] }] };
        const res = await axios.post(`${URL}?key=${API_KEY}`, payload, { headers: { 'Content-Type': 'application/json' } });
        const text = res.data.candidates?.[0]?.content?.parts?.[0]?.text;

        logRequest("DRAFTING", userText, { draft_preview: text.substring(0, 100) + "..." });
        return text;
    } catch (err) {
        logRequest("DRAFTING", userText, null, err.message);
        return `[Drafting Failed] Please write your application manually regarding: ${userText}`;
    }
};
