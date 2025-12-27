
const RTIRequest = require('../models/RTIRequest');
// const geminiService = require('../services/geminiService');
const geminiService = require('../services/ollamaService'); // Swapped to Ollama

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

        // Determine Department from NER or Intent
        let department = "General Administration";
        if (ner.organizations && ner.organizations.length > 0) {
            department = ner.organizations[0];
        } else if (intent.category) {
            department = `${intent.category} Department`;
        }

        const newRTI = new RTIRequest({
            user: req.user.id,
            subject: `RTI Request regarding ${intent.category} - ${(intent.action_words || []).join(', ')}`,
            description: draftedText, // The AI generated formal draft
            department: department,
            aiAnalysis: { intent, ner },
            status: 'Drafted'
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
