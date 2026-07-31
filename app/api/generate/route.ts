import { NextRequest, NextResponse } from "next/server";
import { aiPlatform } from "@/lib/ai/platform";
import { ProviderId, RoutingStrategy } from "@/lib/ai/types";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { adminAuth } from "@/lib/firebase/admin";

export const maxDuration = 300; // 5 minutes max duration for massive AI responses

const RequestSchema = z.object({
  idea: z.string().min(3, "Idea is too short").max(2000, "Idea is too long").trim(),
  detailLevel: z.enum(["standard", "enterprise"]).default("enterprise"),
  strategy: z.enum(["automatic", "balanced", "fastest", "highest_quality", "lowest_cost", "reasoning_optimized", "manual"]).default("automatic"),
  providerId: z.string().optional(),
  modelId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  // Generate a unique Request ID
  const requestId = crypto.randomUUID();

  // Verify Firebase Auth Token
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    logger.warn({ requestId }, "Missing or invalid authorization header");
    return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
  }

  const token = authHeader.split("Bearer ")[1];
  let decodedToken;
  try {
    decodedToken = await adminAuth.verifyIdToken(token);
  } catch (error) {
    logger.warn({ requestId, error }, "Invalid Firebase ID token");
    return NextResponse.json({ error: "Unauthorized. Invalid session." }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Validate request body
    const { idea, detailLevel, strategy, providerId, modelId } = RequestSchema.parse(body);

    logger.info({ requestId, ideaPreview: idea.substring(0, 50), detailLevel, strategy }, "Starting BuildFlow generation via AI Platform");

    // Generate BuildFlow through the AI Platform Orchestrator
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
    // Determine status code and message based on error type
    if (error instanceof z.ZodError) {
      logger.warn({ requestId, errors: (error as any).errors }, "Validation Error");
      return NextResponse.json(
        { error: "Invalid request data. Please check your input." },
        { status: 400 }
      );
    }

    if (error instanceof SyntaxError) {
      logger.warn({ requestId, error: error.message }, "Malformed JSON body");
      return NextResponse.json(
        { error: "Invalid JSON body provided." },
        { status: 400 }
      );
    }

    // Generic fallback for all other internal errors to prevent stack trace leakage
    logger.error({ requestId, error: error.stack || error.message || error }, "Internal Server Error");
    
    return NextResponse.json(
      { error: `Generation failed: ${error.message || error}` },
      { status: 500, headers: { "x-request-id": requestId } }
    );
  }
}
