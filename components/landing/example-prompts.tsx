"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Briefcase, Activity, ShoppingCart, MessageSquare, BookOpen, Film } from "lucide-react";

interface ExamplePromptsProps {
  onSelect: (idea: string) => void;
  disabled: boolean;
}

const EXAMPLE_CARDS = [
  {
    title: "AI Interview Platform",
    description: "System for automated candidate screening",
    icon: <MessageSquare className="w-4 h-4" />,
    prompt: "An AI Interview Platform that screens candidates using automated voice questions, records responses, and provides a scoring dashboard for recruiters.",
  },
  {
    title: "Hospital ERP",
    description: "Complete healthcare management",
    icon: <Activity className="w-4 h-4" />,
    prompt: "A comprehensive Hospital ERP system managing patient records, doctor scheduling, pharmacy inventory, and billing with insurance integrations.",
  },
  {
    title: "E-Commerce App",
    description: "Modern retail storefront",
    icon: <ShoppingCart className="w-4 h-4" />,
    prompt: "A modern E-Commerce application with user authentication, product catalog, shopping cart, Stripe integration, and an admin dashboard.",
  },
  {
    title: "Netflix Clone",
    description: "Video streaming platform",
    icon: <Film className="w-4 h-4" />,
    prompt: "A video streaming platform like Netflix with user profiles, video transcoding, CDN delivery, subscription billing, and a recommendation engine.",
  },
  {
    title: "Task Management",
    description: "Team collaboration tool",
    icon: <Briefcase className="w-4 h-4" />,
    prompt: "A task management app for remote teams featuring real-time collaborative boards, role-based access, and integrations with Slack.",
  },
  {
    title: "Learning System",
    description: "Educational course platform",
    icon: <BookOpen className="w-4 h-4" />,
    prompt: "A Learning Management System (LMS) where instructors can upload video courses and students can track progress and earn certificates.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function ExamplePrompts({ onSelect, disabled }: ExamplePromptsProps) {
  return (
    <div className="w-full mt-16 z-10 relative">
      <div className="flex items-center space-x-4 mb-6 justify-center md:justify-start">
        <div className="h-[1px] bg-border/50 flex-grow max-w-[40px] md:max-w-none" />
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-center">
          Or start with a template
        </p>
        <div className="h-[1px] bg-border/50 flex-grow max-w-[40px] md:max-w-none" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
      >
        {EXAMPLE_CARDS.map((card, idx) => (
          <motion.button
            key={idx}
            variants={itemVariants}
            disabled={disabled}
            onClick={() => onSelect(card.prompt)}
            className="group relative flex items-start space-x-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.05] hover:border-white/10 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="mt-0.5 p-2 rounded-lg bg-white/5 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
              {card.icon}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
                {card.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {card.description}
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
