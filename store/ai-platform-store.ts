import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProviderId, RoutingStrategy } from "@/lib/ai/types";

interface AIPlatformState {
  routingStrategy: RoutingStrategy;
  preferredProviderId?: ProviderId;
  preferredModelId?: string;
  detailLevel: "standard" | "enterprise";
  
  setRoutingStrategy: (strategy: RoutingStrategy) => void;
  setPreferredModel: (providerId?: ProviderId, modelId?: string) => void;
  setDetailLevel: (level: "standard" | "enterprise") => void;
}

export const useAIPlatformStore = create<AIPlatformState>()(
  persist(
    (set) => ({
      routingStrategy: "automatic",
      detailLevel: "enterprise",
      
      setRoutingStrategy: (strategy) => set({ routingStrategy: strategy }),
      setPreferredModel: (providerId, modelId) => set({ preferredProviderId: providerId, preferredModelId: modelId }),
      setDetailLevel: (level) => set({ detailLevel: level }),
    }),
    {
      name: "ai-platform-storage",
    }
  )
);
