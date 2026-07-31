"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function HeroBackground() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const generated = [...Array(15)].map(() => ({
      x: Math.random() * 100 + "vw",
      y: Math.random() * 100 + "vh",
      opacity: Math.random() * 0.5 + 0.1,
      animY: Math.random() * -100 - 50,
      animOpacity: Math.random() * 0.8 + 0.2,
      duration: Math.random() * 10 + 15,
    }));
    setParticles(generated);
    setMounted(true);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-black">
      {/* Subtle glowing orbs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] mix-blend-screen"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen"
      />

      {/* Elegant Blueprint Grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]"
        style={{ backgroundSize: '4rem 4rem' }}
      >
        <div className="absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,transparent_0%,black_100%)]" />
      </div>

      {/* Floating Particles/Nodes */}
      {mounted && (
        <div className="absolute inset-0">
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary/40"
              initial={{
                x: p.x,
                y: p.y,
                opacity: p.opacity,
              }}
              animate={{
                y: [null, p.animY],
                opacity: [null, p.animOpacity, 0],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
