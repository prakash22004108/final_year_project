const mongoose = require('mongoose');

const GovAPISchema = new mongoose.Schema({
    name: {
        type: String, // e.g., "National Road Database API"
        required: true
    },
    endpoint: {
        type: String, // e.g., "https://api.gov.in/roads/v1"
        required: true
    },
    category: {
        type: String, // e.g., "Road", "Water", "Health" - matches Intent Category
        required: true
    },
    authKey: {
        type: String, 
        default: 'PUBLIC_KEY' 
    },
    reliabilityScore: {
        type: Number, // 0-1
        default: 0.95
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('GovAPI', GovAPISchema);
