const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PublicWork = require('./models/PublicWork');
const EmbeddingService = require('./services/embeddingService');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

async function debug() {
    const service = new EmbeddingService();
    try {
        console.log("Attempting to generate embedding...");
        const vector = await service.generateEmbedding("Test Public Work");
        console.log("Vector generated. Length:", vector.length);

        const work = new PublicWork({
             title: "Test Work",
             location: "Pune",
             category: "Road",
             budget: 100,
             status: "Planned",
             description: "Test",
             embedding: vector
        });
        await work.save();
        console.log("Work saved successfully.");
    } catch (error) {
        console.error("FATAL ERROR:", error);
    }
    process.exit();
}

debug();
