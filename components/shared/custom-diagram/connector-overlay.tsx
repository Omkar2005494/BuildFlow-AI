import React from "react";
import { motion } from "framer-motion";
import { ConnectionPath } from "./connection-engine";
import { ParsedDiagram } from "./types";
import { cn } from "@/lib/utils";

interface ConnectorOverlayProps {
  paths: ConnectionPath[];
  hoveredTableId?: string | null;
  hoveredColumnId?: string | null;
  searchQuery?: string;
  parsedData?: ParsedDiagram;
}

export function ConnectorOverlay({ paths, hoveredTableId, hoveredColumnId, searchQuery, parsedData }: ConnectorOverlayProps) {
  
  const isNodeMatchingSearch = (nodeId: string) => {
    if (!searchQuery || !parsedData) return true;
    const node = parsedData.nodes.find(n => n.id === nodeId);
    if (!node) return false;
    
    return node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
           node.attributes?.some(a => a.name.toLowerCase().includes(searchQuery.toLowerCase())) || false;
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <svg className="w-full h-full overflow-visible">
        <defs>
          <marker
            id="arrowhead-default"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-primary/40" />
          </marker>
          <marker
            id="arrowhead-active"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-primary" />
          </marker>
          <linearGradient id="lineGradient-default" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="lineGradient-active" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="1" />
          </linearGradient>
        </defs>

        {paths.map((path) => {
          let isActive = false;
          let isDimmed = false;

          if (hoveredColumnId) {
            const [hoveredTable, hoveredCol] = hoveredColumnId.split(".");
            const isFK = hoveredCol.toLowerCase().includes("id") && hoveredCol.toLowerCase() !== "id";
            
            if (isFK) {
               // Heuristic: guess the target table from the FK name (e.g. "user_id" -> "user")
               const targetTableHint = hoveredCol.toLowerCase().replace(/_id$/, "").replace(/id$/, "");
               isActive = (path.source === hoveredTable || path.target === hoveredTable) &&
                          (path.source.toLowerCase().includes(targetTableHint) || path.target.toLowerCase().includes(targetTableHint));
            } else {
               isActive = path.source === hoveredTable || path.target === hoveredTable;
            }
            isDimmed = !isActive;
          } else if (hoveredTableId) {
            isActive = path.source === hoveredTableId || path.target === hoveredTableId;
            isDimmed = !isActive;
          } else if (searchQuery) {
            isActive = isNodeMatchingSearch(path.source) && isNodeMatchingSearch(path.target);
            isDimmed = !isActive;
          }

          const midX = path.sourcePoint.x + (path.targetPoint.x - path.sourcePoint.x) / 2;
          const midY = path.sourcePoint.y + (path.targetPoint.y - path.sourcePoint.y) / 2;

          return (
            <g key={path.id} className="transition-opacity duration-300">
              <motion.path
                d={path.d}
                fill="none"
                stroke={isActive ? "url(#lineGradient-active)" : "url(#lineGradient-default)"}
                strokeWidth={isActive ? "2.5" : "2"}
                className={cn(
                  "transition-all duration-300",
                  isDimmed ? "opacity-10" : isActive ? "opacity-100 z-10 filter drop-shadow-md" : "opacity-100"
                )}
                markerEnd={isActive ? "url(#arrowhead-active)" : "url(#arrowhead-default)"}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              
              {/* Semantic Relationship Badge */}
              {!isDimmed && (path.relationType || path.label) && (
                <motion.foreignObject
                  x={midX - 75}
                  y={midY - 12}
                  width="150"
                  height="24"
                  className="overflow-visible flex justify-center items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <div className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md whitespace-nowrap w-max mx-auto transition-colors",
                    isActive ? "bg-primary/20 border-primary/30 text-primary" : "bg-black/60 border-white/10 text-white/50"
                  )}>
                    {path.relationType && (
                      <span className="text-[9px] font-bold tracking-widest">{path.relationType}</span>
                    )}
                    {path.relationType && path.label && (
                      <span className="w-px h-2.5 bg-current opacity-30" />
                    )}
                    {path.label && (
                      <span className="text-[10px] font-medium">{path.label}</span>
                    )}
                  </div>
                </motion.foreignObject>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
