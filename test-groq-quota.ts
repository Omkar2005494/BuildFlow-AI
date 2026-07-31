import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function checkGroqQuota() {
  console.log("Checking Groq Quota...");
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  
  const models = ["llama-3.3-70b-versatile", "mixtral-8x7b-32768", "llama-3.1-8b-instant"];
  
  for (const model of models) {
    try {
      console.log(`\nTesting ${model}...`);
      const completion = await client.chat.completions.create({
        messages: [{ role: "user", content: "Hi" }],
        model: model,
        max_tokens: 10
      });
      console.log(`✅ ${model} works! Rate limit headers:`);
      // SDK might not expose headers easily without raw response, but if it succeeds, quota is fine for small requests.
      // Wait, large requests might hit the Tokens Per Minute limit!
    } catch (error: any) {
      console.log(`❌ ${model} failed: ${error.message}`);
    }
  }
}

checkGroqQuota();
