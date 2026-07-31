"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Loader2, Code2 } from "lucide-react";

interface PromptInputProps {
  idea: string;
  setIdea: (val: string) => void;
  isGenerating: boolean;
  onSubmit: (e?: React.FormEvent) => void;
}

const PLACEHOLDERS = [
  "Build an AI-powered Hospital Management System...",
  "Design a modern Food Delivery Platform...",
  "Create a Learning Management System for developers...",
  "Architect a scalable E-Commerce storefront...",
  "Build a task management application for remote teams..."
];

export function PromptInput({ idea, setIdea, isGenerating, onSubmit }: PromptInputProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (idea.trim() && !isGenerating) {
        onSubmit();
      }
    }
  };

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    autoResize();
  }, [idea]);

  return (
    <form onSubmit={onSubmit} className="w-full relative mt-12 z-10">
      <div className="relative group max-w-3xl mx-auto">
        {/* Glow behind the input */}
        <div 
          className={`absolute -inset-1 bg-gradient-to-r from-primary/40 via-blue-500/40 to-primary/40 rounded-[28px] blur-xl opacity-20 transition-all duration-1000 ${
            isFocused ? 'opacity-60 scale-[1.02]' : 'group-hover:opacity-40'
          }`}
        />
        
        {/* Input Container */}
        <div className="relative bg-black/40 backdrop-blur-2xl rounded-[24px] border border-white/10 shadow-2xl overflow-hidden transition-all duration-500">
          
          <div className="relative min-h-[100px] md:min-h-[120px] p-6 md:p-8 flex flex-col">
            
            {/* Custom animated placeholder */}
            {!idea && (
              <div className="absolute top-6 md:top-8 left-6 md:left-8 right-6 md:right-8 pointer-events-none flex items-start text-muted-foreground/60">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={placeholderIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-lg md:text-xl font-light"
                  >
                    {PLACEHOLDERS[placeholderIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            )}

            <textarea
              ref={textareaRef}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              disabled={isGenerating}
              spellCheck={false}
              className="w-full bg-transparent text-lg md:text-xl font-medium text-foreground resize-none focus:outline-none border-none p-0 overflow-y-auto leading-relaxed z-10"
              style={{ minHeight: '60px' }}
            />
          </div>

          {/* Bottom Action Bar */}
          <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-white/5 bg-white/[0.01]">
            <div className="flex items-center text-xs text-muted-foreground hidden sm:flex">
              <Code2 className="w-4 h-4 mr-2 opacity-50" />
              <span>Shift + Return for new line</span>
            </div>
            
            <div className="flex-grow sm:flex-grow-0 flex justify-end">
              <button
                type="submit"
                disabled={!idea.trim() || isGenerating}
                className={`
                  relative overflow-hidden flex items-center justify-center h-12 px-8 rounded-full font-semibold transition-all duration-300
                  ${!idea.trim() || isGenerating 
                    ? 'bg-white/5 text-muted-foreground cursor-not-allowed' 
                    : 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] hover:scale-[1.02] active:scale-[0.98]'
                  }
                `}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    <span>Architecting...</span>
                  </>
                ) : (
                  <>
                    <span>Generate</span>
                    <Sparkles className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
