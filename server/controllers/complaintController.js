const Complaint = require('../models/Complaint');
const RTIRequest = require('../models/RTIRequest');

// Generate Complaint based on RTI Analysis
exports.generateComplaint = async (req, res) => {
    try {
        const { rtiId } = req.body;
        const rti = await RTIRequest.findById(rtiId);
        if (!rti) return res.status(404).json({ msg: 'RTI not found' });

        // Simulate IPC Mapping
        const suggestedSections = [];
        let draftText = `To The Superintendent of Police,\n\nSubject: Complaint regarding irregularities in ${rti.subject}.\n\nSir,\nI filed an RTI (${rti.id}) regarding ${rti.subject}. The response received indicates significant discrepancies.`;

        if (rti.responseDetails.toLowerCase().includes('discrepancy') || rti.responseDetails.toLowerCase().includes('fraud')) {
            suggestedSections.push({ section: 'IPC 420', description: 'Cheating and dishonestly inducing delivery of property' });
            suggestedSections.push({ section: 'IPC 406', description: 'Punishment for criminal breach of trust' });
            draftText += `\n\nBased on findings, this constitutes an offence under:\n1. IPC 420: Cheating.\n2. IPC 406: Criminal Breach of Trust.\n\nI request you to register an FIR and investigate.`;
        } else {
            suggestedSections.push({ section: 'General Complaint', description: 'General grievance redressal' });
            draftText += `\n\nI request you to look into this matter.`;
        }

        const newComplaint = new Complaint({
            user: req.user.id,
            rtiRequest: rti.id,
            generatedComplaintText: draftText,
            suggestedIPCSections: suggestedSections,
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
exports.getUserComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ user: req.user.id }).populate('rtiRequest');
        res.json(complaints);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
