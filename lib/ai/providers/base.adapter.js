"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseProviderAdapter = void 0;
var BaseProviderAdapter = /** @class */ (function () {
    function BaseProviderAdapter() {
    }
    /**
     * Utility to safely extract JSON from markdown blocks if the LLM
     * disobeys JSON mode and wraps the response in ```json ... ```
     */
    BaseProviderAdapter.prototype.extractJSON = function (text) {
        var jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
            return jsonMatch[1].trim();
        }
        return text.trim();
    };
    return BaseProviderAdapter;
}());
exports.BaseProviderAdapter = BaseProviderAdapter;
