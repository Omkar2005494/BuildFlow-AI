import { ModelRegistryEntry } from "./types";

export const MODEL_REGISTRY: ModelRegistryEntry[] = [
  // OPENAI
  {
    id: "gpt-4o",
    providerId: "openai",
    displayName: "GPT-4o",
    contextWindow: 128000,
    maxOutputTokens: 4096,
    speedRating: 4,
    qualityRating: 5,
    reasoningRating: 5,
    estimatedCostPer1M: 15.00,
    capabilities: {
      jsonOutput: true,
      vision: true,
      streaming: true,
      toolCalling: true,
      reasoning: true
    }
  },
  {
    id: "gpt-4o-mini",
    providerId: "openai",
    displayName: "GPT-4o Mini",
    contextWindow: 128000,
    maxOutputTokens: 16384,
    speedRating: 5,
    qualityRating: 3.5,
    reasoningRating: 3,
    estimatedCostPer1M: 0.60,
    capabilities: {
      jsonOutput: true,
      vision: true,
      streaming: true,
      toolCalling: true,
      reasoning: false
    }
  },

  // ANTHROPIC
  {
    id: "claude-3-5-sonnet-20240620",
    providerId: "anthropic",
    displayName: "Claude 3.5 Sonnet",
    contextWindow: 200000,
    maxOutputTokens: 8192,
    speedRating: 4,
    qualityRating: 5,
    reasoningRating: 5,
    estimatedCostPer1M: 15.00,
    capabilities: {
      jsonOutput: true,
      vision: true,
      streaming: true,
      toolCalling: true,
      reasoning: true
    }
  },
  {
    id: "claude-3-haiku-20240307",
    providerId: "anthropic",
    displayName: "Claude 3 Haiku",
    contextWindow: 200000,
    maxOutputTokens: 4096,
    speedRating: 5,
    qualityRating: 3,
    reasoningRating: 3,
    estimatedCostPer1M: 1.25,
    capabilities: {
      jsonOutput: true,
      vision: true,
      streaming: true,
      toolCalling: true,
      reasoning: false
    }
  },

  // GOOGLE GEMINI
  {
    id: "gemini-1.5-pro",
    providerId: "gemini",
    displayName: "Gemini 1.5 Pro",
    contextWindow: 2000000,
    maxOutputTokens: 8192,
    speedRating: 4,
    qualityRating: 5,
    reasoningRating: 4.5,
    estimatedCostPer1M: 10.50,
    capabilities: {
      jsonOutput: true,
      vision: true,
      streaming: true,
      toolCalling: true,
      reasoning: true
    }
  },
  {
    id: "gemini-1.5-flash",
    providerId: "gemini",
    displayName: "Gemini 1.5 Flash",
    contextWindow: 1000000,
    maxOutputTokens: 8192,
    speedRating: 5,
    qualityRating: 4,
    reasoningRating: 3.5,
    estimatedCostPer1M: 0.30,
    capabilities: {
      jsonOutput: true,
      vision: true,
      streaming: true,
      toolCalling: true,
      reasoning: false
    }
  },

  // GROQ
  {
    id: "qwen/qwen3.8-27b",
    providerId: "groq",
    displayName: "Qwen 3.8 27B (Groq Fast)",
    contextWindow: 128000,
    maxOutputTokens: 8192,
    speedRating: 5,
    qualityRating: 5,
    reasoningRating: 5,
    estimatedCostPer1M: 0,
    capabilities: {
      jsonOutput: true,
      vision: false,
      streaming: true,
      toolCalling: true,
      reasoning: true
    }
  },
  {
    id: "openai/gpt-oss-120b",
    providerId: "groq",
    displayName: "GPT-OSS 120B (Groq Deep)",
    contextWindow: 128000,
    maxOutputTokens: 8192,
    speedRating: 5,
    qualityRating: 5,
    reasoningRating: 5,
    estimatedCostPer1M: 0,
    capabilities: {
      jsonOutput: true,
      vision: false,
      streaming: true,
      toolCalling: true,
      reasoning: true
    }
  },
  {
    id: "llama-3.1-8b-instant",
    providerId: "groq",
    displayName: "Llama 3.1 8B Instant (Groq)",
    contextWindow: 128000,
    maxOutputTokens: 8192,
    speedRating: 5,
    qualityRating: 4.5,
    reasoningRating: 4,
    estimatedCostPer1M: 0,
    capabilities: {
      jsonOutput: true,
      vision: false,
      streaming: true,
      toolCalling: true,
      reasoning: true
    }
  },

  // NVIDIA
  {
    id: "meta/llama-3.1-70b-instruct",
    providerId: "nvidia",
    displayName: "Llama 3.1 70B (NVIDIA)",
    contextWindow: 128000,
    maxOutputTokens: 8192,
    speedRating: 2, // Throttled free tier
    qualityRating: 4.5,
    reasoningRating: 4,
    estimatedCostPer1M: 0,
    capabilities: {
      jsonOutput: true,
      vision: false,
      streaming: true,
      toolCalling: true,
      reasoning: true
    }
  },

  // OLLAMA (LOCAL)
  {
    id: "llama3.2:3b",
    providerId: "ollama",
    displayName: "Llama 3.2 3B (Local)",
    contextWindow: 131072,
    maxOutputTokens: 8192,
    speedRating: 5,
    qualityRating: 3.5,
    reasoningRating: 3,
    estimatedCostPer1M: 0,
    capabilities: {
      jsonOutput: true,
      vision: false,
      streaming: false,
      toolCalling: true,
      reasoning: false
    }
  },
  {
    id: "llama3.2:1b",
    providerId: "ollama",
    displayName: "Llama 3.2 1B (Local)",
    contextWindow: 131072,
    maxOutputTokens: 8192,
    speedRating: 5,
    qualityRating: 2.5,
    reasoningRating: 2,
    estimatedCostPer1M: 0,
    capabilities: {
      jsonOutput: true,
      vision: false,
      streaming: false,
      toolCalling: true,
      reasoning: false
    }
  }
];

export function getModelsByProvider(providerId: string): ModelRegistryEntry[] {
  return MODEL_REGISTRY.filter(m => m.providerId === providerId);
}

export function getModelById(modelId: string): ModelRegistryEntry | undefined {
  return MODEL_REGISTRY.find(m => m.id === modelId);
}
