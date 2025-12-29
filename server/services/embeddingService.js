const { pipeline } = require('@xenova/transformers');

class EmbeddingService {
    static instance = null;

    constructor() {
        this.extractor = null;
    }

    static async getInstance() {
        if (!EmbeddingService.instance) {
            EmbeddingService.instance = new EmbeddingService();
            console.log("⏳ Loading Embedding Model (all-MiniLM-L6-v2)...");
            // Load the pipeline - this will download the model on first run (~80MB)
            EmbeddingService.instance.extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            console.log("✅ Embedding Model Loaded!");
        }
        return EmbeddingService.instance;
    }

    async generateEmbedding(text) {
        if (!text) return null;
        
        // Clean text
        const cleanText = text.replace(/\n/g, ' ').trim();
        
        // Generate embedding
        // pooling: 'mean' gives a single vector for the sentence
        // normalize: true gives unit vectors (so dot product = cosine similarity)
        const output = await this.extractor(cleanText, { pooling: 'mean', normalize: true });
        
        // Convert Tensor to array
        return Array.from(output.data);
    }

    calculateSimilarity(vecA, vecB) {
        if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

        // Since vectors are normalized, Cosine Similarity = Dot Product
        let dotProduct = 0;
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
        }
        return dotProduct;
    }
}

module.exports = EmbeddingService;
