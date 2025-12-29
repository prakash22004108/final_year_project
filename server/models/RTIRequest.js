const mongoose = require('mongoose');

const RTIRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    aiAnalysis: {
        intent: Object,
        ner: Object
    },
    status: {
        type: String,
        default: 'Drafted', // Drafted, Submitted, Response Received, Analyzed
        enum: ['Drafted', 'Submitted', 'Response Received', 'Analyzed', 'Rejected']
    },
    responseDetails: {
        type: String, // Text of the response
        default: '',
    },
    responseDocuments: [{
        type: String // Paths to uploaded files
    }],
    respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    respondedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // New Fields for Enhanced Tracking
    tracking: [{
        stage: String, // 'Drafted', 'Submitted', 'Officer Viewed', 'Data Checked', 'Response Received'
        timestamp: { type: Date, default: Date.now },
        completed: { type: Boolean, default: true }
    }],
    officerViewed: {
        type: Boolean,
        default: false
    },
    dataAvailability: {
        status: String, // 'Available', 'Not Available', 'Partial'
        source: String, // 'Public Records', 'Department Database', 'None'
        checkedAt: Date,
        fetchedData: mongoose.Schema.Types.Mixed, // Stores the full record snapshot (PublicWork or API Response)
        log: [String], // Array of log messages like "Checking Internal DB...", "Found match."
        emailDraft: String, // When data is missing, store the AI drafted email body
        targetEmail: String // The department email to send to
    }
});

module.exports = mongoose.model('RTIRequest', RTIRequestSchema);
