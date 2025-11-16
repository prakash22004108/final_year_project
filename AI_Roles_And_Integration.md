# AI Roles and Integration Architecture for RTI + Scam Detection System

## 1. Roles of AI in the System

### 🔵 Role 1: Speech → Text Conversion (ASR)

AI converts multilingual voice input into text.

**Responsibilities** - Recognize Indian languages (Tamil, Hindi, Telugu,
Malayalam, Kannada, English) - Handle noisy audio - Output clean text
for further analysis

**Models** - OpenAI Whisper\
- Google Speech-to-Text\
- Vosk (offline option)

------------------------------------------------------------------------

### 🔵 Role 2: Language Detection + Translation

**Responsibilities** - Detect spoken language\
- Translate to English\
- Maintain legal meaning

**Models** - LangDetect / FastText\
- GPT for translation\
- Amazon Translate

------------------------------------------------------------------------

### 🔵 Role 3: Intent Classification

**Responsibilities** - Identify user issue (road, water, RTI, scam,
etc.) - Detect urgency\
- Extract keywords

**Models** - BERT / RoBERTa\
- GPT-4/5 fine-tuning\
- Custom intent classifier

------------------------------------------------------------------------

### 🔵 Role 4: Named Entity Recognition (NER)

AI extracts: - Locations\
- Department names\
- Officer names\
- Dates\
- Project names\
- Budget amount

**Models** - spaCy\
- HuggingFace NER\
- Custom-trained NER

------------------------------------------------------------------------

### 🔵 Role 5: Dataset Routing

AI identifies which datasets to query.

**Examples** - Road → PWD_Project_2024\
- Water → MetroWater Logs\
- Land → Survey + Encroachment DB

**Models** - GPT classification\
- Decision tree + embeddings\
- Vector similarity search

------------------------------------------------------------------------

### 🔵 Role 6: Cross-Verification / Scam Detection

AI analyzes: - Dataset values\
- Budget vs. completion\
- Status vs. ground reality

**Output** - Match or mismatch\
- Scam probability

**Models** - Rule-based + ML\
- Isolation Forest\
- GPT reasoning

------------------------------------------------------------------------

### 🔵 Role 7: Officer Identification

Uses database hierarchy to map: - Approver\
- Supervisor\
- Contractor

**Tech** - Neo4j graph\
- GPT reasoning

------------------------------------------------------------------------

### 🔵 Role 8: Auto-Generation of RTI + Complaints

Generates: - RTI\
- Police complaint\
- Anti-corruption notice\
- IPC sections

**Models** - GPT-5\
- LLaMA 3/4\
- Legal LLM

------------------------------------------------------------------------

### 🔵 Role 9: Transparency Explanation Layer

AI explains: - Why scam was detected\
- Evidence used\
- IPC logic

------------------------------------------------------------------------

## 2. Full AI Integration Architecture

### 🧩 Pipeline

    VOICE → ASR → TEXT → NER + INTENT → DATA ROUTER →
    DATA FETCHER → VERIFICATION ENGINE → OFFICER MAPPER →
    LEGAL GENERATOR → DASHBOARD

------------------------------------------------------------------------

## 3. Tech Stack

### Frontend

-   React / Next.js

### Backend

-   Node.js / Python\
-   FastAPI / Django

### Databases

-   MongoDB\
-   PostgreSQL\
-   ElasticSearch\
-   Neo4j

### AI Layer

-   Python microservices\
-   Whisper\
-   GPT\
-   spaCy\
-   HuggingFace

------------------------------------------------------------------------

## 4. Step-by-Step Integration

### Step 1: Voice Processing

-   Transcribe\
-   Detect language\
-   Translate

### Step 2: NLP Microservice

Output example:

``` json
{
  "issue": "Road not constructed",
  "location": "Avadi 5th Street",
  "department": "PWD",
  "keywords": ["road", "avadi", "construction", "not completed"]
}
```

### Step 3: Dataset Router

Routes to correct datasets.

### Step 4: Verification Engine

Example output:

``` json
{
  "scam_detected": true,
  "reason": "Budget released but road not constructed",
  "confidence": 92
}
```

### Step 5: Officer Mapping

Neo4j graph lookup.

### Step 6: Legal Draft Generator

Creates RTI + complaints.

### Step 7: Dashboard

Displays results.

------------------------------------------------------------------------

## 5. Model Usage Reference

  Task                    Model Type      Example
  ----------------------- --------------- ------------------
  Speech → Text           ASR             Whisper
  Language Detection      Lightweight     FastText
  Translation             LLM             GPT
  Intent Classification   Classifier      BERT
  NER                     Token model     spaCy
  Dataset Routing         Embeddings      Sentence-BERT
  Scam Detection          Anomaly model   Isolation Forest
  Legal Drafting          LLM             GPT-5

------------------------------------------------------------------------

## ⭐ One-Line Summary

**AI acts as the brain of the system---understanding speech, extracting
meaning, routing datasets, detecting scams, generating legal documents,
and providing full transparency.**
