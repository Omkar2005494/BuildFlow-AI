"use client";

import React, { useState, useMemo } from "react";
import { useBuildFlowStore } from "@/store/buildflow-store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  Folder, FolderOpen, File, FileCode, FileJson, FileText,
  ChevronRight, ChevronDown, Search, Layers, ShieldCheck, 
  Settings, Database, Network, Clock, Users, ArrowRightLeft, 
  Info, Maximize2, Minimize2, CheckCircle2
} from "lucide-react";

export function FolderStructureCard() {
  const { buildFlow } = useBuildFlowStore();
  if (!buildFlow) return null;

  if (typeof buildFlow.folderStructure === 'string') {
    return <LegacyFolderViewer content={buildFlow.folderStructure} />;
  }

  return <PremiumFolderViewer data={buildFlow.folderStructure} />;
}

// ----------------------------------------------------------------------
// LEGACY VIEWER
// ----------------------------------------------------------------------
function LegacyFolderViewer({ content }: { content: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Folder Structure</h1>
        <p className="text-muted-foreground mt-2 text-lg">Recommended project directory organization.</p>
      </div>
      <div className="mt-8 bg-card border border-border/50 rounded-xl p-6 overflow-x-auto">
        <pre className="text-sm font-mono text-foreground/80 leading-relaxed">
          {content}
        </pre>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// PREMIUM VIEWER
// ----------------------------------------------------------------------
function PremiumFolderViewer({ data }: { data: any }) {
  const { insights, tree } = data;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  
  // Manage expanded state globally to support expand/collapse all
  // We'll store expanded paths. A path is simply the node's name chain.
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['root']));
  const [expandAllCounter, setExpandAllCounter] = useState(0);

  const handleExpandAll = () => {
    const allPaths = new Set<string>();
    const traverse = (nodes: any[], currentPath: string) => {
      nodes.forEach(node => {
        const path = currentPath ? `${currentPath}/${node.name}` : node.name;
        if (node.type === 'folder') {
          allPaths.add(path);
          if (node.children) traverse(node.children, path);
        }
      });
    };
    traverse(tree || [], "");
    setExpandedPaths(allPaths);
    setExpandAllCounter(c => c + 1);
  };

  const handleCollapseAll = () => {
    setExpandedPaths(new Set());
    setExpandAllCounter(c => c + 1);
  };

  const togglePath = (path: string) => {
    const next = new Set(expandedPaths);
    if (next.has(path)) next.delete(path);
    else next.add(path);
    setExpandedPaths(next);
  };

  // Filter tree based on search
  const filteredTree = useMemo(() => {
    if (!searchTerm) return tree;
    const term = searchTerm.toLowerCase();

    const filterNodes = (nodes: any[]): any[] => {
      return nodes.map(node => {
        const matches = node.name.toLowerCase().includes(term) || (node.description || '').toLowerCase().includes(term);
        let filteredChildren = [];
        if (node.children) {
          filteredChildren = filterNodes(node.children);
        }
        if (matches || filteredChildren.length > 0) {
          return { ...node, children: filteredChildren };
        }
        return null;
      }).filter(Boolean);
    };

    return filterNodes(tree || []);
  }, [tree, searchTerm]);

  // Expand all matched folders if searching
  React.useEffect(() => {
    if (searchTerm) {
      handleExpandAll();
    }
  }, [searchTerm]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Architecture Explorer</h1>
        <p className="text-muted-foreground text-lg text-balance">
          Production-grade VS Code style project structure and module analysis.
        </p>
      </div>

      {/* Insights Header */}
      {insights && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <MetricCard title="Arch Style" value={insights.architectureStyle} icon={<Layers className="w-4 h-4 text-indigo-400" />} className="col-span-2" />
          <MetricCard title="Team Size" value={insights.recommendedTeamSize} icon={<Users className="w-4 h-4 text-emerald-400" />} className="col-span-2 md:col-span-2 lg:col-span-1" />
          <MetricCard title="Est. Files" value={insights.estimatedFiles} icon={<FileCode className="w-4 h-4 text-amber-400" />} />
          <MetricCard title="Est. Folders" value={insights.estimatedFolders} icon={<Folder className="w-4 h-4 text-rose-400" />} />
          
          <MetricCard title="Est. LOC" value={insights.estimatedLoc} icon={<FileText className="w-4 h-4 text-blue-400" />} />
          <MetricCard title="Deployment" value={insights.deploymentStrategy} icon={<Settings className="w-4 h-4 text-purple-400" />} className="col-span-2" />
          <MetricCard title="Scalability" value={insights.scalabilityRating} icon={<Network className="w-4 h-4 text-cyan-400" />} />
          <MetricCard title="Complexity" value={insights.complexityLevel} icon={<Database className="w-4 h-4 text-orange-400" />} />
        </div>
      )}

      {/* Explorer UI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
        
        {/* Left Column: File Tree */}
        <div className="lg:col-span-1 border border-white/10 rounded-xl overflow-hidden bg-[#1e1e1e] flex flex-col shadow-2xl">
          {/* Explorer Toolbar */}
          <div className="bg-[#252526] p-3 border-b border-white/5 flex flex-col gap-3">
            <div className="flex items-center justify-between text-white/70 uppercase text-xs font-semibold tracking-wider px-1">
              <span>Explorer</span>
              <div className="flex gap-2">
                <button onClick={handleExpandAll} title="Expand All" className="hover:text-white transition-colors">
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={handleCollapseAll} title="Collapse All" className="hover:text-white transition-colors">
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
              <input 
                type="text" 
                placeholder="Search files..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-primary/50 transition-all text-white/90 placeholder:text-white/30"
              />
            </div>
          </div>
          
          {/* Tree View */}
          <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10">
            {filteredTree?.map((node: any, i: number) => (
              <TreeNode 
                key={i} 
                node={node} 
                path={node.name} 
                depth={0} 
                expandedPaths={expandedPaths}
                togglePath={togglePath}
                selectedNode={selectedNode}
                setSelectedNode={setSelectedNode}
              />
            ))}
            {(!filteredTree || filteredTree.length === 0) && (
              <div className="text-center py-10 text-white/30 text-xs italic">
                No matching files found.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Details Panel */}
        <div className="lg:col-span-2 border border-white/10 rounded-xl overflow-hidden bg-black/40 flex flex-col">
          {selectedNode ? (
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Header */}
              <div className="border-b border-white/10 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  {selectedNode.type === 'folder' ? <Folder className="w-6 h-6 text-blue-400" /> : <FileCode className="w-6 h-6 text-amber-400" />}
                  <h2 className="text-2xl font-bold text-white tracking-tight">{selectedNode.name}</h2>
                  <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60 ml-auto uppercase text-[10px]">
                    {selectedNode.type}
                  </Badge>
                </div>
                {selectedNode.description && (
                  <p className="text-white/70 text-sm leading-relaxed">{selectedNode.description}</p>
                )}
              </div>

              {/* Purpose */}
              {selectedNode.purpose && (
                <div>
                  <h3 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4 text-indigo-400" /> Purpose
                  </h3>
                  <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-xl text-white/80 text-sm leading-relaxed">
                    {selectedNode.purpose}
                  </div>
                </div>
              )}

              {/* Responsibilities */}
              {selectedNode.responsibilities && selectedNode.responsibilities.length > 0 && (
                <div>
                  <h3 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Responsibilities
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedNode.responsibilities.map((req: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 bg-white/5 p-3 rounded-lg border border-white/5 text-sm text-white/70">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Dependencies Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedNode.dependsOn && selectedNode.dependsOn.length > 0 && (
                  <div>
                    <h3 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                      <ArrowRightLeft className="w-4 h-4 text-rose-400" /> Depends On
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedNode.dependsOn.map((dep: string, i: number) => (
                        <Badge key={i} variant="outline" className="bg-rose-500/10 text-rose-300 border-rose-500/20 font-mono text-xs">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selectedNode.usedBy && selectedNode.usedBy.length > 0 && (
                  <div>
                    <h3 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                      <ArrowRightLeft className="w-4 h-4 text-blue-400" /> Used By
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedNode.usedBy.map((dep: string, i: number) => (
                        <Badge key={i} variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/20 font-mono text-xs">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {!selectedNode.purpose && !selectedNode.responsibilities?.length && !selectedNode.dependsOn?.length && !selectedNode.usedBy?.length && (
                 <div className="text-center py-20">
                   <Folder className="w-12 h-12 text-white/10 mx-auto mb-4" />
                   <p className="text-white/30 text-sm">Standard architectural component.</p>
                 </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-white/30 p-10 text-center">
              <Layers className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium text-white/50 mb-2">No File Selected</p>
              <p className="text-sm max-w-sm text-balance">
                Select a folder or file from the explorer on the left to view detailed architectural insights and responsibilities.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// TREE NODE RECURSIVE COMPONENT
// ----------------------------------------------------------------------
function TreeNode({ node, path, depth, expandedPaths, togglePath, selectedNode, setSelectedNode }: any) {
  const isFolder = node.type === 'folder';
  const isExpanded = expandedPaths.has(path);
  const isSelected = selectedNode?.name === node.name && selectedNode?.type === node.type; // Simple equality check for prototype

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNode(node);
    if (isFolder) togglePath(path);
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith('.ts') || name.endsWith('.tsx') || name.endsWith('.js') || name.endsWith('.jsx')) return <FileCode className="w-4 h-4 text-blue-400" />;
    if (name.endsWith('.json') || name.endsWith('.yaml') || name.endsWith('.yml')) return <FileJson className="w-4 h-4 text-amber-400" />;
    if (name.endsWith('.md') || name.endsWith('.txt')) return <FileText className="w-4 h-4 text-emerald-400" />;
    return <File className="w-4 h-4 text-white/60" />;
  };

  return (
    <div className="select-none">
      <div 
        className={cn(
          "flex items-center gap-1.5 py-1 px-2 rounded cursor-pointer transition-colors group",
          isSelected ? "bg-primary/20 text-primary" : "hover:bg-white/5 text-white/80"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleSelect}
      >
        {isFolder ? (
          <div className="w-4 h-4 flex items-center justify-center shrink-0">
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5 opacity-60" /> : <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
          </div>
        ) : (
          <div className="w-4 h-4 shrink-0" /> // Spacer for files
        )}

        {isFolder ? (
          isExpanded ? <FolderOpen className="w-4 h-4 text-blue-400 shrink-0" /> : <Folder className="w-4 h-4 text-blue-400 shrink-0" />
        ) : (
          getFileIcon(node.name)
        )}

        <span className={cn(
          "font-mono text-[13px] truncate flex-1",
          isSelected ? "font-semibold" : ""
        )}>
          {node.name}
        </span>

        {/* Small metadata indicator if it has details */}
        {(node.purpose || node.responsibilities?.length > 0) && (
          <Info className="w-3 h-3 text-white/20 group-hover:text-white/40 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>

      {isFolder && isExpanded && node.children && (
        <div className="flex flex-col">
          {node.children.map((child: any, i: number) => (
            <TreeNode 
              key={i} 
              node={child} 
              path={`${path}/${child.name}`} 
              depth={depth + 1} 
              expandedPaths={expandedPaths}
              togglePath={togglePath}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MetricCard({ title, value, icon, className }: { title: string, value: any, icon: React.ReactNode, className?: string }) {
  return (
    <div className={cn("bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2 shadow-sm", className)}>
      <div className="flex items-center gap-2 text-white/50 text-xs font-semibold uppercase tracking-wider">
        {icon}
        {title}
      </div>
      <div className="text-lg font-bold text-white truncate">{value || '-'}</div>
    </div>
  );
}
