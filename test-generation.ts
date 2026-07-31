import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { aiPlatform } from "./lib/ai/platform";

async function runEndToEndTest() {
  console.log("=== Testing AI Platform V3 (Groq Only) ===");
  const requestId = "test-req-" + Date.now();
  
  try {
    const result = await aiPlatform.generateBuildFlow(
      "A simple Next.js blog with a postgres database",
      requestId,
      "standard", // Testing Standard Mode to save tokens
      "automatic" // RoutingStrategy (should route to Groq)
    );

    console.log("\n✅ Generation Successful!");
    console.log(`Provider: ${result.providerId}`);
    console.log(`Model: ${result.modelId}`);
    console.log(`Project Name: ${result.buildFlow.overview.projectName}`);
    console.log(`Latency: ${result.metrics.latencyMs}ms`);
  } catch (err: any) {
    console.error("❌ Generation Failed:");
    console.error(err.message);
  }
}

runEndToEndTest();
