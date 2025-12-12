1️⃣ Voice Input Module: Accepts multilingual audio, handles noise reduction, and outputs raw text to ASR.

2️⃣ Speech-to-Text (ASR) Engine: Converts multilingual audio (especially Indian accents) into accurate text transcriptions.

3️⃣ Language Detection: Identifies the language, including mixed-language sentences, for content routing.

4️⃣ Translation Engine: Converts detected user language into system-ready English while maintaining legal and contextual accuracy.

5️⃣ Intent Classification: Categorizes the user's issue (e.g., Road, Corruption) and urgency, outputting structured intent data.

6️⃣ NER (Named Entity Extraction): Extracts and structures essential fields like names, places, and project names from the messy text.

7️⃣ Dataset Router: Decides which specific government dataset to query based on the classified issue type.

8️⃣ Data Fetcher: Connects to various databases (PostgreSQL/MongoDB) to pull required records in real-time.

9️⃣ Verification & Scam Detection Engine: Compares user claims with fetched dataset values to detect anomalies and assign a "scam probability score."

🔟 Officer Mapping Engine: Uses a Neo4j graph database to trace and build the chain of responsibility for accountability.

1️⃣1️⃣ Legal Draft Generator: Creates formal, government-compatible legal documents (RTI, complaints) by integrating all extracted data.

1️⃣2️⃣ Transparency Explanation Module: Generates step-by-step reasoning and evidence explaining the scam identification and dataset access.

1️⃣3️⃣ Final Dashboard (UI/UX): Displays all results—issue, data, scam score, legal documents—in a clean, multilingual interface for public use.

1️⃣4️⃣ Backend API Layer: Connects all AI modules as scalable microservices and manages frontend requests, authentication, and logs.

1️⃣5️⃣ Database Layer: Stores government datasets, user history, and system logs, powering the verification and search capabilities.



### completed till now

import requests
import json
import re
import time
from datetime import datetime
# ===============================
# API KEY & ENDPOINT
# ===============================
API_KEY = "AIzaSyDYP4Xm2NjS83hFQy-Dvi02ae9cMFea4Pc"   # <-- replace this
url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"



INTENT_PROMPT = """
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

No Markdown, no ```json, no extra text.

User message:
"""


# ===================================================
# 2. STRICT JSON SCHEMA VALIDATION
# ===================================================
def validate_schema(obj):
    required_fields = ["category", "urgency", "confidence", "action_words", "explanation"]

    # Check required fields
    for field in required_fields:
        if field not in obj:
            return False, f"Missing field: {field}"

    # Type checks
    if not isinstance(obj["category"], str):
        return False, "category must be string"

    if not isinstance(obj["urgency"], str):
        return False, "urgency must be string"

    if not isinstance(obj["confidence"], (int, float)):
        return False, "confidence must be a number"

    if not 0 <= obj["confidence"] <= 1:
        return False, "confidence must be between 0 and 1"

    if not isinstance(obj["action_words"], list):
        return False, "action_words must be a list"

    if not isinstance(obj["explanation"], str):
        return False, "explanation must be a string"

    return True, "OK"


# ===================================================
# 3. CLEAN JSON FROM MODEL TEXT
# ===================================================
def clean_json(model_text):
    # Remove code block wrappers
    clean = re.sub(r"```json|```", "", model_text).strip()

    # Remove leading/trailing noise
    clean = clean.replace("\n", " ").strip()

    # Try to extract valid JSON using regex
    match = re.search(r"\{.*\}", clean, re.DOTALL)
    if match:
        clean = match.group(0)

    return clean


# ===================================================
# 4. CALL GEMINI + RETRY ON FAILURE
# ===================================================
def call_gemini(full_prompt, max_retries=3):
    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": API_KEY
    }

    data = {
        "contents": [
            {"parts": [{"text": full_prompt}]}
        ]
    }

    for attempt in range(1, max_retries + 1):
        response = requests.post(url, headers=headers, data=json.dumps(data))
        raw = response.json()

        try:
            model_text = raw["candidates"][0]["content"]["parts"][0]["text"]
        except Exception:
            model_text = ""

        cleaned = clean_json(model_text)

        # Attempt to parse JSON
        try:
            parsed = json.loads(cleaned)
        except Exception:
            parsed = None

        # Validate schema
        if parsed:
            valid, msg = validate_schema(parsed)
            if valid:
                return parsed, raw  # SUCCESS
            else:
                error_msg = f"Schema invalid ({msg})"
        else:
            error_msg = "JSON parsing failed"

        print(f"[Retry {attempt}/{max_retries}] -> {error_msg}")
        time.sleep(1)  # Prevent hammering the API

    # Final fallback after all retries
    return {"error": "Failed after retries", "raw_text": cleaned}, raw


# ===================================================
# 5. LOGGING + ANALYTICS
# ===================================================
def log_request(user_input, clean_output, raw_output):
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "user_input": user_input,
        "clean_output": clean_output,
        "raw_output": raw_output
    }

    with open("intent_logs.jsonl", "a") as f:
        f.write(json.dumps(log_entry) + "\n")


# ===================================================
# 6. MAIN FUNCTION
# ===================================================
def classify_intent(user_text):
    prompt = INTENT_PROMPT + user_text
    clean_output, raw_output = call_gemini(prompt)

    # Logging
    log_request(user_text, clean_output, raw_output)

    return clean_output, raw_output


# ===================================================
# 7. USER INPUT
# ===================================================
user_input = input("Enter your issue: ")

clean_output, raw_output = classify_intent(user_input)

print("\n=========== CLEAN OUTPUT (Parsed JSON) ===========")
print(json.dumps(clean_output, indent=2))

print("\n=========== RAW RESPONSE FROM GEMINI ===========")
print(json.dumps(raw_output, indent=2))


NER_PROMPT = """
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
"""

# =======================================
# NER FUNCTION
# =======================================
def extract_ner(user_text):

    full_prompt = NER_PROMPT + user_text

    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": API_KEY
    }

    data = {
        "contents": [
            {
                "parts": [
                    {
                        "text": full_prompt
                    }
                ]
            }
        ]
    }

    response = requests.post(url, headers=headers, data=json.dumps(data))
    raw = response.json()

    # Extract model text
    try:
        model_text = raw["candidates"][0]["content"]["parts"][0]["text"]
    except:
        model_text = ""

    # Clean markdown if present
    clean_text = re.sub(r"```json|```", "", model_text).strip()

    # Parse JSON
    try:
        parsed = json.loads(clean_text)
    except:
        parsed = {"error": "NER JSON parsing failed", "raw": clean_text}

    return parsed, raw



# === USER INPUT ===
user_input = input("Enter your issue: ")

# === INTENT CLASSIFICATION (already built earlier) ===
intent_output, intent_raw = classify_intent(user_input)
print("\n=== INTENT RESULT ===")
print(json.dumps(intent_output, indent=2))

# === NER EXTRACTION ===
ner_output, ner_raw = extract_ner(user_input)
print("\n=== NER RESULT ===")
print(json.dumps(ner_output, indent=2))

print("\n=== RAW NER RESPONSE ===")
print(json.dumps(ner_raw, indent=2))



