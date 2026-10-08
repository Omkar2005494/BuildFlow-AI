import { NextRequest, NextResponse } from "next/server";
import { aiPlatform } from "@/lib/ai/platform";
import { ProviderId, RoutingStrategy } from "@/lib/ai/types";
import { z } from "zod";
import { logger } from "@/lib/logger";

export const maxDuration = 300; // 5 minutes max duration for massive AI responses

const RequestSchema = z.object({
  idea: z.string().min(3, "Idea is too short").max(2000, "Idea is too long").trim(),
  detailLevel: z.enum(["standard", "enterprise"]).default("enterprise"),
  strategy: z.enum(["automatic", "balanced", "fastest", "highest_quality", "lowest_cost", "reasoning_optimized", "manual"]).default("automatic"),
  providerId: z.string().optional(),
  modelId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    const body = await req.json();
    
    // Validate request body
    const { idea, detailLevel, strategy, providerId, modelId } = RequestSchema.parse(body);

    logger.info({ requestId, ideaPreview: idea.substring(0, 50), detailLevel, strategy }, "Starting BuildFlow generation via AI Platform");

    // Generate BuildFlow through the AI Platform Orchestrator (defaults to Local Llama)
    const result = await aiPlatform.generateBuildFlow(
      idea,
      requestId,
      detailLevel,
      strategy as RoutingStrategy,
      providerId as ProviderId,
      modelId
    );

    logger.info({ requestId, resultMetrics: result.metrics }, "Generation completed successfully");
    
    // Return both the generated buildFlow and the telemetry info to the frontend
    return NextResponse.json(result);

  } catch (error: any) {
    logger.error({ requestId, error: error.message }, "BuildFlow generation failed");
    
    // Pass the actual aggregated error string down to the user
    return NextResponse.json(
      { 
        error: error.message || "Failed to generate architecture blueprint. Please try again.",
        requestId 
      }, 
      { status: 500 }
    );
  }
}
