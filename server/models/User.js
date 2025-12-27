const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'citizen', // citizen, official, admin
        enum: ['citizen', 'official', 'admin']
    },
    department: {
        type: String, // Only for 'official' role
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
