const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    rtiRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RTIRequest',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    generatedComplaintText: {
        type: String,
        required: true,
    },
    suggestedIPCSections: [{
        section: String,
        description: String,
    }],
    status: {
        type: String,
        default: 'Draft',
        enum: ['Draft', 'Filed'],
    }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);
