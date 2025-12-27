const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Config
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// MongoDB connection
const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    }
};
connectToDatabase();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/rti', require('./routes/rtiRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/official', require('./routes/officialRoutes'));

// Global error handler
app.use((err, req, res, next) => {
    console.error("💥 Server Error:", err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
    console.log("🛑 Shutting down server...");
    mongoose.connection.close(() => {
        console.log("🔌 MongoDB connection closed.");
        process.exit(0);
    });
});
