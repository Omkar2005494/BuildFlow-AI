import React from "react";
import { DiagramNode } from "./types";
import { 
  Box, Layers, Cpu, Server, Database, Globe, Cloud, Code,
  User, Lock, Settings, Zap, CreditCard, Bot, BarChart, Bell, Mail, Map, ArrowRightLeft, AppWindow
} from "lucide-react";
import { motion } from "framer-motion";

interface ArchitectureNodeProps {
  node: DiagramNode;
}

export function ArchitectureNode({ node }: ArchitectureNodeProps) {
  const labelLower = node.label.toLowerCase();
  const subLower = (node.subtitle || "").toLowerCase();
  const fullText = labelLower + " " + subLower;

  let Icon = Box;
  let iconColor = "text-primary";
  let bgGradient = "from-primary/20 to-primary/5";
  let borderColor = "border-primary/20";
  
  if (fullText.includes("user") || fullText.includes("actor") || fullText.includes("patient") || fullText.includes("customer") || fullText.includes("driver") || fullText.includes("admin")) {
    Icon = User;
    iconColor = "text-emerald-400";
    bgGradient = "from-emerald-500/20 to-emerald-500/5";
    borderColor = "border-emerald-500/20";
  }
  else if (fullText.includes("web") || fullText.includes("frontend") || fullText.includes("client") || fullText.includes("ui")) {
    Icon = AppWindow;
    iconColor = "text-blue-400";
    bgGradient = "from-blue-500/20 to-blue-500/5";
    borderColor = "border-blue-500/20";
  }
  else if (fullText.includes("api") || fullText.includes("gateway") || fullText.includes("router")) {
    Icon = ArrowRightLeft;
    iconColor = "text-indigo-400";
    bgGradient = "from-indigo-500/20 to-indigo-500/5";
    borderColor = "border-indigo-500/20";
  }
  else if (fullText.includes("auth") || fullText.includes("login") || fullText.includes("identity")) {
    Icon = Lock;
    iconColor = "text-amber-400";
    bgGradient = "from-amber-500/20 to-amber-500/5";
    borderColor = "border-amber-500/20";
  }
  else if (fullText.includes("db") || fullText.includes("database") || fullText.includes("sql") || fullText.includes("mongo")) {
    Icon = Database;
    iconColor = "text-rose-400";
    bgGradient = "from-rose-500/20 to-rose-500/5";
    borderColor = "border-rose-500/20";
  }
  else if (fullText.includes("cache") || fullText.includes("redis")) {
    Icon = Zap;
    iconColor = "text-yellow-400";
    bgGradient = "from-yellow-500/20 to-yellow-500/5";
    borderColor = "border-yellow-500/20";
  }
  else if (fullText.includes("storage") || fullText.includes("s3") || fullText.includes("cloud")) {
    Icon = Cloud;
    iconColor = "text-sky-400";
    bgGradient = "from-sky-500/20 to-sky-500/5";
    borderColor = "border-sky-500/20";
  }
  else if (fullText.includes("payment") || fullText.includes("stripe")) {
    Icon = CreditCard;
    iconColor = "text-green-400";
    bgGradient = "from-green-500/20 to-green-500/5";
    borderColor = "border-green-500/20";
  }
  else if (fullText.includes("ai ") || fullText.includes("model") || fullText.includes("llm") || fullText.includes("gpt")) {
    Icon = Bot;
    iconColor = "text-purple-400";
    bgGradient = "from-purple-500/20 to-purple-500/5";
    borderColor = "border-purple-500/20";
  }
  else if (fullText.includes("analytic") || fullText.includes("metric") || fullText.includes("monitor")) {
    Icon = BarChart;
    iconColor = "text-teal-400";
    bgGradient = "from-teal-500/20 to-teal-500/5";
    borderColor = "border-teal-500/20";
  }
  else if (fullText.includes("notification") || fullText.includes("push") || fullText.includes("alert")) {
    Icon = Bell;
    iconColor = "text-orange-400";
    bgGradient = "from-orange-500/20 to-orange-500/5";
    borderColor = "border-orange-500/20";
  }
  else if (fullText.includes("queue") || fullText.includes("message") || fullText.includes("kafka") || fullText.includes("pubsub") || fullText.includes("mail")) {
    Icon = Mail;
    iconColor = "text-orange-400";
    bgGradient = "from-orange-500/20 to-orange-500/5";
    borderColor = "border-orange-500/20";
  }
  else if (fullText.includes("map") || fullText.includes("location") || fullText.includes("routing")) {
    Icon = Map;
    iconColor = "text-emerald-400";
    bgGradient = "from-emerald-500/20 to-emerald-500/5";
    borderColor = "border-emerald-500/20";
  }
  else if (fullText.includes("service") || fullText.includes("engine") || fullText.includes("core")) {
    Icon = Settings;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative flex items-center gap-4 min-w-[240px] max-w-[320px] p-4 rounded-2xl border border-white/[0.08] bg-black/40 backdrop-blur-md shadow-2xl z-10 group"
      data-node-id={node.id}
    >
      <div className={`w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${bgGradient} border ${borderColor} flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      
      <div className="flex flex-col overflow-hidden w-full">
        <h3 className="font-semibold tracking-tight text-white truncate">
          {node.label}
        </h3>
        
        {node.subtitle ? (
          <span className="text-xs font-medium text-white/50 truncate mt-0.5">
            {node.subtitle}
          </span>
        ) : (
          <span className="text-xs font-medium text-white/30 uppercase tracking-wider mt-0.5 truncate">
            {node.layer || "System Component"}
          </span>
        )}

        {node.tech && (
          <div className="mt-2 flex">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-white/70 border border-white/10 truncate">
              {node.tech}
            </span>
          </div>
        )}
      </div>

      {/* Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-white/10" />
      <div className={`absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-white/5 via-transparent to-transparent`} />
      
      {/* Connector anchor points for visual flair */}
      <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white/10 bg-black" />
      <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white/10 bg-black" />
    </motion.div>
  );
}
