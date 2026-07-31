import { generateBuildFlow } from "./services/groq.service";

async function test() {
  try {
    console.log("Starting generation...");
    const result = await generateBuildFlow("A comprehensive medical records application", "test-req-123");
    console.log("SUCCESS!");
    console.log("Generated Title:", result.overview.projectName);
    console.log("Generated risks count:", result.risks?.length);
    console.log("Generated future scope count:", result.futureEnhancements?.length);
  } catch (error) {
    console.error("FAILED:");
    console.error(error);
  }
}

test();
