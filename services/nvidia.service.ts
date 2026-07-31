import OpenAI from "openai";
import { BuildFlow, BuildFlowSchema } from '@/types';
import { getBuildFlowPrompt } from '@/prompts/buildflow.prompt';
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

const openai = new OpenAI({
  apiKey: env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

export async function generateBuildFlowNvidia(idea: string, requestId: string, detailLevel: "standard" | "enterprise" = "enterprise"): Promise<BuildFlow> {
  const startTime = Date.now();
  
  // High-capacity models available on NVIDIA NIM
  const models = [
    "meta/llama-3.1-70b-instruct",
    "meta/llama-3.1-405b-instruct",
    "meta/llama3-70b-instruct"
  ];

  let lastError: any = null;
  const prompt = getBuildFlowPrompt(detailLevel);

  for (const model of models) {
    try {
      logger.info({ requestId, ideaLength: idea.length, model, detailLevel, provider: "NVIDIA" }, "Initiating NVIDIA AI generation");

      const completion = await openai.chat.completions.create({
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
        max_tokens: 8192
      });

      let responseText = completion.choices[0]?.message?.content;

      if (!responseText) {
        throw new Error("Empty response from NVIDIA");
      }

      // Extract JSON if it's wrapped in markdown blocks
      const jsonMatch = responseText.match(/```json\n([\s\S]*)\n```/);
      if (jsonMatch) {
        responseText = jsonMatch[1];
      }

      // Try parsing the JSON
      let parsedData: unknown;
      try {
        parsedData = JSON.parse(responseText);
      } catch (parseError) {
        logger.error({ requestId, responseText, parseError, model }, "Failed to parse NVIDIA response as JSON");
        throw new Error("Invalid output format from AI (JSON Parse Error)");
      }

      // Validate the JSON against our strict Zod schema
      try {
        const validatedData = BuildFlowSchema.parse(parsedData);
        
        const duration = Date.now() - startTime;
        logger.info({ requestId, duration, model, provider: "NVIDIA" }, "Successfully generated BuildFlow via NVIDIA");
        
        return validatedData;
      } catch (validationError) {
        logger.error({ requestId, parsedData, validationError, model }, "NVIDIA response failed Zod schema validation");
        throw new Error("Invalid output format from AI (Schema Validation Error)");
      }
      
    } catch (error: any) {
      lastError = error;
      
      // If we hit a rate limit or model unavailable, continue to next model
      if (
        error?.status === 429 || 
        error?.status === 413 ||
        error?.status === 404 ||
        error?.message?.includes("Rate limit") ||
        error?.message?.includes("decommissioned") ||
        error?.message?.includes("too large") ||
        error?.message?.includes("Model not found")
      ) {
        logger.warn({ requestId, model, error: error.message }, "NVIDIA Model unavailable or rate limited, falling back to next model...");
        continue;
      }
      
      logger.error({ requestId, error: error.message, model }, "NVIDIA AI generation failed");
      throw error; 
    }
  }

  // If we exhaust all models
  const duration = Date.now() - startTime;
  logger.error({ requestId, duration, error: lastError?.message }, "All NVIDIA models exhausted or failed");
  throw new Error("All AI models are currently rate limited. Please try again later.");
}
