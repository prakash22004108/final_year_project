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
        enum: ['Drafted', 'Submitted', 'Response Received', 'Analyzed']
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
    }
});

module.exports = mongoose.model('RTIRequest', RTIRequestSchema);
