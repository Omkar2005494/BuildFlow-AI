"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroBackground } from "./hero-background";
import { PromptInput } from "./prompt-input";
import { ExamplePrompts } from "./example-prompts";
import { TrustIndicators } from "./trust-indicators";
import { Loader2, Sparkles } from "lucide-react";
import { useAIPlatformStore } from "@/store/ai-platform-store";

interface HeroProps {
  idea: string;
  setIdea: (val: string) => void;
  isGenerating: boolean;
  onSubmit: (e?: React.FormEvent) => void;
  onOpenAiSettings: () => void;
}

export function Hero({ idea, setIdea, isGenerating, onSubmit, onOpenAiSettings }: HeroProps) {
  const { detailLevel, setDetailLevel } = useAIPlatformStore();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center pt-24 pb-12 px-4 md:px-8 overflow-hidden selection:bg-primary/30">
      <HeroBackground />
      
      <div className="w-full max-w-[1100px] mx-auto relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        
        <AnimatePresence mode="wait">
          {!isGenerating ? (
            <motion.div 
              key="hero-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col items-center"
            >
              {/* Headline */}
              <div className="text-center max-w-4xl mx-auto space-y-6">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]"
                >
                  From Idea to{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-blue-600">
                    Production Architecture.
                  </span>
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed"
                >
                  Transform any software idea into a complete architecture, database schema, API design, roadmap, and documentation within seconds.
                </motion.p>
              </div>

              {/* Prompt Input Centerpiece */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex flex-col items-center"
              >
                <div className="w-full">
                  <PromptInput 
                    idea={idea} 
                    setIdea={setIdea} 
                    isGenerating={isGenerating}
                    onSubmit={onSubmit}
                  />
                </div>
                
                {/* Generation Scale Toggle */}
                <div className="mt-6 flex items-center justify-center bg-white/5 border border-white/10 rounded-full p-1 backdrop-blur-sm relative">
                  <button
                    type="button"
                    onClick={() => setDetailLevel("standard")}
                    disabled={isGenerating}
                    className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                      detailLevel === "standard" ? "text-white" : "text-white/50 hover:text-white/80"
                    }`}
                  >
                    Standard Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => setDetailLevel("enterprise")}
                    disabled={isGenerating}
                    className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                      detailLevel === "enterprise" ? "text-white" : "text-white/50 hover:text-white/80"
                    }`}
                  >
                    Enterprise Mode
                  </button>
                  
                  {/* Sliding Background */}
                  <div 
                    className="absolute inset-y-1 rounded-full bg-white/10 transition-all duration-300 ease-in-out pointer-events-none"
                    style={{
                      width: "calc(50% - 4px)",
                      left: detailLevel === "standard" ? "4px" : "calc(50%)"
                    }}
                  />
                </div>
              </motion.div>

              {/* Example Prompts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                <ExamplePrompts 
                  onSelect={setIdea} 
                  disabled={isGenerating} 
                />
              </motion.div>

              {/* Trust Indicators */}
              <TrustIndicators />
              
            </motion.div>
          ) : (
            <motion.div
              key="loading-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center space-y-12 w-full max-w-2xl mx-auto py-20"
            >
              <div className="relative">
                <div className="w-32 h-32 rounded-full border border-white/10 flex items-center justify-center bg-black/50 backdrop-blur-xl shadow-[0_0_100px_rgba(var(--primary),0.2)]">
                  <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" style={{ animationDuration: '2s' }} />
                  <div className="absolute inset-2 rounded-full border-r-2 border-blue-500/50 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
                  <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
                  Architecting your solution
                </h2>
                <p className="text-lg text-muted-foreground font-light max-w-md mx-auto">
                  Our AI is currently designing the database schema, selecting the optimal tech stack, and formulating API specifications.
                </p>
              </div>

              <div className="w-full max-w-md bg-white/[0.02] border border-white/5 rounded-2xl p-6 backdrop-blur-md">
                <div className="space-y-4">
                  {[
                    { label: "Analyzing core requirements", delay: 0 },
                    { label: "Designing relational database schema", delay: 2 },
                    { label: "Formulating REST API specifications", delay: 5 },
                    { label: "Selecting optimal technology stack", delay: 8 },
                    { label: "Drafting development roadmap", delay: 11 },
                  ].map((step, idx) => (
                    <LoadingStep key={idx} label={step.label} delay={step.delay} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function LoadingStep({ label, delay }: { label: string, delay: number }) {
  const [status, setStatus] = React.useState<"pending" | "active" | "done">("pending");

  React.useEffect(() => {
    const activeTimer = setTimeout(() => setStatus("active"), delay * 1000);
    const doneTimer = setTimeout(() => setStatus("done"), (delay + 2.5) * 1000);
    return () => {
      clearTimeout(activeTimer);
      clearTimeout(doneTimer);
    };
  }, [delay]);

  return (
    <div className="flex items-center space-x-4">
      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
        {status === "pending" && <div className="w-1.5 h-1.5 rounded-full bg-white/20" />}
        {status === "active" && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
        {status === "done" && (
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </motion.div>
        )}
      </div>
      <span className={`text-sm transition-colors duration-300 ${
        status === "active" ? "text-white font-medium" : 
        status === "done" ? "text-white/70" : "text-white/30"
      }`}>
        {label}
      </span>
    </div>
  );
}
