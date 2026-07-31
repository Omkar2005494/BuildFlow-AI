import { BuildFlow, BuildFlowSchema } from "@/types";
import { getBuildFlowPrompt } from "@/prompts/buildflow.prompt";
import { logger } from "@/lib/logger";
import { MODEL_REGISTRY, getModelById, getModelsByProvider } from "./registry";
import { ProviderAdapter, RoutingStrategy, GenerationResult, ProviderId } from "./types";
import { OpenAIAdapter } from "./providers/openai.adapter";
import { AnthropicAdapter } from "./providers/anthropic.adapter";
import { GeminiAdapter } from "./providers/gemini.adapter";
import { GroqAdapter } from "./providers/groq.adapter";
import { NvidiaAdapter } from "./providers/nvidia.adapter";

export class AIPlatform {
  private adapters: Map<ProviderId, ProviderAdapter> = new Map();

  constructor() {
    this.registerAdapter(new OpenAIAdapter());
    this.registerAdapter(new AnthropicAdapter());
    this.registerAdapter(new GeminiAdapter());
    this.registerAdapter(new GroqAdapter());
    // this.registerAdapter(new NvidiaAdapter()); // Disabled to prevent hanging
  }

  private registerAdapter(adapter: ProviderAdapter) {
    if (adapter.isAvailable()) {
      this.adapters.set(adapter.id, adapter);
    }
  }

  public getAvailableProviders(): ProviderId[] {
    return Array.from(this.adapters.keys());
  }

  /**
   * Intelligently routes the request to the best model/provider based on strategy.
   * If manual mode is selected, it will attempt to use the requested provider and model.
   * Implements an automatic resiliency fallback loop.
   */
  public async generateBuildFlow(
    idea: string,
    requestId: string,
    detailLevel: "standard" | "enterprise",
    strategy: RoutingStrategy,
    preferredProviderId?: ProviderId,
    preferredModelId?: string
  ): Promise<GenerationResult> {
    const prompt = getBuildFlowPrompt(detailLevel);
    
    // Determine the cascade of models to try
    const modelCascade = this.buildRoutingCascade(strategy, preferredProviderId, preferredModelId);
    
    if (modelCascade.length === 0) {
      throw new Error("No AI providers are currently available. Please check your API keys in the AI Settings.");
    }

    const retries = 0;
    let fallbackCount = 0;
    let schemaRepairs = 0;
    const startTime = Date.now();

    const errors: string[] = [];

    for (const model of modelCascade) {
      const adapter = this.adapters.get(model.providerId);
      if (!adapter) continue;

      try {
        logger.info({ requestId, modelId: model.id, providerId: model.providerId, strategy }, "Attempting AI generation");
        
        const rawJsonString = await adapter.generateJSON(prompt + "\n\n" + idea, model.id);
        
        let parsedData: unknown;
        try {
          parsedData = JSON.parse(rawJsonString);
        } catch {
          schemaRepairs++;
          throw new Error("Invalid output format from AI (JSON Parse Error)");
        }

        const validatedData = BuildFlowSchema.parse(parsedData);

        const latencyMs = Date.now() - startTime;
        
        logger.info({ requestId, latencyMs, providerId: model.providerId }, "Successfully generated BuildFlow");

        return {
          buildFlow: validatedData,
          providerId: model.providerId,
          modelId: model.id,
          metrics: {
            latencyMs,
            tokensUsed: 0, 
            retries,
            schemaRepairs,
            fallbackCount
          }
        };

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        errors.push(`${model.id}: ${errorMessage}`);
        logger.warn({ requestId, error: errorMessage, modelId: model.id }, "Model generation failed. Attempting fallback...");
        fallbackCount++;
      }
    }

    logger.error({ requestId, strategy, errors }, "All models in the cascade failed.");
    throw new Error(`The AI Platform exhausted all models. Errors: ${errors.join(" | ")}`);
  }

  private buildRoutingCascade(strategy: RoutingStrategy, preferredProviderId?: ProviderId, preferredModelId?: string) {
    let cascade = [...MODEL_REGISTRY];
    
    // Filter out models belonging to providers we don't have API keys for
    cascade = cascade.filter(m => this.adapters.has(m.providerId));

    switch (strategy) {
      case "manual":
        // Prioritize the requested model, but keep others as fallbacks
        const requested = cascade.find(m => m.id === preferredModelId);
        if (requested) {
          cascade = [requested, ...cascade.filter(m => m.id !== preferredModelId)];
        } else if (preferredProviderId) {
          // If model not found, but provider requested, prioritize provider's best models
          cascade.sort((a, b) => {
            if (a.providerId === preferredProviderId && b.providerId !== preferredProviderId) return -1;
            if (a.providerId !== preferredProviderId && b.providerId === preferredProviderId) return 1;
            return 0;
          });
        }
        break;
        
      case "highest_quality":
        cascade.sort((a, b) => b.qualityRating - a.qualityRating);
        break;
        
      case "fastest":
        cascade.sort((a, b) => b.speedRating - a.speedRating);
        break;
        
      case "lowest_cost":
        cascade.sort((a, b) => a.estimatedCostPer1M - b.estimatedCostPer1M);
        break;

      case "reasoning_optimized":
        cascade.sort((a, b) => b.reasoningRating - a.reasoningRating);
        break;
        
      case "automatic":
      case "balanced":
      default:
        // Balanced: Good quality, reasonable speed
        cascade.sort((a, b) => {
          const scoreA = (a.qualityRating * 2) + a.speedRating;
          const scoreB = (b.qualityRating * 2) + b.speedRating;
          return scoreB - scoreA;
        });
        break;
    }

    return cascade;
  }
}

// Export a singleton instance of the platform
export const aiPlatform = new AIPlatform();
