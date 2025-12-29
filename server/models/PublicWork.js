const mongoose = require('mongoose');

const PublicWorkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String, // Detailed description of the work
    },
    embedding: {
        type: [Number], // Vector embedding for semantic search
        select: false // Exclude by default to save bandwidth
    },
    category: {
        type: String, // Road, Water, Electricity, Infrastructure
        required: true
    },
    location: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    spent: {
        type: Number,
        default: 0
    },
    status: {
        type: String, // Completed, In Progress, Planned, Stalled
        default: 'Planned'
    },
    progress: {
        type: Number, // 0 to 100
        default: 0
    },
    contractor: {
        type: String
    },
    startDate: {
        type: Date
    },
    deadline: {
        type: Date
    },
    completionDate: {
        type: Date
    },
    updates: [{
        date: { type: Date, default: Date.now },
        note: String
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PublicWork', PublicWorkSchema);
