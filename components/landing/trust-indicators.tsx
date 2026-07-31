"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Cloud, BrainCircuit } from "lucide-react";

const INDICATORS = [
  { label: "AI Powered", icon: <BrainCircuit className="w-4 h-4" /> },
  { label: "Fast Generation", icon: <Zap className="w-4 h-4" /> },
  { label: "Secure Authentication", icon: <ShieldCheck className="w-4 h-4" /> },
  { label: "Cloud Saving", icon: <Cloud className="w-4 h-4" /> },
];

export function TrustIndicators() {
  return (
    <div className="w-full mt-24 mb-12 flex flex-col items-center justify-center z-10 relative">
      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        {INDICATORS.map((indicator, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + idx * 0.1, duration: 0.5 }}
            className="flex items-center space-x-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md text-muted-foreground"
          >
            <div className="text-primary/70">
              {indicator.icon}
            </div>
            <span className="text-xs font-medium tracking-wide">
              {indicator.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
