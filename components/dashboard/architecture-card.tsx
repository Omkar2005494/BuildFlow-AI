"use client";

import { useBuildFlowStore } from "@/store/buildflow-store";
import { CustomDiagram } from "@/components/shared/custom-diagram";
import { ArrowRight, PlayCircle } from "lucide-react";

export function ArchitectureCard() {
  const { buildFlow, setSelectedSection } = useBuildFlowStore();
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

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-emerald-400" />
            Next Step: Develop Live Application Software
          </h3>
          <p className="text-xs text-white/50 mt-0.5">
            The Autonomous AI Engineering Swarm takes this architectural blueprint and builds the live interactive application in the sandbox.
          </p>
        </div>
        <button
          onClick={() => setSelectedSection("ai-team")}
          className="shrink-0 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20"
        >
          <span>Develop Live Application</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
