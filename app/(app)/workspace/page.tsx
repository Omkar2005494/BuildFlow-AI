"use client";

import { useBuildFlowStore } from "@/store/buildflow-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const LoadingFallback = () => (
  <div className="w-full min-h-[300px] flex items-center justify-center">
    <Loader2 className="w-6 h-6 animate-spin text-primary" />
  </div>
);

const OverviewCard = dynamic(() => import("@/components/dashboard/overview-card").then(m => m.OverviewCard), { loading: LoadingFallback });
const ArchitectureCard = dynamic(() => import("@/components/dashboard/architecture-card").then(m => m.ArchitectureCard), { loading: LoadingFallback });
const DatabaseCard = dynamic(() => import("@/components/dashboard/database-card").then(m => m.DatabaseCard), { loading: LoadingFallback });
const ApiViewer = dynamic(() => import("@/components/dashboard/api-viewer").then(m => m.ApiViewer), { loading: LoadingFallback });
const FolderStructureCard = dynamic(() => import("@/components/dashboard/folder-structure-card").then(m => m.FolderStructureCard), { loading: LoadingFallback });
const RoadmapCard = dynamic(() => import("@/components/dashboard/roadmap-card").then(m => m.RoadmapCard), { loading: LoadingFallback });
const ReadmeCard = dynamic(() => import("@/components/dashboard/readme-card").then(m => m.ReadmeCard), { loading: LoadingFallback });
const RiskAssessmentCard = dynamic(() => import("@/components/dashboard/risk-assessment-card").then(m => m.RiskAssessmentCard), { loading: LoadingFallback });
const FutureScopeCard = dynamic(() => import("@/components/dashboard/future-scope-card").then(m => m.FutureScopeCard), { loading: LoadingFallback });

export default function DashboardPage() {
  const { buildFlow, selectedSection } = useBuildFlowStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!buildFlow) {
      router.push("/");
    }
  }, [buildFlow, router]);

  if (!mounted || !buildFlow) return null;

  const renderSection = () => {
    switch (selectedSection) {
      case "overview": return <OverviewCard />;
      case "architecture": return <ArchitectureCard />;
      case "database": return <DatabaseCard />;
      case "api": return <ApiViewer />;
      case "folder-structure": return <FolderStructureCard />;
      case "roadmap": return <RoadmapCard />;
      case "readme": return <ReadmeCard />;
      case "risks": return <RiskAssessmentCard />;
      case "future": return <FutureScopeCard />;
      default: return <OverviewCard />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-500 pb-20">
      {renderSection()}
    </div>
  );
}
