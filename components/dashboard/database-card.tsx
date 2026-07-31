"use client";

import { useBuildFlowStore } from "@/store/buildflow-store";
import { CustomDiagram } from "@/components/shared/custom-diagram";
import { CheckCircle2, Server, Shield, Zap, TrendingUp, Layers, Database, Lock, Search, Activity, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

export function DatabaseCard() {
  const { buildFlow } = useBuildFlowStore();
  if (!buildFlow) return null;

  const insights = buildFlow.database.insights;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Database Schema</h1>
        <div className="prose prose-invert max-w-4xl text-muted-foreground text-lg text-balance bg-white/5 p-6 rounded-xl border border-white/10 shadow-inner">
          {buildFlow.database.schemaDescription}
        </div>
      </div>

      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Quality Metrics */}
          <InsightSection 
            title="Database Quality" 
            icon={<Layers className="w-5 h-5 text-indigo-400" />}
            className="md:col-span-2 xl:col-span-3 bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <MetricItem label="Normalization" value={insights.quality.normalizationLevel} />
              <MetricItem label="Complexity" value={insights.quality.estimatedComplexity} />
              <MetricItem label="Tables" value={insights.quality.tableCount} />
              <MetricItem label="Relationships" value={insights.quality.relationshipCount} />
              <MetricItem label="Junctions" value={insights.quality.junctionTableCount} />
              <MetricItem label="Indexed Cols" value={insights.quality.indexedColumns} />
            </div>
          </InsightSection>

          {/* Performance */}
          <InsightSection 
            title="Performance" 
            icon={<Zap className="w-5 h-5 text-amber-400" />}
            className="bg-gradient-to-br from-amber-500/5 to-transparent"
          >
            <BulletList title="Suggested Indexes" items={insights.performance.suggestedIndexes} icon={<Search className="w-3.5 h-3.5" />} />
            <BulletList title="Bottlenecks" items={insights.performance.potentialQueryBottlenecks} icon={<Activity className="w-3.5 h-3.5" />} color="text-rose-400" />
            <BulletList title="Caching Targets" items={insights.performance.cachingTargets} icon={<Cpu className="w-3.5 h-3.5" />} />
          </InsightSection>

          {/* Scalability */}
          <InsightSection 
            title="Scalability" 
            icon={<Server className="w-5 h-5 text-blue-400" />}
            className="bg-gradient-to-br from-blue-500/5 to-transparent"
          >
            <BulletList title="Partitioning" items={insights.scalability.partitioningRecommendations} icon={<Database className="w-3.5 h-3.5" />} />
            <BulletList title="Horizontal Scaling" items={insights.scalability.horizontalScaling} icon={<TrendingUp className="w-3.5 h-3.5" />} />
            <BulletList title="Archiving Strategy" items={insights.scalability.archivingStrategy} icon={<Layers className="w-3.5 h-3.5" />} />
          </InsightSection>

          {/* Security & Future */}
          <div className="flex flex-col gap-6">
            <InsightSection 
              title="Security" 
              icon={<Shield className="w-5 h-5 text-emerald-400" />}
              className="bg-gradient-to-br from-emerald-500/5 to-transparent"
            >
              <BulletList title="Sensitive Data" items={insights.security.sensitiveTables} icon={<Lock className="w-3.5 h-3.5" />} color="text-emerald-400" />
              <BulletList title="Audit Logging" items={insights.security.auditLogging} icon={<CheckCircle2 className="w-3.5 h-3.5" />} />
            </InsightSection>

            <InsightSection 
              title="Future Readiness" 
              icon={<TrendingUp className="w-5 h-5 text-purple-400" />}
              className="bg-gradient-to-br from-purple-500/5 to-transparent flex-1"
            >
              <BulletList title="Supported Features" items={insights.futureExpansion.supportedFeatures} icon={<CheckCircle2 className="w-3.5 h-3.5" />} />
              <BulletList title="Potential Modules" items={insights.futureExpansion.potentialModules} icon={<Layers className="w-3.5 h-3.5" />} />
            </InsightSection>
          </div>
        </div>
      )}

      <div className="mt-8 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        <CustomDiagram chart={buildFlow.database.diagram} />
      </div>
    </div>
  );
}

function InsightSection({ title, icon, children, className }: { title: string, icon: React.ReactNode, children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("rounded-xl border border-white/10 bg-black/40 p-5 backdrop-blur-md shadow-lg", className)}>
      <div className="flex items-center gap-2 mb-5 border-b border-white/10 pb-3">
        {icon}
        <h3 className="font-semibold text-white tracking-wide">{title}</h3>
      </div>
      <div className="flex flex-col gap-5">
        {children}
      </div>
    </div>
  );
}

function MetricItem({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="flex flex-col bg-white/5 rounded-lg p-3 border border-white/5">
      <span className="text-[11px] font-medium text-white/50 uppercase tracking-wider mb-1">{label}</span>
      <span className="text-lg font-bold text-white">{value}</span>
    </div>
  );
}

function BulletList({ title, items, icon, color = "text-white/70" }: { title: string, items: string[], icon: React.ReactNode, color?: string }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="flex flex-col">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">{title}</h4>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm">
            <span className={cn("mt-0.5 shrink-0", color)}>{icon}</span>
            <span className="text-white/80 leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
