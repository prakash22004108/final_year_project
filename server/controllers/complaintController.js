const Complaint = require('../models/Complaint');
const RTIRequest = require('../models/RTIRequest');
const groqService = require('../services/groqService');

// Generate Complaint based on RTI Analysis
// Generate Complaint based on RTI Analysis (AI Powered)
exports.generateComplaint = async (req, res) => {
    try {
        const { rtiId, grievance } = req.body; // grievance is user input
        const rti = await RTIRequest.findById(rtiId);
        if (!rti) return res.status(404).json({ msg: 'RTI not found' });

        // AI Analysis for IPC Sections
        const aiResponse = await groqService.draftIPCComplaint(grievance, {
            subject: rti.subject,
            department: rti.department,
            response: rti.responseDetails || "No response received",
            user_grievance: grievance
        });

        const newComplaint = new Complaint({
            user: req.user.id,
            rtiRequest: rti.id,
            generatedComplaintText: aiResponse?.complaint_text || "Error generating draft.",
            suggestedIPCSections: aiResponse?.suggested_sections || [],
            status: 'Draft'
        });

        await newComplaint.save();
        res.json(newComplaint);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get User Complaints
// Get User Complaints
exports.getUserComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ user: req.user.id }).populate('rtiRequest').sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get All Complaints (Admin Only)
exports.getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find().populate('user', 'name email').populate('rtiRequest').sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
