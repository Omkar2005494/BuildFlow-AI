"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiPlatform = exports.AIPlatform = void 0;
var types_1 = require("@/types");
var buildflow_prompt_1 = require("@/prompts/buildflow.prompt");
var logger_1 = require("@/lib/logger");
var registry_1 = require("./registry");
var openai_adapter_1 = require("./providers/openai.adapter");
var anthropic_adapter_1 = require("./providers/anthropic.adapter");
var gemini_adapter_1 = require("./providers/gemini.adapter");
var groq_adapter_1 = require("./providers/groq.adapter");
var AIPlatform = /** @class */ (function () {
    function AIPlatform() {
        this.adapters = new Map();
        this.registerAdapter(new openai_adapter_1.OpenAIAdapter());
        this.registerAdapter(new anthropic_adapter_1.AnthropicAdapter());
        this.registerAdapter(new gemini_adapter_1.GeminiAdapter());
        this.registerAdapter(new groq_adapter_1.GroqAdapter());
        // this.registerAdapter(new NvidiaAdapter()); // Disabled to prevent hanging
    }
    AIPlatform.prototype.registerAdapter = function (adapter) {
        if (adapter.isAvailable()) {
            this.adapters.set(adapter.id, adapter);
        }
    };
    AIPlatform.prototype.getAvailableProviders = function () {
        return Array.from(this.adapters.keys());
    };
    /**
     * Intelligently routes the request to the best model/provider based on strategy.
     * If manual mode is selected, it will attempt to use the requested provider and model.
     * Implements an automatic resiliency fallback loop.
     */
    AIPlatform.prototype.generateBuildFlow = function (idea, requestId, detailLevel, strategy, preferredProviderId, preferredModelId) {
        return __awaiter(this, void 0, void 0, function () {
            var prompt, modelCascade, retries, fallbackCount, schemaRepairs, startTime, _i, modelCascade_1, model, adapter, rawJsonString, parsedData, validatedData, latencyMs, error_1, errorMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prompt = (0, buildflow_prompt_1.getBuildFlowPrompt)(detailLevel);
                        modelCascade = this.buildRoutingCascade(strategy, preferredProviderId, preferredModelId);
                        if (modelCascade.length === 0) {
                            throw new Error("No AI providers are currently available. Please check your API keys in the AI Settings.");
                        }
                        retries = 0;
                        fallbackCount = 0;
                        schemaRepairs = 0;
                        startTime = Date.now();
                        _i = 0, modelCascade_1 = modelCascade;
                        _a.label = 1;
                    case 1:
                        if (!(_i < modelCascade_1.length)) return [3 /*break*/, 6];
                        model = modelCascade_1[_i];
                        adapter = this.adapters.get(model.providerId);
                        if (!adapter)
                            return [3 /*break*/, 5];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        logger_1.logger.info({ requestId: requestId, modelId: model.id, providerId: model.providerId, strategy: strategy }, "Attempting AI generation");
                        return [4 /*yield*/, adapter.generateJSON(prompt + "\n\n" + idea, model.id)];
                    case 3:
                        rawJsonString = _a.sent();
                        parsedData = void 0;
                        try {
                            parsedData = JSON.parse(rawJsonString);
                        }
                        catch (_b) {
                            // Attempt naive repair (strip leading/trailing commas, etc.) if needed in future
                            schemaRepairs++;
                            throw new Error("Invalid output format from AI (JSON Parse Error)");
                        }
                        validatedData = types_1.BuildFlowSchema.parse(parsedData);
                        latencyMs = Date.now() - startTime;
                        logger_1.logger.info({ requestId: requestId, latencyMs: latencyMs, providerId: model.providerId }, "Successfully generated BuildFlow");
                        return [2 /*return*/, {
                                buildFlow: validatedData,
                                providerId: model.providerId,
                                modelId: model.id,
                                metrics: {
                                    latencyMs: latencyMs,
                                    tokensUsed: 0, // Would extract from response headers if supported
                                    retries: retries,
                                    schemaRepairs: schemaRepairs,
                                    fallbackCount: fallbackCount
                                }
                            }];
                    case 4:
                        error_1 = _a.sent();
                        errorMessage = error_1 instanceof Error ? error_1.message : String(error_1);
                        logger_1.logger.warn({ requestId: requestId, error: errorMessage, modelId: model.id }, "Model generation failed. Attempting fallback...");
                        // If it was a rate limit or timeout on the same provider, maybe retry once? 
                        // For simplicity, we just cascade to the next model in the prioritized list.
                        fallbackCount++;
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6:
                        logger_1.logger.error({ requestId: requestId, strategy: strategy }, "All models in the cascade failed.");
                        throw new Error("The AI Platform exhausted all available models and recovery options. Please try again later.");
                }
            });
        });
    };
    AIPlatform.prototype.buildRoutingCascade = function (strategy, preferredProviderId, preferredModelId) {
        var _this = this;
        var cascade = __spreadArray([], registry_1.MODEL_REGISTRY, true);
        // Filter out models belonging to providers we don't have API keys for
        cascade = cascade.filter(function (m) { return _this.adapters.has(m.providerId); });
        switch (strategy) {
            case "manual":
                // Prioritize the requested model, but keep others as fallbacks
                var requested = cascade.find(function (m) { return m.id === preferredModelId; });
                if (requested) {
                    cascade = __spreadArray([requested], cascade.filter(function (m) { return m.id !== preferredModelId; }), true);
                }
                else if (preferredProviderId) {
                    // If model not found, but provider requested, prioritize provider's best models
                    cascade.sort(function (a, b) {
                        if (a.providerId === preferredProviderId && b.providerId !== preferredProviderId)
                            return -1;
                        if (a.providerId !== preferredProviderId && b.providerId === preferredProviderId)
                            return 1;
                        return 0;
                    });
                }
                break;
            case "highest_quality":
                cascade.sort(function (a, b) { return b.qualityRating - a.qualityRating; });
                break;
            case "fastest":
                cascade.sort(function (a, b) { return b.speedRating - a.speedRating; });
                break;
            case "lowest_cost":
                cascade.sort(function (a, b) { return a.estimatedCostPer1M - b.estimatedCostPer1M; });
                break;
            case "reasoning_optimized":
                cascade.sort(function (a, b) { return b.reasoningRating - a.reasoningRating; });
                break;
            case "automatic":
            case "balanced":
            default:
                // Balanced: Good quality, reasonable speed
                cascade.sort(function (a, b) {
                    var scoreA = (a.qualityRating * 2) + a.speedRating;
                    var scoreB = (b.qualityRating * 2) + b.speedRating;
                    return scoreB - scoreA;
                });
                break;
        }
        return cascade;
    };
    return AIPlatform;
}());
exports.AIPlatform = AIPlatform;
// Export a singleton instance of the platform
exports.aiPlatform = new AIPlatform();
