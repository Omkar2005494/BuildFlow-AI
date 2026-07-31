"use client";

import React, { useMemo } from "react";
import { useBuildFlowStore } from "@/store/buildflow-store";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Lock, CreditCard, Brain, BarChart, Bell, Zap, Map, Cloud, Database, Box, Layers, 
  CheckCircle2, Clock, Calendar, Users, Rocket, Layout, FileText, Settings, Shield, Server, ArrowRightLeft, AppWindow
} from "lucide-react";

export function OverviewCard() {
  const { buildFlow } = useBuildFlowStore();
  if (!buildFlow) return null;

  const { overview, features } = buildFlow;

  // Stagger variants for smooth loading
  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div 
      className="space-y-8 font-sans pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* 1. Executive Header */}
      <motion.div variants={itemVariants} className="relative rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 rounded-full border border-primary/20">
                {overview.projectCategory}
              </span>
              <span className="px-3 py-1 text-xs font-medium uppercase tracking-widest text-white/50 bg-white/5 rounded-full border border-white/10">
                {overview.complexityBadge}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
              {overview.projectName}
            </h1>
            <p className="text-lg text-white/70 max-w-2xl leading-relaxed text-balance">
              {overview.executiveSummary}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {overview.projectCharacteristics.map((char, i) => (
                <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 text-white/70 border border-white/5">
                  <CheckCircle2 className="w-3 h-3 mr-1.5 text-emerald-400" />
                  {char}
                </span>
              ))}
            </div>
          </div>
          
          <div className="shrink-0 flex items-center justify-center">
            <RadialGauge score={overview.buildQuality.overallScore} />
          </div>
        </div>
      </motion.div>

      {/* 2. Executive Metrics */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <MetricBox icon={Box} label="Modules" value={overview.executiveMetrics.modulesCount} />
        <MetricBox icon={Database} label="Tables" value={overview.executiveMetrics.tablesCount} />
        <MetricBox icon={ArrowRightLeft} label="Endpoints" value={overview.executiveMetrics.apiEndpointsCount} />
        <MetricBox icon={Layers} label="Phases" value={overview.executiveMetrics.developmentPhases} />
        <MetricBox icon={FileText} label="Est. LOC" value={overview.executiveMetrics.estimatedLOC} />
        <MetricBox icon={Rocket} label="Sprints" value={overview.executiveMetrics.sprintCount} />
        <MetricBox icon={Server} label="Services" value={overview.executiveMetrics.infrastructureServices} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Intelligent Bento Layout for Features */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight">Core Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <BentoFeatureCard key={i} feature={feature} index={i} />
              ))}
            </div>
          </motion.div>

          {/* Business Metrics */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight">Project Estimates</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <BusinessMetric icon={Clock} label="Timeline" value={overview.businessMetrics.estimatedDevelopmentTime} />
              <BusinessMetric icon={Users} label="Team Size" value={overview.businessMetrics.estimatedTeamSize} />
              <BusinessMetric icon={CreditCard} label="Project Cost" value={overview.businessMetrics.estimatedProjectCost} />
              <BusinessMetric icon={Settings} label="Maintenance" value={overview.businessMetrics.maintenanceComplexity} />
              <BusinessMetric icon={BarChart} label="Scaling Difficulty" value={overview.businessMetrics.scalingDifficulty} />
              <BusinessMetric icon={Shield} label="Technical Risk" value={overview.businessMetrics.technicalRisk} />
            </div>
          </motion.div>
          
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-8">
          
          {/* Readiness Dashboard */}
          <motion.div variants={itemVariants} className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6">
            <h3 className="text-lg font-bold tracking-tight mb-5">Readiness</h3>
            <div className="space-y-4">
              <ReadinessRow label="Architecture" status={overview.readiness.architecture} />
              <ReadinessRow label="Database" status={overview.readiness.database} />
              <ReadinessRow label="API" status={overview.readiness.api} />
              <ReadinessRow label="Folder Structure" status={overview.readiness.folderStructure} />
              <ReadinessRow label="Roadmap" status={overview.readiness.roadmap} />
              <ReadinessRow label="Documentation" status={overview.readiness.documentation} />
              <ReadinessRow label="Deployment" status={overview.readiness.deployment} />
              <ReadinessRow label="Security" status={overview.readiness.security} />
            </div>
          </motion.div>

          {/* AI Architect Insights */}
          <motion.div variants={itemVariants} className="rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Brain className="w-24 h-24 text-primary" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold tracking-tight text-primary">Architect Insights</h3>
              </div>
              <ul className="space-y-3">
                {overview.aiArchitectInsights.map((insight, i) => (
                  <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                    <span className="text-primary mt-1 shrink-0">•</span>
                    <span className="leading-snug">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Technology Stack Summary */}
          <motion.div variants={itemVariants} className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6">
            <h3 className="text-lg font-bold tracking-tight mb-4">Technology Stack</h3>
            <div className="flex flex-wrap gap-2">
              {overview.technologySummary.map((tech, i) => (
                <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 transition-colors">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
          
        </div>
      </div>
    </motion.div>
  );
}

// --- Subcomponents ---

function RadialGauge({ score }: { score: number }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  let colorClass = "text-emerald-500";
  if (score < 60) colorClass = "text-rose-500";
  else if (score < 80) colorClass = "text-amber-500";

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-white/5"
          />
          {/* Animated Foreground Circle */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeLinecap="round"
            className={colorClass}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-black tracking-tighter text-white">{score}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Score</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-semibold tracking-wide text-white/70">Build Quality</span>
    </div>
  );
}

function MetricBox({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] shadow-inner hover:bg-white/[0.04] transition-colors">
      <Icon className="w-5 h-5 text-white/40 mb-2" />
      <span className="text-2xl font-bold text-white mb-1">{value}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40 text-center">{label}</span>
    </div>
  );
}

function BusinessMetric({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex flex-col p-4 rounded-xl bg-black/40 border border-white/5 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-white/40" />
        <span className="text-xs font-semibold uppercase tracking-wider text-white/50">{label}</span>
      </div>
      <span className="text-base font-bold text-white/90">{value}</span>
    </div>
  );
}

function ReadinessRow({ label, status }: { label: string, status: string }) {
  let color = "bg-white/20 text-white/50";
  let dotColor = "bg-white/30";
  let dotAnimation = "";
  
  if (status === "Ready") {
    color = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    dotColor = "bg-emerald-400";
    dotAnimation = "animate-pulse";
  } else if (status === "In Progress") {
    color = "text-amber-400 bg-amber-500/10 border-amber-500/20";
    dotColor = "bg-amber-400";
    dotAnimation = "animate-pulse";
  } else if (status === "Planned") {
    color = "text-blue-400 bg-blue-500/10 border-blue-500/20";
    dotColor = "bg-blue-400";
  }

  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm font-medium text-white/70">{label}</span>
      <div className={cn("flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-transparent text-[10px] font-bold uppercase tracking-wider", color)}>
        <span className={cn("w-1.5 h-1.5 rounded-full", dotColor, dotAnimation)} />
        {status}
      </div>
    </div>
  );
}

// Intelligent Feature Icon Mapper
function getFeatureIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("auth") || n.includes("login") || n.includes("security")) return { icon: Lock, color: "text-amber-400", bg: "bg-amber-500/10" };
  if (n.includes("pay") || n.includes("bill") || n.includes("subscript")) return { icon: CreditCard, color: "text-emerald-400", bg: "bg-emerald-500/10" };
  if (n.includes("ai ") || n.includes("model") || n.includes("smart") || n.includes("brain")) return { icon: Brain, color: "text-purple-400", bg: "bg-purple-500/10" };
  if (n.includes("analytic") || n.includes("dashboard") || n.includes("report")) return { icon: BarChart, color: "text-blue-400", bg: "bg-blue-500/10" };
  if (n.includes("notif") || n.includes("alert") || n.includes("push")) return { icon: Bell, color: "text-orange-400", bg: "bg-orange-500/10" };
  if (n.includes("real-time") || n.includes("socket") || n.includes("live") || n.includes("fast")) return { icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10" };
  if (n.includes("map") || n.includes("location") || n.includes("gps") || n.includes("track")) return { icon: Map, color: "text-teal-400", bg: "bg-teal-500/10" };
  if (n.includes("data") || n.includes("storage") || n.includes("record")) return { icon: Database, color: "text-rose-400", bg: "bg-rose-500/10" };
  if (n.includes("cloud") || n.includes("sync") || n.includes("upload")) return { icon: Cloud, color: "text-sky-400", bg: "bg-sky-500/10" };
  return { icon: AppWindow, color: "text-indigo-400", bg: "bg-indigo-500/10" };
}

function BentoFeatureCard({ feature, index }: { feature: any, index: number }) {
  const isHighPriority = feature.priority === "High";
  const { icon: Icon, color, bg } = getFeatureIcon(feature.name);
  
  // Make the first item or high priority items span 2 columns on tablet/desktop if needed
  // For simplicity, we just dynamically assign a class if it's High priority and index is 0
  const colSpanClass = (isHighPriority && index === 0) ? "md:col-span-2" : "col-span-1";
  
  return (
    <div className={cn(
      "group relative flex flex-col p-6 rounded-2xl border backdrop-blur-sm transition-all overflow-hidden",
      isHighPriority ? "bg-white/[0.03] border-white/10" : "bg-black/40 border-white/5 hover:bg-white/[0.02]",
      colSpanClass
    )}>
      {isHighPriority && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
      )}
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={cn("p-3 rounded-xl", bg)}>
          <Icon className={cn("w-6 h-6", color)} />
        </div>
        <span className={cn(
          "px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border",
          isHighPriority ? "text-primary bg-primary/10 border-primary/20" : "text-white/40 bg-white/5 border-white/5"
        )}>
          {feature.priority}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-white mb-2 relative z-10 group-hover:text-primary transition-colors">
        {feature.name}
      </h3>
      <p className="text-sm text-white/60 leading-relaxed relative z-10 line-clamp-3">
        {feature.description}
      </p>
    </div>
  );
}
