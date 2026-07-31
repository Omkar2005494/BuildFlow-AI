import { z } from "zod";
import { BuildFlow } from "@/types";

export type ProviderId = "openai" | "anthropic" | "gemini" | "groq" | "nvidia";
export type RoutingStrategy = "automatic" | "balanced" | "fastest" | "highest_quality" | "lowest_cost" | "reasoning_optimized" | "manual";

export interface CapabilityMatrix {
  jsonOutput: boolean;
  vision: boolean;
  streaming: boolean;
  toolCalling: boolean;
  reasoning: boolean;
}

export interface ModelRegistryEntry {
  id: string; // The literal model ID used by the provider's API (e.g. gpt-4o)
  providerId: ProviderId;
  displayName: string;
  contextWindow: number;
  maxOutputTokens: number;
  speedRating: number; // 1-5 stars
  qualityRating: number; // 1-5 stars
  reasoningRating: number; // 1-5 stars
  estimatedCostPer1M: number; // USD per 1M output tokens (for relative comparison)
  capabilities: CapabilityMatrix;
}

export interface PlatformMetrics {
  latencyMs: number;
  tokensUsed: number;
  retries: number;
  schemaRepairs: number;
  fallbackCount: number;
}

export interface GenerationResult {
  buildFlow: BuildFlow;
  providerId: ProviderId;
  modelId: string;
  metrics: PlatformMetrics;
}

export interface ProviderAdapter {
  id: ProviderId;
  name: string;
  
  /**
   * Generates a BuildFlow JSON object.
   * Throws an error if generation fails, so the orchestrator can trigger the recovery pipeline.
   */
  generateJSON(prompt: string, modelId: string): Promise<string>;
  
  /**
   * Returns true if the provider is currently available (e.g. API keys are present)
   */
  isAvailable(): boolean;
}
