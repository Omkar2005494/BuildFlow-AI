"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { parseDiagram } from "./parser";
import { useConnectionEngine } from "./connection-engine";
import { ConnectorOverlay } from "./connector-overlay";
import { DatabaseTable } from "./database-table";
import { ArchitectureNode } from "./architecture-node";
import { FileCode2, Search, Table2, Key, Link as LinkIcon, Database, Hash, Star, Square } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DiagramNode } from "./types";

interface CustomDiagramProps {
  chart: string;
}

export function CustomDiagram({ chart }: CustomDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodesReady, setNodesReady] = useState(false);
  const [pathsReady, setPathsReady] = useState(false);
  const [statsReady, setStatsReady] = useState(false);
  
  // Interactivity States
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredTableId, setHoveredTableId] = useState<string | null>(null);
  const [hoveredColumnId, setHoveredColumnId] = useState<string | null>(null); // format: "tableId.columnName"

  // 1. Fault-tolerant parsing
  const parsedData = useMemo(() => {
    return parseDiagram(chart);
  }, [chart]);

  // 2. SVG Connections
  const paths = useConnectionEngine(
    containerRef,
    parsedData?.edges || [],
    nodesReady
  );

  // Load Sequence Animation
  useEffect(() => {
    if (parsedData && parsedData.nodes.length > 0) {
      const t1 = setTimeout(() => setNodesReady(true), 200);
      const t2 = setTimeout(() => setPathsReady(true), 600);
      const t3 = setTimeout(() => setStatsReady(true), 1200);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [parsedData]);

  if (!parsedData || parsedData.nodes.length === 0) {
    return (
      <div className="w-full min-h-[300px] flex flex-col items-center justify-center bg-card rounded-lg border border-border p-8">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileCode2 className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground">Preview Visualization</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md text-center">
          The AI-generated blueprint structure is available in the source code, but a visual preview could not be rendered for this specific configuration.
        </p>
      </div>
    );
  }

  const isDatabase = parsedData.type === "database";

  // Database Stats Calculation
  const dbStats = useMemo(() => {
    if (!isDatabase) return null;
    let pkCount = 0;
    let fkCount = 0;
    let indexCount = 0;
    
    parsedData.nodes.forEach(node => {
      node.attributes?.forEach(attr => {
        if (attr.isPrimaryKey) pkCount++;
        if (attr.isForeignKey) fkCount++;
        if (attr.isUnique || attr.isPrimaryKey || attr.isForeignKey) indexCount++;
      });
    });
    
    return {
      tables: parsedData.nodes.length,
      relationships: parsedData.edges.length,
      pks: pkCount,
      fks: fkCount,
      indexes: indexCount
    };
  }, [parsedData, isDatabase]);

  // Directed Acyclic Graph (DAG) Layout for Databases
  const dagLayers = useMemo(() => {
    if (!isDatabase) return [];
    if (parsedData.nodes.length <= 1) return [parsedData.nodes];

    const adjacencyList = new Map<string, string[]>();
    const indegrees = new Map<string, number>();
    
    parsedData.nodes.forEach(n => {
      adjacencyList.set(n.id, []);
      indegrees.set(n.id, 0);
    });

    parsedData.edges.forEach(e => {
      const parent = e.source;
      const child = e.target;
      if (adjacencyList.has(parent) && adjacencyList.has(child)) {
        adjacencyList.get(parent)!.push(child);
        indegrees.set(child, indegrees.get(child)! + 1);
      }
    });

    const layers: DiagramNode[][] = [];
    let queue = Array.from(indegrees.entries())
      .filter(([_, deg]) => deg === 0)
      .map(([id]) => id);
    
    queue.sort((a, b) => a.localeCompare(b)); // deterministic sort
    
    while (queue.length > 0) {
      const currentLayer = queue.map(id => parsedData.nodes.find(n => n.id === id)!);
      
      // Sort nodes in current layer deterministically
      currentLayer.sort((a, b) => a.id.localeCompare(b.id));
      layers.push(currentLayer);
      
      const nextQueue: string[] = [];
      queue.forEach(parentId => {
        adjacencyList.get(parentId)!.forEach(childId => {
          const currentDeg = indegrees.get(childId)! - 1;
          indegrees.set(childId, currentDeg);
          if (currentDeg === 0) {
            nextQueue.push(childId);
          }
        });
      });
      // Deduplicate and sort nextQueue
      queue = Array.from(new Set(nextQueue)).sort((a, b) => a.localeCompare(b));
    }
    
    // Handle cycles
    const cyclicNodes = parsedData.nodes.filter(n => indegrees.get(n.id)! > 0);
    if (cyclicNodes.length > 0) {
      cyclicNodes.sort((a, b) => a.id.localeCompare(b.id));
      layers.push(cyclicNodes);
    }
    
    return layers;
  }, [parsedData, isDatabase]);

  // Architecture Layers Sorting
  const archLayers = useMemo(() => {
    if (isDatabase) return [];
    const layerMap = new Map<string, DiagramNode[]>();
    parsedData.nodes.forEach(node => {
      const layerName = node.layer || "Business Services";
      if (!layerMap.has(layerName)) layerMap.set(layerName, []);
      layerMap.get(layerName)!.push(node);
    });

    const predefinedOrder = [
      "users / actors",
      "client layer",
      "api gateway",
      "authentication",
      "business services",
      "data layer",
      "external integrations",
      "monitoring & analytics",
      "ai services"
    ];

    return Array.from(layerMap.entries()).sort((a, b) => {
      const idxA = predefinedOrder.findIndex(l => a[0].toLowerCase().includes(l));
      const idxB = predefinedOrder.findIndex(l => b[0].toLowerCase().includes(l));
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0; 
    });
  }, [parsedData, isDatabase]);

  // Advanced Hover / Dimming Logic
  const isNodeDimmed = (nodeId: string) => {
    if (searchQuery) {
      const matchingNodes = parsedData.nodes.filter(n => 
        n.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
        n.attributes?.some(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      const isMatch = matchingNodes.some(n => n.id === nodeId);
      if (isMatch) return false;
      
      const isConnectedToMatch = matchingNodes.some(n => {
        return parsedData.edges.some(e => 
          (e.source === n.id && e.target === nodeId) || (e.target === n.id && e.source === nodeId)
        );
      });
      return !isConnectedToMatch;
    }
    
    if (hoveredColumnId) {
      const [hoveredTable, hoveredCol] = hoveredColumnId.split(".");
      if (hoveredTable === nodeId) return false;
      
      // If the hovered column is part of a relationship edge, highlight the connected table
      const isConnected = parsedData.edges.some(e => 
        (e.source === hoveredTable && e.target === nodeId) || 
        (e.target === hoveredTable && e.source === nodeId)
      );
      return !isConnected;
    }

    if (hoveredTableId) {
      if (hoveredTableId === nodeId) return false;
      const isRelated = parsedData.edges.some(e => 
         (e.source === hoveredTableId && e.target === nodeId) || 
         (e.target === hoveredTableId && e.source === nodeId)
      );
      return !isRelated;
    }
    return false;
  };

  return (
    <div className="relative w-full min-h-[600px] bg-[#0A0A0A] rounded-xl border border-white/5 overflow-hidden flex flex-col font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {isDatabase && dbStats && (
        <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-4 p-5 border-b border-white/5 bg-black/40 backdrop-blur-xl">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: statsReady ? 1 : 0, y: statsReady ? 0 : -10 }}
            className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar"
          >
            <StatCard icon={Table2} label="Tables" value={dbStats.tables} />
            <StatCard icon={LinkIcon} label="Relations" value={dbStats.relationships} />
            <StatCard icon={Key} label="Primary Keys" value={dbStats.pks} color="text-amber-500" />
            <StatCard icon={LinkIcon} label="Foreign Keys" value={dbStats.fks} color="text-blue-400" />
            <StatCard icon={Hash} label="Indexes" value={dbStats.indexes} color="text-indigo-400" />
          </motion.div>
          
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-72 shrink-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-white/40" />
              </div>
              <input
                type="text"
                placeholder="Search tables & columns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-lg leading-5 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 sm:text-sm transition-all shadow-inner"
              />
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: statsReady ? 1 : 0 }}
              className="flex items-center gap-4 px-1"
            >
              <LegendItem icon={<Key className="w-3 h-3 text-amber-500" />} label="Primary Key" />
              <LegendItem icon={<LinkIcon className="w-3 h-3 text-blue-400" />} label="Foreign Key" />
              <LegendItem icon={<Star className="w-3 h-3 text-indigo-400" />} label="Unique" />
              <LegendItem icon={<Square className="w-3 h-3 text-white/40" />} label="Nullable" />
            </motion.div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto relative p-8 md:p-16 custom-scrollbar">
        <div ref={containerRef} className="relative min-w-max min-h-full flex flex-col items-center gap-16 pb-16">
          {pathsReady && (
            <ConnectorOverlay 
              paths={paths} 
              hoveredTableId={hoveredTableId} 
              hoveredColumnId={hoveredColumnId}
              searchQuery={searchQuery} 
              parsedData={parsedData} 
            />
          )}

          {isDatabase ? (
            <div className="flex flex-col items-center gap-16 w-full max-w-7xl mx-auto relative z-10">
              {parsedData.nodes.length === 1 ? (
                <div className="flex justify-center w-full mt-12">
                  <DatabaseTable 
                    node={parsedData.nodes[0]} 
                    isHovered={hoveredTableId === parsedData.nodes[0].id}
                    isDimmed={isNodeDimmed(parsedData.nodes[0].id)}
                    onHover={setHoveredTableId}
                    onColumnHover={setHoveredColumnId}
                  />
                </div>
              ) : (
                dagLayers.map((layer, i) => (
                  <div key={`layer-${i}`} className="flex flex-wrap items-start justify-center gap-16 w-full">
                    {layer.map(node => (
                      <DatabaseTable 
                        key={node.id}
                        node={node} 
                        isHovered={hoveredTableId === node.id}
                        isDimmed={isNodeDimmed(node.id)}
                        onHover={setHoveredTableId}
                        onColumnHover={setHoveredColumnId}
                      />
                    ))}
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-10 w-full max-w-6xl relative z-10">
              {archLayers.map(([layerName, nodes]) => (
                <div key={layerName} className="flex flex-col w-full relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1" />
                    <span className="text-xs md:text-sm font-semibold tracking-widest text-white/40 uppercase text-center min-w-max">
                      {layerName}
                    </span>
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1" />
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center gap-6 relative z-10 p-4 md:p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] shadow-inner">
                    {nodes.map(node => (
                      <ArchitectureNode key={node.id} node={node} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-4 right-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-white/5 backdrop-blur-md">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
          Engine Ready
        </span>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color = "text-white/70" }: { icon: any, label: string, value: number, color?: string }) {
  return (
    <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] shrink-0 hover:bg-white/[0.06] transition-colors">
      <div className={cn("p-2 rounded-lg bg-white/5", color)}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <div className="text-[10px] font-medium uppercase tracking-wider text-white/40">{label}</div>
        <div className="text-sm font-bold text-white/90 leading-none mt-1">{value}</div>
      </div>
    </div>
  );
}

function LegendItem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-[10px] font-medium text-white/50 tracking-wide uppercase">{label}</span>
    </div>
  );
}
