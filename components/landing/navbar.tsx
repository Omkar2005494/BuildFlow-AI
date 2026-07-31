"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LoginModal } from "@/components/auth/login-modal";

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-background/70 backdrop-blur-md border-b border-white/5 shadow-sm py-4" 
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-semibold text-lg tracking-tight">BuildFlow AI</span>
          </Link>

          {/* Right Navigation */}
          <div className="flex items-center space-x-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Docs
            </Link>
            <div className="relative hidden sm:block group">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <span className="absolute -top-3 -right-6 text-[9px] uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                Soon
              </span>
            </div>

            <div className="w-px h-4 bg-border hidden sm:block"></div>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground hidden md:inline-block">
                  {user.email}
                </span>
                <Button variant="ghost" size="sm" onClick={() => router.push("/projects")} className="hidden sm:inline-flex">
                  My Projects
                </Button>
                <Button variant="secondary" size="sm" onClick={logout}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Login
                </button>
                <Button 
                  onClick={() => setShowLoginModal(true)}
                  size="sm"
                  className="bg-foreground text-background hover:bg-foreground/90 transition-all rounded-full px-5"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
}
