import { aiPlatform } from "./lib/ai/platform";

async function runTest() {
  console.log("=== Testing AI Platform V3 (Groq Only) ===");
  const requestId = "test-req-" + Date.now();
  
  try {
    const result = await aiPlatform.generateBuildFlow(
      "A simple Next.js blog with a postgres database",
      requestId,
      "standard",
      "automatic" // RoutingStrategy
    );

    console.log("\n✅ Generation Successful!");
    console.log(`Provider: ${result.providerId}`);
    console.log(`Model: ${result.modelId}`);
    console.log(`Latency: ${result.metrics.latencyMs}ms`);
  } catch (err: any) {
    console.error("❌ Generation Failed:", err.message);
  }
}

runTest();
