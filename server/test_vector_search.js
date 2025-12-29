const EmbeddingService = require('./services/embeddingService');

async function test() {
    console.log("🚀 Testing Vector Search...");
    
    const service = await EmbeddingService.getInstance();
    
    const text1 = "Construction of a new highway connection";
    const text2 = "Building a new road for cars"; // Semantically similar
    const text3 = "Installation of water pipes"; // Semantically different

    console.log(`\nGenerating Embeddings...`);
    const vec1 = await service.generateEmbedding(text1);
    const vec2 = await service.generateEmbedding(text2);
    const vec3 = await service.generateEmbedding(text3);

    console.log(`Vector Length: ${vec1.length}`);

    const sim12 = service.calculateSimilarity(vec1, vec2);
    const sim13 = service.calculateSimilarity(vec1, vec3);

    console.log(`\nSimilarity(Highway, Road): ${sim12.toFixed(4)} (Should be High > 0.5)`);
    console.log(`Similarity(Highway, Water): ${sim13.toFixed(4)} (Should be Low < 0.3)`);

    if (sim12 > sim13 && sim12 > 0.4) {
        console.log("\n✅ Vector Search Logic Validated!");
    } else {
        console.log("\n❌ Vector Search Logic Failed.");
    }
}

test();
