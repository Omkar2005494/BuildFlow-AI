import Groq from "groq-sdk";
import { BuildFlow, BuildFlowSchema } from '@/types';
import { getBuildFlowPrompt } from '@/prompts/buildflow.prompt';
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
  maxRetries: 3, // Enable automatic retries
  timeout: 30000, // 30 seconds timeout
});

export async function generateBuildFlow(idea: string, requestId: string, detailLevel: "standard" | "enterprise" = "enterprise"): Promise<BuildFlow> {
  const startTime = Date.now();
  
  const models = [
    "llama-3.3-70b-versatile",
    "llama-3.3-70b-specdec",
    "llama-3.2-90b-vision-preview",
    "mixtral-8x7b-32768",
    "gemma2-9b-it",
    "llama-3.1-8b-instant"
  ];

  let lastError: any = null;
  const prompt = getBuildFlowPrompt(detailLevel);

  for (const model of models) {
    try {
      logger.info({ requestId, ideaLength: idea.length, model, detailLevel }, "Initiating Groq AI generation");

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: prompt
          },
          {
            role: "user",
            content: idea
          }
        ],
        model: model,
        temperature: 0.2,
        response_format: { type: "json_object" }
      });

      const responseText = completion.choices[0]?.message?.content;

      if (!responseText) {
        throw new Error("Empty response from Groq");
      }

      // Try parsing the JSON
      let parsedData: unknown;
      try {
        parsedData = JSON.parse(responseText);
      } catch (parseError) {
        logger.error({ requestId, responseText, parseError, model }, "Failed to parse Groq response as JSON");
        throw new Error("Invalid output format from AI (JSON Parse Error)");
      }

      // Validate the JSON against our strict Zod schema
      try {
        const validatedData = BuildFlowSchema.parse(parsedData);
        
        const duration = Date.now() - startTime;
        logger.info({ requestId, duration, model }, "Successfully generated BuildFlow");
        
        return validatedData;
      } catch (validationError) {
        logger.error({ requestId, parsedData, validationError, model }, "Groq response failed Zod schema validation");
        throw new Error("Invalid output format from AI (Schema Validation Error)");
      }
      
    } catch (error: any) {
      lastError = error;
      
      // If we hit a rate limit (429), model decommissioned (400), or too large (413), continue to the next model
      if (
        error?.status === 429 || 
        error?.status === 413 ||
        error?.error?.code === 'rate_limit_exceeded' || 
        error?.error?.code === 'model_decommissioned' ||
        error?.message?.includes("Rate limit reached") ||
        error?.message?.includes("decommissioned") ||
        error?.message?.includes("Request too large")
      ) {
        logger.warn({ requestId, model, error: error.message }, "Model unavailable or rate limited, falling back to next available model...");
        continue;
      }
      
      // If it's a different error (like Zod validation), break out of the loop and fail immediately
      logger.error({ requestId, error: error.message, model }, "Groq AI generation failed");
      throw error; 
    }
  }

  // If we exhaust all models
  const duration = Date.now() - startTime;
  logger.error({ requestId, duration, error: lastError?.message }, "All models exhausted or failed");
  throw new Error("All AI models are currently rate limited. Please try again later.");
}
