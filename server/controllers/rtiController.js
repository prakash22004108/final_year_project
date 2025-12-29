const RTIRequest = require('../models/RTIRequest');
const GovAPI = require('../models/GovAPI'); // External API Model
const PublicWork = require('../models/PublicWork'); // Internal Data Model
const EmbeddingService = require('../services/embeddingService');
// const geminiService = require('../services/geminiService');
const geminiService = require('../services/groqService'); // Swapped to Groq

// Create RTI Draft (AI Powered)
exports.createRTI = async (req, res) => {
    console.log("Received Create RTI Request:", req.body);
    try {
        const { description } = req.body; // User's raw voice input / text

        // 1. Analyze Intent
        const intent = await geminiService.classifyIntent(description);

        // 2. Extract Entities
        const ner = await geminiService.extractNER(description);

        // 3. Draft the Application
        const draftedText = await geminiService.draftRTI(description, intent, ner);

        // Determine Department
        let department = "General Administration";
        if (ner.organizations && ner.organizations.length > 0) {
            department = ner.organizations[0];
        } else if (intent.category) {
            department = `${intent.category} Department`;
        }

        // 3. Validation Check (Strict)
        if (intent.is_valid_rti === false) {
             const newRTI = new RTIRequest({
                user: req.user.id,
                subject: `Invalid Request: ${description.substring(0, 50)}...`,
                description: description,
                department: department,
                aiAnalysis: { intent, ner },
                status: 'Rejected',
                tracking: [{ stage: 'Rejected', timestamp: new Date() }],
                dataAvailability: {
                    status: 'Rejected',
                    source: 'None',
                    checkedAt: new Date(),
                    log: ["AI Intent Analysis: Request is NOT valid for RTI.", "Action: Rejected application."]
                }
            });
            await newRTI.save();
            return res.json({ msg: 'RTI Request Rejected', rti: newRTI });
        }

        // 4. Data Availability Check (Internal + External Fallback)
        let dataStatus = 'Not Available';
        let dataSource = 'None';
        let checkLogs = []; // Array to store log messages
        const checkedAt = new Date();

        // Step A: Check Internal DB (Real Check)
        /* 
           ENHANCED SEARCH STRATEGY: 
           1. Vector Search (Semantic) - Priority
           2. Keyword/NER Search (Fallback)
        */
        console.log(`🔍 [AI] Starting Semantic Search for: "${description.substring(0, 50)}..."`);
        let internalWork = null;

        try {
            const embeddingService = await EmbeddingService.getInstance();
            // Create a rich query string combining description and structured entities
            const queryText = `${description} ${intent.category} ${(ner.locations || []).join(' ')} ${(ner.projects || []).join(' ')}`;
            const queryVector = await embeddingService.generateEmbedding(queryText);

            if (queryVector) {
                // Fetch all works with embeddings (In-memory scan for MVP - scalable to Vector DB)
                const allWorks = await PublicWork.find({}).select('+embedding');
                
                let bestMatch = null;
                let maxScore = -1;

                for (const work of allWorks) {
                    if (work.embedding && work.embedding.length > 0) {
                        const score = embeddingService.calculateSimilarity(queryVector, work.embedding);
                        if (score > maxScore) {
                            maxScore = score;
                            bestMatch = work;
                        }
                    }
                }

                console.log(`📊 [AI] Best Semantic Match: "${bestMatch?.title}" (Score: ${maxScore.toFixed(4)})`);

                // Threshold: 0.40 is a reasonable baseline for 'meaningful connection'
                if (bestMatch && maxScore > 0.40) {
                    checkLogs.push(`✅ [Vector Search] Match Found: "${bestMatch.title}" (Relevance: ${(maxScore * 100).toFixed(0)}%)`);
                    internalWork = bestMatch;
                } else {
                    checkLogs.push(`⚠️ [Vector Search] No high-confidence match (Best: ${maxScore.toFixed(2)}). Checking specific keywords...`);
                }
            }
        } catch (err) {
            console.error("Vector Search Error:", err);
            checkLogs.push(`❌ [Error] Semantic Search failed. Fallback to keyword search.`);
        }

        // Fallback: If Vector Search didn't find a strong match, try strict keyword match on entities
        if (!internalWork) {
            let searchTerms = [];
            if (ner.projects && ner.projects.length > 0) searchTerms.push(...ner.projects);
            if (ner.locations && ner.locations.length > 0) searchTerms.push(...ner.locations);
            
            if (searchTerms.length > 0) {
                 const regexQuery = searchTerms.map(term => new RegExp(term, 'i'));
                 internalWork = await PublicWork.findOne({ 
                     $or: [
                         { title: { $in: regexQuery } },
                         { description: { $in: regexQuery } }
                     ]
                 });
                 if (internalWork) checkLogs.push(`✅ [Fallback] Specific Keyword Match Found: ${internalWork.title}`);
            }
        }

        // If no specific match, ONLY return generic category match if it's highly relevant or user asked for "any" (Logic refinement: Strict mode)
        // For now, let's AVOID generic category matches to prevent the "Bus 402" -> "Road Resurfacing" issue.
        // We will only fallback to category if we find NOTHING specific, but even then, it's risky. 
        // Better to go to External API or Email Draft if no specific project is found.
        
        // However, if the user explicitly asked about "Roads" generally, we might want to show something.
        // Let's stick to: Specific Match > External API > Email Draft.
        
        let fetchedData = null;
        
        if (internalWork) {
            checkLogs.push(`Found match in Internal DB: ${internalWork.title}`);
            dataStatus = 'Available';
            dataSource = `Internal DB: ${internalWork.title}`;
            fetchedData = internalWork; // Save full record
        } else {
            checkLogs.push("Internal Data Missing.");
            // Step B: Fallback to External Government API
            checkLogs.push(`Checking External APIs for category: ${intent.category}...`);
            console.log(`[RTI Controller] Internal Data Missing. Checking External APIs for category: ${intent.category}...`);
            
            // Find API matching the category
            const externalApi = await GovAPI.findOne({ category: intent.category });
            
            if (externalApi) {
                checkLogs.push(`Found External API: ${externalApi.name}`);
                console.log(`[RTI Controller] Found External API: ${externalApi.name}`);
                dataStatus = 'Available (Fetched External)';
                dataSource = `External API: ${externalApi.name}`;
                
                // Mock Detailed API Response
                fetchedData = {
                    title: `${externalApi.category} Development Project (External)`,
                    description: `Data fetched securely from ${externalApi.name}. Detailed project metrics available via API endpoint.`,
                    category: externalApi.category,
                    location: "pan-India / Specific Region",
                    budget: Math.floor(Math.random() * 10000000) + 500000,
                    spent: Math.floor(Math.random() * 5000000),
                    status: "In Progress",
                    progress: Math.floor(Math.random() * 90) + 10,
                    contractor: "Govt Authorized Agency",
                    startDate: new Date("2024-01-01"),
                    deadline: new Date("2025-01-01"),
                    sourceApi: externalApi.endpoint
                };
            } else {
                checkLogs.push(`No External API found for category: ${intent.category}`);
                console.log(`[RTI Controller] No External API found for category: ${intent.category}`);
                
                // DATA MISSING -> DRAFT EMAIL LOGIC
                checkLogs.push("Drafting email to department...");
                const emailDraft = await geminiService.draftRTIEmail(intent.category, department);
                
                // Use AI-Predicted Email if available, else generic fallback
                const targetEmail = intent.department_email || `${intent.category.toLowerCase()}@gov.in`;

                dataStatus = 'Not Available'; // Will display "DATA IS NOT AVAILABLE..."
                
                 const newRTI = new RTIRequest({
                    user: req.user.id,
                    subject: `RTI Request regarding ${intent.category} - ${(intent.action_words || []).join(', ')}`,
                    description: draftedText,
                    department: department,
                    aiAnalysis: { intent, ner },
                    status: 'Drafted',
                    tracking: [{ stage: 'Drafted', timestamp: new Date() }],
                    dataAvailability: {
                        status: dataStatus,
                        source: dataSource,
                        checkedAt: checkedAt,
                        fetchedData: fetchedData,
                        log: checkLogs,
                        emailDraft: emailDraft,
                        targetEmail: targetEmail
                    }
                });
                await newRTI.save();
                return res.json({ rti: newRTI });
            }
        }

        const newRTI = new RTIRequest({
            user: req.user.id,
            subject: `RTI Request regarding ${intent.category} - ${(intent.action_words || []).join(', ')}`,
            description: draftedText, // The AI generated formal draft
            department: department,
            aiAnalysis: { intent, ner },
            status: 'Drafted',
            tracking: [{ stage: 'Drafted', timestamp: new Date() }],
            dataAvailability: {
                status: dataStatus,
                source: dataSource,
                checkedAt: checkedAt,
                fetchedData: fetchedData,
                log: checkLogs
            }
        });

        const rti = await newRTI.save();
        res.json({ rti, intent, ner });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get All User RTIs
exports.getUserRTIs = async (req, res) => {
    try {
        const rtis = await RTIRequest.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(rtis);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Submit RTI (Simulate sending)
exports.submitRTI = async (req, res) => {
    try {
        const rti = await RTIRequest.findById(req.params.id);
        if (!rti) return res.status(404).json({ msg: 'RTI not found' });

        // Simulate formatting by AI
        rti.description = `[FORMAL REQUEST]\nTo The PIO, \n${rti.department} \n\nSubject: ${rti.subject} \n\nRespected Sir / Madam, \n${rti.description} \n\nKindly provide information under RTI Act 2005.`;
        rti.status = 'Submitted';
        rti.tracking.push({ stage: 'Submitted', timestamp: new Date() });
        await rti.save();
        res.json(rti);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Simulate Receiving a Response (For Demo Purpose)
exports.simulateResponse = async (req, res) => {
    try {
        const rti = await RTIRequest.findById(req.params.id);
        if (!rti) return res.status(404).json({ msg: 'RTI not found' });

        // Mock Response Data based on department
        let responseText = "The requested information is attached. Expenditure: 50L. Actual Work: 20L.";
        if (rti.department.toLowerCase().includes('road')) {
            responseText = "Road Construction Project Alpha. Allocated: 1Cr. Spent: 1Cr. Status: Complete. (Audit Note: Discrepancy in raw material bills found).";
        }

        rti.responseDetails = responseText;
        rti.status = 'Response Received';
        rti.officerViewed = true;
        rti.tracking.push({ stage: 'Officer Viewed', timestamp: new Date(Date.now() - 100000) }); // Viewed a bit earlier
        rti.tracking.push({ stage: 'Response Received', timestamp: new Date() });
        
        await rti.save();
        res.json(rti);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Analyze Response (Simulated AI/OCR)
exports.analyzeResponse = async (req, res) => {
    try {
        const rti = await RTIRequest.findById(req.params.id);
        if (!rti) return res.status(404).json({ msg: 'RTI not found' });

        // Simple Keyword matching simulation
        const keywords = ['discrepancy', 'mismatch', 'audit', 'missing'];
        let analysisResult = "No significant anomalies detected.";
        let anomalyFound = false;

        if (rti.responseDetails) {
            for (let word of keywords) {
                if (rti.responseDetails.toLowerCase().includes(word)) {
                    anomalyFound = true;
                    analysisResult = `ALERT: Detected potential fraud indicator: '${word}'.Discrepancy in financial records suspected.`;
                    break;
                }
            }
        }

        rti.status = 'Analyzed';
        await rti.save();
        res.json({ rti, analysisResult, anomalyFound });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
