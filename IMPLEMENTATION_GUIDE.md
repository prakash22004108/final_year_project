# RTI & IPC AI Automation System - Implementation Guide

## 📖 Project Overview
This project is an AI-powered platform designed to automate the Right to Information (RTI) process. It helps citizens file applications, detects anomalies in government responses using NLP, and drafts legal complaints mapped to IPC sections.

### Tech Stack
*   **Frontend**: React (Vite), TailwindCSS, Framer Motion, Lucide Icons.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (Atlas/Local) with Mongoose.
*   **AI & ML**: 
    *   **Groq API (Llama 3)**: For drafting RTIs and Complaint analysis.
    *   **Xenova/Transformers**: Local Vector Embeddings (`all-MiniLM-L6-v2`) for semantic search of public works.

---

## 🛠️ 1. Environmental Setup

### Prerequisites
*   Node.js (v18+)
*   MongoDB (URI)
*   Groq API Key (for AI features)

### Environment Variables
Create a `.env` file in the **server** directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
```

---

## 📦 2. Installation & Dependencies

**Terminal 1: Server Setup**
```bash
cd server
npm install
```

**Terminal 2: Client Setup**
```bash
cd client
npm install
```

---

## 🗄️ 3. Database Seeding (Crucial Step)
To enable **Vector Search** and meaningful demos, you must populate the database with realistic vectors.

**How to Seed:**
1.  Navigate to the `server` folder.
2.  Run the seed script:
    ```bash
    node seed_data.js
    ```
3.  **Wait ~3 Minutes**: The script downloads the AI model and generates 100+ embeddings.
4.  **Success**: Look for `🚀 Database is now production-ready`.

**What is Added?**
*   **100 Public Works**: Real-world projects like "Pune Metro", "Chandani Chowk Flyover" with vector embeddings.
*   **40 Mock APIs**: Endpoints like `morth.nic.in` for "External Data" simulation.

---

## 🚀 4. Running the Project

**Start Backend:**
```bash
cd server
npm run dev
# Running on http://localhost:5000
```

**Start Frontend:**
```bash
cd client
npm run dev
# Running on http://localhost:5173
```

---

## 🔑 5. Key Workflows & Features

### A. Authentication (Role-Based)
*   User Login -> Redirects to `/dashboard`
*   Admin Login (`admin@govt.in`/`123`) -> Redirects to `/admin` dashboard.
*   **Navbar**: Adapts dynamically (shows "Admin Dashboard" badge for admins).

### B. Smart RTI Creation (Vector Search)
1.  User types a query (e.g., "Broken road in Pune").
2.  **Step 1**: System converts text to Vector.
3.  **Step 2**: Searches Internal Database (MongoDB) for semantic matches.
    *   *Match Found?* Shows "Data Available" instantly.
    *   *No Match?* Checks "External APIs".
    *   *Still No Match?* Drafts a new RTI using Groq AI.

### C. Admin Complaint Resolution
1.  Admin views complaints on Dashboard.
2.  **Mark as Viewed**: Updates status to 'Viewed'.
3.  **Resolve**: Admin adds a resolution note. Status becomes 'Resolved'.
4.  **User View**: User sees the resolution note on their tracking page.

---

## ⚠️ Common Troubleshooting
*   **Vector Search returns nothing**: Did you run `node seed_data.js`? The database might be empty.
*   **AI Drafting fails**: Check if `GROQ_API_KEY` is valid in `.env`.
*   **Frontend crashes**: Ensure `npm install` was run in `client` to install `framer-motion` and `lucide-react`.
