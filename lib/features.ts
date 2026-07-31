import { env } from "@/lib/env";

export const FEATURES = {
  // Free tier features
  ENABLE_GENERATION: true,
  ENABLE_EXPORT: true,
  
  // Premium / Future features that can be toggled
  ENABLE_CHAT: process.env.NEXT_PUBLIC_ENABLE_CHAT === "true",
  ENABLE_PROJECTS: process.env.NEXT_PUBLIC_ENABLE_PROJECTS === "true",
  ENABLE_TEAMS: process.env.NEXT_PUBLIC_ENABLE_TEAMS === "true",
} as const;

export type FeatureFlag = keyof typeof FEATURES;

export function isFeatureEnabled(feature: FeatureFlag): boolean {
  return FEATURES[feature] ?? false;
}
