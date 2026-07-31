"use client";

import React, { useState } from "react";
import { useBuildFlowStore } from "@/store/buildflow-store";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Network, 
  Database, 
  Terminal, 
  FolderTree, 
  Map, 
  FileText, 
  AlertTriangle, 
  Lightbulb,
  Download,
  Sparkles,
  ChevronLeft,
  Menu,
  X,
  Code2
} from "lucide-react";
import { exportToMarkdown, exportToJson } from "@/services/export.service";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { saveProject } from "@/services/db.service";

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "architecture", label: "Architecture", icon: Network },
  { id: "database", label: "Database", icon: Database },
  { id: "api", label: "API Design", icon: Terminal },
  { id: "folder-structure", label: "Folder Structure", icon: FolderTree },
  { id: "roadmap", label: "Roadmap", icon: Map },
  { id: "readme", label: "README", icon: FileText },
  { id: "risks", label: "Risks & Mitigations", icon: AlertTriangle },
  { id: "future", label: "Future Scope", icon: Lightbulb },
];

export function Sidebar() {
  const { selectedSection, setSelectedSection, buildFlow } = useBuildFlowStore();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!buildFlow) return null;

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button 
        variant="outline" 
        size="icon" 
        className="md:hidden fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-md border-border/50 shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
      </Button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-64 border-r border-border bg-card flex flex-col h-full flex-shrink-0 fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 shadow-xl md:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-border/50 md:pt-6 pt-16">
          <Link href="/" className="inline-flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span className="font-medium text-sm">New BuildFlow</span>
          </Link>
          <div className="mt-4 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-semibold tracking-tight truncate">
              {buildFlow.overview.projectName}
            </h2>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = selectedSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedSection(item.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1 h-4 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Project</p>
          <Button 
            variant="default" 
            className="w-full justify-start shadow-sm"
            onClick={async () => {
              if (!user) {
                alert("Please sign in to save your project.");
                return;
              }
              try {
                const projectId = buildFlow.overview.projectName.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().substring(0, 20) + "-" + Date.now();
                const name = buildFlow.overview.projectName.substring(0, 30);
                await saveProject(user.uid, projectId, name, buildFlow.overview.executiveSummary, buildFlow);
                alert("Project saved successfully!");
              } catch (error) {
                console.error(error);
                alert("Failed to save project.");
              }
            }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Save Project
          </Button>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-3">Export</p>
          <Button 
            variant="outline" 
            className="w-full justify-start border-border/50 bg-background hover:bg-muted"
            onClick={() => exportToMarkdown(buildFlow)}
          >
            <Download className="w-4 h-4 mr-2" />
            Markdown
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start border-border/50 bg-background hover:bg-muted"
            onClick={() => exportToJson(buildFlow)}
          >
            <Code2 className="w-4 h-4 mr-2" />
            JSON
          </Button>
        </div>
      </aside>
    </>
  );
}
