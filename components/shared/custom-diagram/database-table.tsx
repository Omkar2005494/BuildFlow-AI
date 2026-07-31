import React, { useState } from "react";
import { DiagramNode } from "./types";
import { Database, Key, Type, Link as LinkIcon, Hash, Calendar, ToggleLeft, AlignLeft, BoxSelect, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DatabaseTableProps {
  node: DiagramNode;
  isHovered?: boolean;
  isDimmed?: boolean;
  onHover?: (id: string | null) => void;
  onColumnHover?: (columnId: string | null) => void;
}

export function DatabaseTable({ node, isHovered, isDimmed, onHover, onColumnHover }: DatabaseTableProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIconForType = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("uuid") || t.includes("id")) return <Hash className="w-3 h-3" />;
    if (t.includes("time") || t.includes("date")) return <Calendar className="w-3 h-3" />;
    if (t.includes("bool")) return <ToggleLeft className="w-3 h-3" />;
    if (t.includes("text") || t.includes("varchar") || t.includes("string")) return <AlignLeft className="w-3 h-3" />;
    if (t.includes("json")) return <BoxSelect className="w-3 h-3" />;
    if (t.includes("int") || t.includes("dec") || t.includes("num") || t.includes("float")) return <Hash className="w-3 h-3" />;
    return <Type className="w-3 h-3" />;
  };

  const getTypeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("uuid")) return "text-purple-400 bg-purple-500/10 border-purple-500/20";
    if (t.includes("varchar") || t.includes("text") || t.includes("string")) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (t.includes("int") || t.includes("dec") || t.includes("num") || t.includes("float")) return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    if (t.includes("bool")) return "text-rose-400 bg-rose-500/10 border-rose-500/20";
    if (t.includes("time") || t.includes("date")) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    if (t.includes("json")) return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
    return "text-white/60 bg-white/5 border-white/10";
  };

  const getEstimatedRows = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("user")) return "~25K";
    if (l.includes("order item")) return "~450K";
    if (l.includes("order")) return "~120K";
    if (l.includes("product")) return "~8K";
    if (l.includes("payment")) return "~120K";
    if (l.includes("review")) return "~60K";
    if (l.includes("message")) return "~8M";
    if (l.includes("notification")) return "~40M";
    if (l.includes("status") || l.includes("role") || l.includes("category")) return "~10";
    return null;
  };

  const estimatedRows = getEstimatedRows(node.label);
  const isRoot = /user|order|product/i.test(node.label) && !/item/i.test(node.label);
  const isLookup = /status|category|role|permission|type/i.test(node.label);

  const attributes = node.attributes || [];
  const maxInitialColumns = 5;
  const visibleAttributes = isExpanded ? attributes : attributes.slice(0, maxInitialColumns);
  const hiddenCount = attributes.length - maxInitialColumns;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      onMouseEnter={() => onHover?.(node.id)}
      onMouseLeave={() => onHover?.(null)}
      className={cn(
        "relative flex flex-col rounded-xl overflow-hidden border transition-all duration-300 shadow-2xl z-10 cursor-default",
        isRoot ? "min-w-[300px] max-w-[360px]" : isLookup ? "min-w-[240px] max-w-[280px]" : "min-w-[280px] max-w-[340px]",
        isHovered ? "border-primary/50 bg-black/60 scale-[1.02] z-20 shadow-primary/20" : 
        isDimmed ? "border-white/[0.04] bg-black/20 opacity-40 scale-95" : 
        "border-white/[0.1] bg-black/40 backdrop-blur-md"
      )}
      data-node-id={node.id}
    >
      {/* Table Header */}
      <div className={cn(
        "flex items-center justify-between px-4 py-3 border-b transition-colors",
        isHovered ? "bg-primary/10 border-primary/20" : "bg-white/[0.03] border-white/[0.08]"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "rounded-lg flex items-center justify-center transition-colors",
            isRoot ? "w-9 h-9" : "w-8 h-8",
            isHovered ? "bg-primary/20 text-primary" : "bg-white/10 text-white/70"
          )}>
            <Database className={isRoot ? "w-4.5 h-4.5" : "w-4 h-4"} />
          </div>
          <div className="flex flex-col">
            <h3 className={cn("font-semibold tracking-tight text-white", isRoot ? "text-lg" : "text-base")}>{node.label}</h3>
            {estimatedRows && (
              <span className="text-[10px] font-medium text-white/40">
                {attributes.length} Cols • Est. {estimatedRows}
              </span>
            )}
            {!estimatedRows && (
              <span className="text-[10px] font-medium text-white/40">
                {attributes.length} Columns
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="flex flex-col py-2 px-1 relative z-10">
        <AnimatePresence initial={false}>
          {visibleAttributes.length > 0 ? (
            visibleAttributes.map((attr, idx) => {
              return (
                <motion.div
                  key={attr.name}
                  initial={isExpanded && idx >= maxInitialColumns ? { opacity: 0, height: 0 } : { opacity: 1, height: "auto" }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onMouseEnter={() => onColumnHover?.(`${node.id}.${attr.name}`)}
                  onMouseLeave={() => onColumnHover?.(null)}
                  className="flex items-center justify-between py-2 px-3 hover:bg-white/[0.04] rounded-md transition-colors group"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {attr.isPrimaryKey ? (
                      <Key className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    ) : attr.isForeignKey ? (
                      <LinkIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20 shrink-0 ml-1" />
                    )}
                    <span className={cn(
                      "text-sm font-medium truncate",
                      attr.isPrimaryKey ? "text-amber-500/90" : 
                      attr.isForeignKey ? "text-blue-400/90" : 
                      "text-white/80"
                    )}>
                      {attr.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    {/* Constraints */}
                    <div className="flex gap-1">
                      {attr.isUnique && (
                        <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-1 rounded border border-indigo-500/20">
                          UK
                        </span>
                      )}
                      {attr.isNullable && (
                        <span className="text-[9px] font-bold text-white/40 bg-white/5 px-1 rounded border border-white/10">
                          NULL
                        </span>
                      )}
                    </div>
                    
                    {/* Type Badge */}
                    <div className={cn(
                      "flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono border",
                      getTypeColor(attr.type)
                    )}>
                      {getIconForType(attr.type)}
                      <span>{attr.type}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="py-4 text-center text-sm text-white/40 italic">
              No attributes defined
            </div>
          )}
        </AnimatePresence>

        {hiddenCount > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center gap-1.5 py-2 mx-2 mt-1 rounded-md text-xs font-medium text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                Show {hiddenCount} More Columns
              </>
            )}
          </button>
        )}
      </div>

      {/* Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-white/10" />
      <div className={cn(
        "absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-300 bg-gradient-to-b from-primary/10 to-transparent",
        isHovered ? "opacity-100" : "opacity-0"
      )} />
    </motion.div>
  );
}
