"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODEL_REGISTRY = void 0;
exports.getModelsByProvider = getModelsByProvider;
exports.getModelById = getModelById;
exports.MODEL_REGISTRY = [
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
        id: "llama-3.3-70b-versatile",
        providerId: "groq",
        displayName: "Llama 3.3 70B (Groq)",
        contextWindow: 8192,
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
    {
        id: "mixtral-8x7b-32768",
        providerId: "groq",
        displayName: "Mixtral 8x7B (Groq)",
        contextWindow: 32768,
        maxOutputTokens: 8192,
        speedRating: 5,
        qualityRating: 4,
        reasoningRating: 3.5,
        estimatedCostPer1M: 0,
        capabilities: {
            jsonOutput: true,
            vision: false,
            streaming: true,
            toolCalling: true,
            reasoning: false
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
    }
];
function getModelsByProvider(providerId) {
    return exports.MODEL_REGISTRY.filter(function (m) { return m.providerId === providerId; });
}
function getModelById(modelId) {
    return exports.MODEL_REGISTRY.find(function (m) { return m.id === modelId; });
}
