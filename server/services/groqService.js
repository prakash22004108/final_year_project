const Groq = require('groq-sdk');
require('dotenv').config();

// Initialize Groq Client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Use a reliable model on Groq. The user suggested "openai/gpt-oss-120b" which seems incorrect for Groq.
// We default to LLaMA 3 70B which is excellent for this use case.
const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile"; 

console.log(`[Groq Service] Initialized using model: ${MODEL}`);

// ===============================
// HELPER: CLEAN JSON
// ===============================
const cleanJSON = (text) => {
    try {
        // Remove markdown code blocks
        let clean = text.replace(/```json|```/g, "").trim();
        // Extract JSON object if there's extra text around it
        const match = clean.match(/\{[\s\S]*\}/);
        if (match) {
            clean = match[0];
        }
        return JSON.parse(clean);
    } catch (e) {
        return null;
    }
};

// ===============================
// HELPER: VALIDATE SCHEMA
// ===============================
const validateSchema = (obj) => {
    const requiredFields = ["category", "urgency", "confidence", "action_words", "explanation"];
    for (const field of requiredFields) {
        if (!(field in obj)) return false;
    }
    // Type checks
    if (typeof obj.confidence !== 'number' || obj.confidence < 0 || obj.confidence > 1) return false;
    if (!Array.isArray(obj.action_words)) return false;
    
    return true;
};

// ===============================
// INTENT CLASSIFICATION
// ===============================
exports.classifyIntent = async (userText) => {
    const prompt = `
You are a highly reliable AI system designed for classifying citizen issues in India for a government grievance platform.
Your job is to analyze the user's message and generate a STRICTLY VALID JSON (machine-readable, no extra text).

Determine if this is a VALID Government Query (RTI or Grievance). 
- VALID: Roads, Water, Sanitation, Garbage, Street Lights, Public Infrastructure, Schemes, Safety, Corruption.
- INVALID: Aliens, UFOs, private disputes, homework help, insults, nonsense, personal life.
- NOTE: Even if it is a direct complaint (e.g. "Road is bad"), classify as VALID.

--- CATEGORY ---
"Road", "Water", "Electricity", "Health", "RTI",
"Corruption", "Land", "Scam", "Other"

--- URGENCY ---
"Complaint", "Scam Alert", "RTI Request",
"Status Check", "Feedback"

Return ONLY raw JSON:

{
  "category": "",
  "urgency": "",
  "is_valid_rti": true/false,
  "confidence": 0.0,
  "action_words": [],
  "explanation": "",
  "department_email": "specific_email_id_of_department"
}

IMPORTANT: For "department_email", try to predict the specific official email for that department and location. 
Example: "Bangalore potholes" -> "contact@bbmp.gov.in". "Mumbai police" -> "commissioner.mumbai@mahapolice.gov.in".
If unknown, use a realistic format like "contact@[department].gov.in".

User message:
${userText}
`;

    for (let i = 0; i < 3; i++) {
        try {
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: "Return STRICT JSON only" },
                    { role: "user", content: prompt }
                ],
                model: MODEL,
                temperature: 0,
                response_format: { type: "json_object" }
            });

            const content = chatCompletion.choices[0]?.message?.content || "";
            const json = cleanJSON(content);

            if (json) {
                return json;
            }
            console.warn(`[Groq] Schema validation failed on attempt ${i + 1}`);

        } catch (e) {
            console.error(`[Groq] Attempt ${i + 1} failed:`, e.message);
        }
    }
    
    return { 
        category: "Other", 
        urgency: "Complaint", 
        is_valid_rti: false,
        confidence: 0, 
        action_words: [], 
        explanation: "Failed to classify after retries." 
    };
};

// ===============================
// NER EXTRACTION
// ===============================
exports.extractNER = async (userText) => {
    const prompt = `
Extract ONLY the entities present in the text.

Return STRICT JSON ONLY:

{
  "persons": [],
  "locations": [],
  "dates": [],
  "money": [],
  "organizations": [],
  "projects": []
}

Rules:
- No empty arrays
- Exact text only
- No markdown

User message:
${userText}
`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "Return STRICT JSON only" },
                { role: "user", content: prompt }
            ],
            model: MODEL,
            temperature: 0,
        });

        const content = chatCompletion.choices[0]?.message?.content || "{}";
        return cleanJSON(content) || { persons: [], locations: [], organizations: [], dates: [], money: [], projects: [] };

    } catch (e) {
        console.error("[Groq] NER failed:", e.message);
        return { persons: [], locations: [], organizations: [], dates: [], money: [], projects: [] };
    }
};

// ===============================
// DRAFT RTI (Added for parity with Ollama Service)
// ===============================
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
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful legal drafting assistant." },
                { role: "user", content: prompt }
            ],
            model: MODEL,
            temperature: 0.7,
        });

        return chatCompletion.choices[0]?.message?.content || "Failed to generate draft.";
    } catch (e) {
        console.error("[Groq] Drafting failed:", e.message);
        return "Error creating draft.";
    }
};

exports.draftRTIEmail = async (topic, department) => {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an assistant helping a citizen draft an email to the ${department} regarding ${topic}.
                    The data was not found in public records, so we are requesting it directly via email.
                    Draft a formal, concise, and polite email body. Do not include subject line or placeholders like [Your Name], just the body text.`
                },
                {
                    role: "user",
                    content: `Draft email for: ${topic}`
                }
            ],
            model: MODEL,
            temperature: 0.5,
        });
        return chatCompletion.choices[0].message.content;
    } catch (error) {
        console.error("Error in draftRTIEmail:", error);
        return "Error generating email draft.";
    }
};

exports.draftIPCComplaint = async (user_input, rti_context) => {
    try {
        const prompt = `
        You are a legal expert in the Indian Penal Code (IPC). 
        The user is unsatisfied with an RTI response or lack of action. 
        Based on their grievance and the RTI context, suggest relevant IPC sections (e.g., Section 420 for cheating, Section 166 for public servant disobeying law, etc.).
        Draft a formal complaint letter.

        RTI Context: ${JSON.stringify(rti_context)}

        Return STRICT JSON:
        {
           "suggested_sections": [
              { "section": "IPC XXX", "description": "Short desc" }
           ],
           "complaint_text": "Formal letter..."
        }
        
        User Input: ${user_input}
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Return STRICT JSON containing suggested_sections and complaint_text."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });
        
        return cleanJSON(chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error("Error in draftIPCComplaint:", error);
        return null;
    }
};
