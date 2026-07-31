"use client";

import { useBuildFlowStore } from "@/store/buildflow-store";
import { AlertTriangle, ShieldCheck } from "lucide-react";

export function RiskAssessmentCard() {
  const { buildFlow } = useBuildFlowStore();
  if (!buildFlow) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Risks & Mitigations</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Detailed technical, operational, and business risks with comprehensive mitigation strategies.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-8">
        {(buildFlow.risks || []).map((item, index) => {
          const title = item.title || item.risk;
          const mitigation = item.mitigationStrategy || item.mitigation;
          
          return (
            <div key={index} className="bg-card border border-border/50 rounded-xl p-6 flex flex-col space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div className="flex items-center space-x-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="font-semibold text-xl text-foreground">{title}</h3>
                </div>
                {(item.type || item.severity || item.probability) && (
                  <div className="flex flex-wrap gap-2">
                    {item.type && <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">{item.type}</span>}
                    {item.severity && <span className={`px-3 py-1 text-xs font-medium rounded-full ${item.severity === 'Critical' ? 'bg-red-500/10 text-red-500' : item.severity === 'High' ? 'bg-orange-500/10 text-orange-500' : 'bg-yellow-500/10 text-yellow-500'}`}>Severity: {item.severity}</span>}
                    {item.probability && <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-xs font-medium rounded-full">Probability: {item.probability}</span>}
                  </div>
                )}
              </div>
              
              {item.description && (
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{item.description}</p>
              )}
              
              {(item.impactAnalysis || item.financialImpact) && (
                <div className="bg-secondary/20 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-sm mb-1">Impact Analysis</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.impactAnalysis}</p>
                  {item.financialImpact && (
                    <p className="text-red-500/80 text-sm mt-2 font-medium">Financial Impact: {item.financialImpact}</p>
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2 text-emerald-500">
                        <ShieldCheck className="w-5 h-5" />
                        <h3 className="font-semibold text-lg text-foreground">Mitigation Strategy</h3>
                      </div>
                      {item.owner && (
                        <span className="text-xs bg-muted px-2 py-1 rounded-md">Owner: {item.owner}</span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{mitigation}</p>
                  </div>
                  
                  {item.actionItems && item.actionItems.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-sm mb-2">Action Items:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                        {item.actionItems.map((action, i) => (
                          <li key={i}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {item.detectionMethod && (
                    <div className="mt-4 bg-blue-500/5 p-3 rounded-md border border-blue-500/10">
                      <h4 className="font-medium text-xs text-blue-500 uppercase tracking-wider mb-1">Detection Method</h4>
                      <p className="text-sm text-muted-foreground">{item.detectionMethod}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-4">
                  {item.contingencyPlan && (
                    <div>
                      <div className="flex items-center space-x-2 text-amber-500 mb-3">
                        <AlertTriangle className="w-5 h-5" />
                        <h3 className="font-semibold text-lg text-foreground">Contingency Plan</h3>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.contingencyPlan}</p>
                    </div>
                  )}
                  
                  {item.residualRisk && (
                    <div className="mt-4 p-3 rounded-md border border-border/50 bg-background/50 flex items-center justify-between">
                      <span className="text-sm font-medium">Residual Risk Post-Mitigation:</span>
                      <span className={`px-2 py-1 text-xs font-bold rounded ${item.residualRisk === 'High' || item.residualRisk === 'Critical' ? 'bg-red-500/20 text-red-500' : item.residualRisk === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                        {item.residualRisk}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
