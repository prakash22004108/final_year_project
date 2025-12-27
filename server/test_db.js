const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

console.log("Testing Connection with URI:", uri);

mongoose.connect(uri)
    .then(() => {
        console.log("✅ SUCCESS: MongoDB Connected!");
        process.exit(0);
    })
    .catch(err => {
        console.error("❌ FAILURE:", err.message);
        process.exit(1);
    });
