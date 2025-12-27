const service = require('./services/ollamaService');

(async () => {
    console.log("🚀 Testing Ollama Connection with model: deepseek-r1:1.5b");
    const testText = "There is a massive pothole on MG Road causing traffic.";

    console.log("\n--- 1. Testing Intent Classification ---");
    const intent = await service.classifyIntent(testText);
    console.log(intent);

    console.log("\n--- 2. Testing Drafting ---");
    const draft = await service.draftRTI(testText, intent, {});
    console.log(draft.substring(0, 150) + "...");

    console.log("\n✅ Done!");
})();
