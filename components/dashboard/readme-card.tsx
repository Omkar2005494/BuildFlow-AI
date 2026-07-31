"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useBuildFlowStore } from "@/store/buildflow-store";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Copy, Check, FileText, Download, BookOpen, Search, ShieldCheck, Zap, Server, Code, FileArchive, Layout, Link as LinkIcon, AlertTriangle, Layers, TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ReadmeCard() {
  const { buildFlow, setSelectedSection } = useBuildFlowStore();
  
  if (!buildFlow) return null;

  // Fallback for V1/V2/V3 READMEs (simple markdown string)
  if (!buildFlow.documentation) {
    return <LegacyReadmeCard readme={(buildFlow as any).readme} />;
  }

  const { hero, sections, insights, version } = buildFlow.documentation;
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<string>("");

  // Search filtering
  const filteredSections = useMemo(() => {
    if (!searchQuery) return sections;
    const q = searchQuery.toLowerCase();
    return sections.filter(s => 
      s.title.toLowerCase().includes(q) || 
      s.description.toLowerCase().includes(q) ||
      s.markdown.toLowerCase().includes(q)
    );
  }, [sections, searchQuery]);

  // Intersection Observer for Active Section Highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-10% 0px -80% 0px" } // Trigger near the top
    );

    filteredSections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [filteredSections]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* 1. Executive Hero */}
      <div className="relative rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 md:p-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between">
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 rounded-full border border-primary/20">
                {hero.projectCategory}
              </span>
              <span className="px-3 py-1 text-xs font-medium uppercase tracking-widest text-white/60 bg-white/5 rounded-full border border-white/10">
                {hero.architectureStyle}
              </span>
              <span className="px-3 py-1 text-xs font-medium uppercase tracking-widest text-emerald-400 bg-emerald-500/10 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {hero.projectStatus}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
              {hero.projectName}
            </h1>
            <p className="text-xl font-medium text-white/90">
              {hero.tagline}
            </p>
            <p className="text-base text-white/60 max-w-3xl leading-relaxed text-balance">
              {hero.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
              {hero.technologies.map((tech, i) => (
                <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 text-white/80 border border-white/10">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-3 min-w-[200px]">
            <HeroMetric label="Version" value={hero.version} />
            <HeroMetric label="Build Quality" value={`${hero.buildQualityScore}/100`} />
            <HeroMetric label="Timeline" value={hero.estimatedTimeline} />
            <HeroMetric label="Budget" value={hero.estimatedBudget} />
            <HeroMetric label="Team Size" value={hero.recommendedTeamSize} />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar: Intelligent ToC & Search */}
        <aside className="lg:w-72 shrink-0 space-y-6">
          <div className="sticky top-6 space-y-6">
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text" 
                placeholder="Search documentation..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* AI Insights Panel */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck className="w-16 h-16 text-primary" />
              </div>
              <div className="relative z-10">
                <h3 className="text-sm font-bold tracking-tight text-primary uppercase mb-4">AI Doc Audit</h3>
                <div className="space-y-3">
                  <InsightRow label="Completeness" value={insights.completeness} />
                  <InsightRow label="Coverage" value={`${insights.coverageScore}%`} />
                  <InsightRow label="Enterprise Ready" value={insights.enterpriseReadiness} />
                  <InsightRow label="Architecture" value={insights.architectureQuality} />
                </div>
              </div>
            </div>

            {/* Table of Contents */}
            <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-5 max-h-[50vh] overflow-y-auto custom-scrollbar">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Contents</h3>
              <nav className="space-y-1">
                {filteredSections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollToHeading(s.id)}
                    className={cn(
                      "block w-full text-left text-sm truncate transition-colors py-1.5 px-2 rounded-lg",
                      activeSection === s.id ? "bg-primary/10 text-primary font-medium" : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {s.title}
                  </button>
                ))}
                {filteredSections.length === 0 && (
                  <p className="text-xs text-white/40 italic">No sections found.</p>
                )}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 space-y-8">
          {filteredSections.map((section) => (
            <section 
              key={section.id} 
              id={section.id} 
              className="bg-card border border-border/50 rounded-2xl p-8 overflow-hidden shadow-xl scroll-mt-6"
            >
              <div className="flex items-start justify-between mb-6 pb-6 border-b border-white/5">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md bg-white/5 text-white/50 border border-white/10">
                      {section.category}
                    </span>
                    {section.importance === "Critical" && (
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        Critical
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">{section.title}</h2>
                  <p className="text-sm text-white/50 mt-1">{section.description}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-white/40 flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                    <BookOpen className="w-3.5 h-3.5" />
                    {section.estimatedReadingTime}
                  </span>
                </div>
              </div>

              {/* Render Interactive References if any */}
              {section.interactiveReferences && section.interactiveReferences.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="w-full text-xs font-bold uppercase tracking-widest text-primary/70 mb-1 flex items-center gap-2">
                    <LinkIcon className="w-3.5 h-3.5" /> Workspace Integrations
                  </div>
                  {section.interactiveReferences.map((ref, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        // Map the reference to the store's tab IDs
                        const map: Record<string, string> = {
                          "Architecture": "architecture",
                          "Database": "database",
                          "API": "api",
                          "Folder Structure": "folders",
                          "Roadmap": "roadmap",
                          "Overview": "overview"
                        };
                        const target = map[ref];
                        if (target) setSelectedSection(target);
                      }}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      Explore {ref} <TrendingUp className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}

              {/* Markdown Content */}
              <article className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-background prose-pre:border prose-pre:border-border/50 prose-pre:rounded-lg prose-headings:text-white/90 prose-img:rounded-lg prose-table:border-collapse prose-th:border prose-th:border-white/10 prose-th:bg-white/5 prose-th:px-4 prose-th:py-2 prose-td:border prose-td:border-white/10 prose-td:px-4 prose-td:py-2 prose-a:text-primary prose-a:no-underline hover:prose-a:underline max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {section.markdown}
                </ReactMarkdown>
              </article>

              {/* Structured Code Blocks */}
              {section.codeBlocks && section.codeBlocks.length > 0 && (
                <div className="mt-8 space-y-6">
                  {section.codeBlocks.map((cb, i) => (
                    <StructuredCodeBlock key={i} block={cb} />
                  ))}
                </div>
              )}

            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroMetric({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
      <span className="text-xs font-medium text-white/50">{label}</span>
      <span className="text-sm font-bold text-white/90">{value}</span>
    </div>
  );
}

function InsightRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs font-medium text-white/60">{label}</span>
      <span className="text-xs font-bold text-white/90">{value}</span>
    </div>
  );
}

function StructuredCodeBlock({ block }: { block: any }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(!block.collapsible);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(block.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#1e1e1e] overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/70">
            {block.language || 'text'}
          </span>
          <span className="text-sm font-medium text-white/80">{block.title}</span>
        </div>
        <div className="flex items-center gap-2">
          {block.copyEnabled !== false && (
            <button onClick={handleCopy} className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/50 hover:text-white">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
          {block.collapsible && (
            <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/50 hover:text-white text-xs font-medium">
              {expanded ? "Collapse" : "Expand"}
            </button>
          )}
        </div>
      </div>
      {expanded && (
        <div className="relative text-sm">
          <SyntaxHighlighter
            language={block.language?.toLowerCase() || 'text'}
            style={vscDarkPlus}
            customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
            showLineNumbers={true}
          >
            {block.code}
          </SyntaxHighlighter>
        </div>
      )}
      {block.description && expanded && (
        <div className="px-4 py-3 bg-black/20 border-t border-white/5 text-xs text-white/50 italic">
          {block.description}
        </div>
      )}
    </div>
  );
}


// --- Legacy Viewer ---
function LegacyReadmeCard({ readme }: { readme: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(readme);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">README.md</h1>
          <p className="text-muted-foreground mt-2 text-lg">Legacy Markdown Viewer.</p>
        </div>
        <button onClick={handleCopy} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white/5 border border-white/10 hover:bg-white/10">
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          Copy
        </button>
      </div>
      <div className="mt-8 bg-card border border-border/50 rounded-xl p-8 overflow-hidden">
        <article className="prose prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{readme}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
