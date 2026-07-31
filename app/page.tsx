"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useBuildFlowStore } from "@/store/buildflow-store";
import { useAuth } from "@/context/AuthContext";
import { LoginModal } from "@/components/auth/login-modal";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { AiDashboard } from "@/components/workspace/ai-dashboard";
import { useAIPlatformStore } from "@/store/ai-platform-store";

export default function LandingPage() {
  const [idea, setIdea] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  const setBuildFlow = useBuildFlowStore((state) => state.setBuildFlow);
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAiSettings, setShowAiSettings] = useState(false);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!idea.trim()) return;

    setIsGenerating(true);
    try {
      let token = "";
      if (user) {
        token = await user.getIdToken();
      }

      const { routingStrategy, preferredProviderId, preferredModelId, detailLevel } = useAIPlatformStore.getState();

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ 
          idea, 
          detailLevel,
          strategy: routingStrategy,
          providerId: preferredProviderId,
          modelId: preferredModelId
        }),
      });

      if (response.status === 401) {
        setShowLoginModal(true);
        return;
      }

      if (response.status === 429) {
        alert("Rate limit exceeded. Please try again later.");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate BuildFlow.");
      }

      const generationResult = await response.json();
      setBuildFlow(generationResult.buildFlow);
      router.push("/workspace");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to generate blueprint. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-foreground selection:bg-primary/30">
      <Navbar />
      <Hero 
        idea={idea} 
        setIdea={setIdea} 
        isGenerating={isGenerating} 
        onSubmit={handleGenerate} 
        onOpenAiSettings={() => setShowAiSettings(true)}
      />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <AiDashboard isOpen={showAiSettings} onClose={() => setShowAiSettings(false)} />
    </main>
  );
}
