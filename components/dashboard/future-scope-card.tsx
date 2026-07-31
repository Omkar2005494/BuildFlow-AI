"use client";

import { useBuildFlowStore } from "@/store/buildflow-store";
import { Rocket } from "lucide-react";

export function FutureScopeCard() {
  const { buildFlow } = useBuildFlowStore();
  if (!buildFlow) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Future Scope</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Ideas for V2 and beyond.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6">
        {buildFlow.futureEnhancements?.map((enhancement, index) => {
          // Handle legacy string array
          if (typeof enhancement === 'string') {
            return (
              <div key={index} className="bg-card border border-border/50 rounded-xl p-6 flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg mt-1">
                  <Rocket className="w-6 h-6 text-primary flex-shrink-0" />
                </div>
                <div className="pt-2">
                  <span className="text-foreground/90 text-lg leading-relaxed">{enhancement}</span>
                </div>
              </div>
            );
          }

          // Handle new detailed object array
          return (
            <div key={index} className="bg-card border border-border/50 rounded-xl p-6 flex flex-col space-y-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg mt-1">
                    <Rocket className="w-6 h-6 text-primary flex-shrink-0" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-foreground mb-1">{enhancement.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{enhancement.description}</p>
                  </div>
                </div>
                {(enhancement.category || enhancement.complexity) && (
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    {enhancement.category && <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">{enhancement.category}</span>}
                    {enhancement.complexity && <span className={`px-3 py-1 text-xs font-medium rounded-full ${enhancement.complexity === 'High' ? 'bg-red-500/10 text-red-500' : enhancement.complexity === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>Complexity: {enhancement.complexity}</span>}
                  </div>
                )}
              </div>

              {(enhancement.businessValue || (enhancement.technicalPrerequisites && enhancement.technicalPrerequisites.length > 0)) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                  {enhancement.businessValue && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-foreground">Business Value</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{enhancement.businessValue}</p>
                    </div>
                  )}
                  {enhancement.technicalPrerequisites && enhancement.technicalPrerequisites.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-foreground">Technical Prerequisites</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                        {enhancement.technicalPrerequisites.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
