"use client";

import { useBuildFlowStore } from "@/store/buildflow-store";
import { CustomDiagram } from "@/components/shared/custom-diagram";

export function ArchitectureCard() {
  const { buildFlow } = useBuildFlowStore();
  if (!buildFlow) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg text-balance">
          {buildFlow.architecture.description}
        </p>
      </div>

      <div className="mt-8">
        <CustomDiagram chart={buildFlow.architecture.diagram} />
      </div>
    </div>
  );
}
