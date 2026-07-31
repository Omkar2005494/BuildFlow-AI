import React from 'react';
import { useAIPlatformStore } from '@/store/ai-platform-store';
import { MODEL_REGISTRY, getModelById } from '@/lib/ai/registry';
import { ProviderId, RoutingStrategy, ModelRegistryEntry } from '@/lib/ai/types';

interface AiDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiDashboard: React.FC<AiDashboardProps> = ({ isOpen, onClose }) => {
  const { routingStrategy, preferredModelId, detailLevel, setRoutingStrategy, setPreferredModel, setDetailLevel } = useAIPlatformStore();

  if (!isOpen) return null;

  const strategies: { value: RoutingStrategy; label: string; desc: string }[] = [
    { value: "automatic", label: "Automatic", desc: "Best balance of all metrics" },
    { value: "fastest", label: "Fastest", desc: "Prioritizes speed (lowest latency)" },
    { value: "highest_quality", label: "Highest Quality", desc: "Prioritizes architecture quality" },
    { value: "reasoning_optimized", label: "Reasoning Optimized", desc: "Deepest logic processing" },
    { value: "lowest_cost", label: "Lowest Cost", desc: "Most economical models" },
    { value: "manual", label: "Manual Override", desc: "Force a specific model" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
            AI Platform V3 Workspace
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Strategies */}
          <div className="md:col-span-1 space-y-8">
            {/* Routing Strategy */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Routing Strategy</h3>
              <div className="flex flex-col gap-2">
                {strategies.map(strat => (
                  <button
                    key={strat.value}
                    onClick={() => setRoutingStrategy(strat.value)}
                    className={`text-left p-3 rounded-lg border transition-all ${
                      routingStrategy === strat.value 
                        ? 'border-indigo-500 bg-indigo-500/10 text-white' 
                        : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-medium text-sm">{strat.label}</div>
                    <div className="text-xs opacity-70 mt-1">{strat.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Detail Level */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Generation Scale</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setDetailLevel("standard")}
                  className={`text-left p-3 rounded-lg border transition-all ${
                    detailLevel === "standard" 
                      ? 'border-emerald-500 bg-emerald-500/10 text-white' 
                      : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium text-sm">Standard Mode</div>
                  <div className="text-xs opacity-70 mt-1">~2500 tokens. Fast, concise generation. Recommended for rate-limited providers.</div>
                </button>
                <button
                  onClick={() => setDetailLevel("enterprise")}
                  className={`text-left p-3 rounded-lg border transition-all ${
                    detailLevel === "enterprise" 
                      ? 'border-blue-500 bg-blue-500/10 text-white' 
                      : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium text-sm">Enterprise Mode</div>
                  <div className="text-xs opacity-70 mt-1">~8000 tokens. Deep documentation and massive scale. Slower generation.</div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Model Selection (If Manual) */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4">
              Model Registry {routingStrategy !== "manual" && <span className="text-sm font-normal text-yellow-500 ml-2">(Manual Override Disabled)</span>}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MODEL_REGISTRY.map((model: ModelRegistryEntry) => (
                <button
                  key={model.id}
                  disabled={routingStrategy !== "manual"}
                  onClick={() => setPreferredModel(model.providerId, model.id)}
                  className={`text-left p-4 rounded-xl border transition-all relative overflow-hidden ${
                    routingStrategy !== "manual" 
                      ? 'opacity-50 cursor-not-allowed border-white/5 bg-transparent' 
                      : preferredModelId === model.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-gray-500">{model.providerId}</span>
                    <span className="text-xs font-bold text-green-400">${model.estimatedCostPer1M} / 1M</span>
                  </div>
                  <h4 className="text-white font-semibold mb-3 truncate">{model.displayName}</h4>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <span>⚡</span> {model.speedRating}/5
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🧠</span> {model.reasoningRating}/5
                    </div>
                    <div className="flex items-center gap-1">
                      <span>💎</span> {model.qualityRating}/5
                    </div>
                    <div className="flex items-center gap-1">
                      <span>📏</span> {(model.contextWindow / 1000).toFixed(0)}k ctx
                    </div>
                  </div>

                  {/* Capabilities badges */}
                  <div className="flex gap-1 mt-3 flex-wrap">
                    {model.capabilities.vision && <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px]">Vision</span>}
                    {model.capabilities.toolCalling && <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px]">Tools</span>}
                    {model.capabilities.reasoning && <span className="px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 text-[10px]">Reasoning</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
