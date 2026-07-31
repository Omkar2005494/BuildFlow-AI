"use client";

import React, { useState } from "react";
import { useBuildFlowStore } from "@/store/buildflow-store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, List, Kanban, Flag, GitBranch, Clock, Users,
  AlertTriangle, CheckSquare, Target, User, Calendar, Activity, 
  ShieldAlert, Server, Briefcase, Plus, ChevronRight, ChevronDown
} from "lucide-react";

export function RoadmapCard() {
  const { buildFlow } = useBuildFlowStore();
  if (!buildFlow) return null;

  if (Array.isArray(buildFlow.roadmap)) {
    return <LegacyRoadmapViewer roadmap={buildFlow.roadmap} />;
  }

  return <PremiumRoadmapViewer data={buildFlow.roadmap} />;
}

// ----------------------------------------------------------------------
// LEGACY VIEWER
// ----------------------------------------------------------------------
function LegacyRoadmapViewer({ roadmap }: { roadmap: any[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Development Roadmap</h1>
        <p className="text-muted-foreground mt-2 text-lg">Step-by-step implementation plan.</p>
      </div>
      <div className="space-y-8 mt-8">
        {roadmap.map((phase, index) => (
          <div key={index} className="relative pl-8 md:pl-0">
            <div className="md:grid md:grid-cols-4 md:gap-8 items-start">
              <div className="md:col-span-1 mb-4 md:mb-0 md:text-right">
                <h3 className="font-bold text-xl text-primary">{phase.phase}</h3>
              </div>
              <div className="md:col-span-3 bg-card border border-border/50 rounded-xl p-6">
                <ul className="space-y-3">
                  {phase.tasks.map((task: string, tIndex: number) => (
                    <li key={tIndex} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/90">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// PREMIUM VIEWER
// ----------------------------------------------------------------------
function PremiumRoadmapViewer({ data }: { data: any }) {
  const { insights, timeline, teamRecommendations, milestones, phases, aiRecommendations, projectEvolution } = data;
  const [activeTab, setActiveTab] = useState<'timeline' | 'board' | 'milestones' | 'dependencies'>('timeline');

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Engineering Execution Plan</h1>
        <p className="text-muted-foreground text-lg text-balance">
          Production-ready software delivery roadmap with team sizing, risk analysis, and milestones.
        </p>
      </div>

      {/* AI Recommendations */}
      {aiRecommendations && aiRecommendations.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-8 -mt-8" />
          <h3 className="font-bold text-primary flex items-center gap-2 mb-4 relative z-10">
            <Activity className="w-5 h-5" /> Tech Lead AI Recommendations
          </h3>
          <ul className="space-y-3 relative z-10">
            {aiRecommendations.map((rec: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground/90">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Insights Header */}
      {insights && timeline && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          <MetricCard title="Total Phases" value={insights.totalPhases} icon={<List className="w-4 h-4 text-blue-400" />} />
          <MetricCard title="Tasks" value={insights.totalTasks} icon={<CheckSquare className="w-4 h-4 text-emerald-400" />} />
          <MetricCard title="Story Points" value={insights.estimatedStoryPoints || '-'} icon={<Target className="w-4 h-4 text-indigo-400" />} />
          <MetricCard title="Est. Time" value={insights.estimatedDevelopmentTime} icon={<Calendar className="w-4 h-4 text-emerald-400" />} />
          <MetricCard title="Team Size" value={insights.recommendedTeamSize} icon={<Users className="w-4 h-4 text-amber-400" />} />
          <MetricCard title="Critical Path" value={insights.criticalPathLength || timeline.criticalPath?.length || '-'} icon={<AlertTriangle className="w-4 h-4 text-rose-400" />} />
          <MetricCard title="Parallel" value={insights.parallelWorkstreams || timeline.parallelWorkOpportunities?.length || '-'} icon={<GitBranch className="w-4 h-4 text-emerald-400" />} />
          <MetricCard title="Complexity" value={insights.complexity} icon={<Activity className="w-4 h-4 text-rose-400" />} />
        </div>
      )}

      {/* View Tabs */}
      <div className="flex items-center gap-2 border-b border-border/50 pb-px overflow-x-auto">
        <TabButton active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')} icon={<List className="w-4 h-4" />} label="Timeline" />
        <TabButton active={activeTab === 'board'} onClick={() => setActiveTab('board')} icon={<Kanban className="w-4 h-4" />} label="Sprint Board" />
        <TabButton active={activeTab === 'milestones'} onClick={() => setActiveTab('milestones')} icon={<Flag className="w-4 h-4" />} label="Milestones" />
        <TabButton active={activeTab === 'dependencies'} onClick={() => setActiveTab('dependencies')} icon={<GitBranch className="w-4 h-4" />} label="Dependencies" />
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === 'timeline' && <TimelineView phases={phases} />}
        {activeTab === 'board' && <BoardView phases={phases} teamRecommendations={teamRecommendations} />}
        {activeTab === 'milestones' && <MilestonesView milestones={milestones} />}
        {activeTab === 'dependencies' && <DependenciesView phases={phases} timeline={timeline} />}
      </div>

      {/* Project Evolution */}
      {projectEvolution && projectEvolution.length > 0 && (
        <div className="pt-12 mt-12 border-t border-border/50">
          <h2 className="text-xl font-bold tracking-tight mb-6">Long-term Project Evolution</h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {projectEvolution.map((evo: any, i: number) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center text-center p-4 bg-card border border-border/50 rounded-xl w-full md:w-1/4 shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full" />
                   <Badge variant="outline" className="mb-3 bg-background">{evo.version}</Badge>
                   <span className="font-semibold text-sm">{evo.goal}</span>
                </div>
                {i < projectEvolution.length - 1 && (
                  <div className="hidden md:block text-muted-foreground"><ChevronRight className="w-6 h-6" /></div>
                )}
                {i < projectEvolution.length - 1 && (
                  <div className="md:hidden text-muted-foreground"><ChevronDown className="w-6 h-6" /></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// VIEWS
// ----------------------------------------------------------------------

function TimelineView({ phases }: { phases: any[] }) {
  const [expandedPhaseIndex, setExpandedPhaseIndex] = useState<number | null>(0);

  return (
    <div className="relative pt-4">
      {/* Central Spine */}
      <div className="absolute left-6 md:left-1/2 md:-ml-px top-0 bottom-0 w-0.5 bg-border/50" />
      
      <div className="space-y-12">
        {phases?.map((phase, idx) => {
          const isExpanded = expandedPhaseIndex === idx;
          return (
            <div key={idx} className="relative flex flex-col md:flex-row items-start md:items-center w-full group cursor-pointer" onClick={() => setExpandedPhaseIndex(isExpanded ? null : idx)}>
              
              {/* Left Side (Empty for odd, Content for even on desktop) */}
              <div className={cn("hidden md:block md:w-1/2 pr-12 text-right", idx % 2 === 0 ? "opacity-100" : "opacity-0")}>
                {idx % 2 === 0 && (
                  <div className="bg-card border border-border/50 hover:border-primary/50 transition-colors p-5 rounded-2xl shadow-sm text-left inline-block w-full max-w-xl">
                    <PhaseHeader phase={phase} />
                  </div>
                )}
              </div>

              {/* Center Node */}
              <div className="absolute left-6 md:left-1/2 md:transform md:-translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full border-4 border-background bg-primary/20 text-primary shadow z-10 shrink-0">
                <span className="text-[10px] font-bold">{idx + 1}</span>
              </div>

              {/* Right Side (Content for odd, Empty for even on desktop) */}
              <div className={cn("w-full pl-16 md:pl-12 md:w-1/2 text-left", idx % 2 !== 0 ? "md:opacity-100" : "md:hidden md:opacity-0")}>
                <div className="bg-card border border-border/50 hover:border-primary/50 transition-colors p-5 rounded-2xl shadow-sm inline-block w-full max-w-xl">
                  <PhaseHeader phase={phase} />
                </div>
              </div>

              {/* Mobile View */}
              {idx % 2 === 0 && (
                 <div className="w-full pl-16 md:hidden text-left mb-0">
                   <div className="bg-card border border-border/50 hover:border-primary/50 transition-colors p-5 rounded-2xl shadow-sm inline-block w-full max-w-xl">
                     <PhaseHeader phase={phase} />
                   </div>
                 </div>
              )}

              {/* Expanded Details - spans full width below the node */}
              {isExpanded && (
                <div className="w-full pl-16 md:pl-0 mt-6" onClick={e => e.stopPropagation()}>
                  <div className="bg-background border border-primary/20 rounded-2xl p-6 shadow-sm mx-auto max-w-4xl cursor-default relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
                    
                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-2">{phase.title} Details</h3>
                      <p className="text-muted-foreground">{phase.overview}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left Column */}
                      <div className="space-y-6">
                        {/* Tasks */}
                        {phase.tasks && phase.tasks.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3"><CheckSquare className="w-4 h-4 text-emerald-400" /> Granular Tasks</h4>
                            <div className="space-y-3">
                              {phase.tasks.map((task: any, tIdx: number) => (
                                <div key={tIdx} className="bg-card/50 border border-border/40 p-3 rounded-lg">
                                  <div className="flex items-start justify-between mb-1">
                                    <span className="font-medium text-sm text-foreground">{task.title}</span>
                                    <Badge variant="secondary" className="text-[10px]">{task.estimatedEffort}</Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                                  {task.acceptanceCriteria && task.acceptanceCriteria.length > 0 && (
                                     <div className="text-[11px] text-muted-foreground/80 mt-2 bg-background p-2 rounded">
                                       <span className="font-semibold text-foreground/50 block mb-1">Acceptance Criteria:</span> 
                                       <ul className="list-disc pl-4 space-y-0.5">
                                         {task.acceptanceCriteria.map((c: string, ci: number) => <li key={ci}>{c}</li>)}
                                       </ul>
                                     </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Column */}
                      <div className="space-y-6">
                        {/* Objectives & Deliverables */}
                        {phase.objectives && phase.objectives.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2"><Target className="w-4 h-4 text-blue-400" /> Objectives & Deliverables</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 mb-4">
                              {phase.objectives.map((obj: string, i: number) => <li key={i}>{obj}</li>)}
                            </ul>
                            {phase.deliverables && phase.deliverables.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {phase.deliverables.map((del: string, i: number) => <Badge key={i} variant="outline" className="bg-background">{del}</Badge>)}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Risks */}
                        {phase.risks && phase.risks.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3"><AlertTriangle className="w-4 h-4 text-rose-400" /> Risk Analysis</h4>
                            <div className="grid gap-3">
                              {phase.risks.map((risk: any, rIdx: number) => (
                                <div key={rIdx} className={cn("border p-3 rounded-lg", risk.level === 'High' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-amber-500/5 border-amber-500/20')}>
                                  <div className="flex items-start justify-between mb-1">
                                    <div className="font-medium text-sm flex items-center gap-1.5">
                                      {risk.type === 'Security' ? <ShieldAlert className={cn("w-4 h-4", risk.level === 'High' ? 'text-rose-400' : 'text-amber-400')} /> : <AlertTriangle className={cn("w-4 h-4", risk.level === 'High' ? 'text-rose-400' : 'text-amber-400')} />}
                                      {risk.description}
                                    </div>
                                    <Badge variant="outline" className={cn("text-[10px]", risk.level === 'High' ? 'border-rose-400/50 text-rose-500' : 'border-amber-400/50 text-amber-500')}>{risk.level}</Badge>
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-2"><span className="font-semibold text-foreground/60">Mitigation:</span> {risk.mitigationStrategy}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Dependencies & Resources */}
                        {(phase.dependencies?.length > 0 || phase.resources?.length > 0) && (
                           <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                             {phase.dependencies?.length > 0 && (
                               <div className="mb-3">
                                 <span className="text-xs font-bold text-muted-foreground uppercase mr-2 block mb-1">Dependencies</span>
                                 <div className="flex flex-wrap gap-1.5">
                                   {phase.dependencies.map((d: string, i: number) => <Badge key={i} variant="secondary" className="text-[10px] bg-background">{d}</Badge>)}
                                 </div>
                               </div>
                             )}
                             {phase.resources?.length > 0 && (
                               <div>
                                 <span className="text-xs font-bold text-muted-foreground uppercase mr-2 block mb-1">Resources Needed</span>
                                 <div className="flex flex-wrap gap-1.5">
                                   {phase.resources.map((r: string, i: number) => <Badge key={i} variant="outline" className="text-[10px] bg-background">{r}</Badge>)}
                                 </div>
                               </div>
                             )}
                           </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PhaseHeader({ phase }: { phase: any }) {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg text-foreground truncate mr-2">{phase.title}</h3>
        <Badge variant="outline" className={cn("text-[10px] shrink-0", phase.priority === 'High' ? 'text-rose-400 border-rose-400/20 bg-rose-400/10' : 'text-amber-400 border-amber-400/20 bg-amber-400/10')}>{phase.priority}</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground font-medium">
        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {phase.estimatedDuration}</span>
        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {phase.ownerRole}</span>
        <span className="flex items-center gap-1.5"><CheckSquare className="w-3.5 h-3.5" /> {phase.tasks?.length || 0} Tasks</span>
        {phase.complexity && (
          <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> {phase.complexity}</span>
        )}
      </div>
    </>
  );
}

function BoardView({ phases, teamRecommendations }: { phases: any[], teamRecommendations: any[] }) {
  // Group phases by ownerRole
  const groupedPhases = phases?.reduce((acc: any, phase: any) => {
    const role = phase.ownerRole || 'Unassigned';
    if (!acc[role]) acc[role] = [];
    acc[role].push(phase);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Team Insights */}
      {teamRecommendations && teamRecommendations.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {teamRecommendations.map((rec: any, i: number) => (
            <Badge key={i} variant="outline" className="px-3 py-1.5 bg-card border-border/50 text-foreground/80 flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-primary" />
              <span>{rec.headcount}x {rec.role}</span>
            </Badge>
          ))}
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
        {Object.keys(groupedPhases || {}).map((role, i) => (
          <div key={i} className="min-w-[320px] w-[320px] bg-card/50 border border-border/50 rounded-xl p-4 flex flex-col snap-center">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4 pb-4 border-b border-border/50">
              <User className="w-4 h-4 text-muted-foreground" />
              {role}
              <Badge variant="secondary" className="ml-auto bg-background">{groupedPhases[role].length}</Badge>
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto">
              {groupedPhases[role].map((phase: any, pIdx: number) => (
                <div key={pIdx} className="bg-card border border-border/50 p-4 rounded-lg shadow-sm hover:border-primary/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className={cn("text-[10px]", phase.priority === 'High' ? 'text-rose-400 border-rose-400/20 bg-rose-400/10' : 'text-amber-400 border-amber-400/20 bg-amber-400/10')}>{phase.priority}</Badge>
                    <span className="text-[10px] text-muted-foreground font-mono">{phase.estimatedDuration}</span>
                  </div>
                  <h4 className="font-medium text-sm text-foreground mb-2 leading-tight">{phase.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{phase.overview}</p>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <CheckSquare className="w-3 h-3" /> {phase.tasks?.length || 0} tasks
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MilestonesView({ milestones }: { milestones: any[] }) {
  if (!milestones || milestones.length === 0) {
    return <div className="text-center py-20 text-muted-foreground">No milestones defined.</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {milestones.map((m: any, i: number) => (
        <div key={i} className="bg-card border border-border/50 rounded-xl p-6 flex flex-col relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">{m.title || m.name}</h3>
                <p className="text-sm text-muted-foreground">{m.expectedOutcome}</p>
              </div>
            </div>
            {m.targetSprint && <Badge variant="outline" className="bg-background shrink-0">{m.targetSprint}</Badge>}
          </div>
          
          <div className="mt-auto space-y-4 relative z-10">
            {m.successCriteria && m.successCriteria.length > 0 && (
              <div className="bg-background rounded-lg p-3 border border-border/40">
                <h4 className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Success Criteria</h4>
                <ul className="space-y-1">
                  {m.successCriteria.map((crit: string, cIdx: number) => (
                     <li key={cIdx} className="text-xs text-foreground/80 flex items-start gap-1.5">
                       <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                       <span>{crit}</span>
                     </li>
                  ))}
                </ul>
              </div>
            )}
            {m.dependencies && m.dependencies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {m.dependencies.map((dep: string, dIdx: number) => (
                  <Badge key={dIdx} variant="secondary" className="text-[10px] bg-secondary/50 text-muted-foreground">Requires: {dep}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function DependenciesView({ phases, timeline }: { phases: any[], timeline: any }) {
  return (
    <div className="space-y-8">
      {/* Critical Path & Parallel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-rose-500/20 p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/5 rounded-bl-full" />
          <h3 className="font-bold text-rose-400 flex items-center gap-2 mb-4"><AlertTriangle className="w-4 h-4" /> Critical Path</h3>
          <ul className="space-y-2">
            {timeline?.criticalPath?.map((path: string, i: number) => (
              <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500/50" /> {path}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-card border border-emerald-500/20 p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-bl-full" />
          <h3 className="font-bold text-emerald-400 flex items-center gap-2 mb-4"><GitBranch className="w-4 h-4" /> Parallel Work Opportunities</h3>
          <ul className="space-y-2">
            {timeline?.parallelWorkOpportunities?.map((path: string, i: number) => (
              <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" /> {path}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Dependency Graph (Visual Representation) */}
      <div className="bg-card border border-border/50 rounded-xl p-6">
         <h3 className="font-semibold text-lg mb-6 flex items-center gap-2"><GitBranch className="w-5 h-5 text-primary" /> Dependency Chain</h3>
         <div className="relative">
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border/50 hidden md:block" />
            <div className="space-y-4 relative">
               {phases?.map((phase, i) => (
                 <div key={i} className="flex flex-col md:flex-row md:items-center gap-4 relative">
                    <div className="hidden md:flex absolute left-6 w-8 h-px bg-border/50" />
                    <div className="md:ml-14 w-full bg-background border border-border/50 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                       <div>
                         <span className="font-medium text-foreground">{phase.title}</span>
                         {phase.dependencies?.length > 0 ? (
                           <div className="text-xs text-muted-foreground mt-1">
                             <span className="text-amber-500/80 mr-1 font-semibold">Depends on:</span>
                             {phase.dependencies.join(', ')}
                           </div>
                         ) : (
                           <div className="text-xs text-emerald-500/80 mt-1 font-semibold">No dependencies</div>
                         )}
                       </div>
                       <Badge variant="outline" className="bg-primary/5 text-[10px] whitespace-nowrap">{phase.ownerRole}</Badge>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// UTILS
// ----------------------------------------------------------------------

function MetricCard({ title, value, icon, className }: { title: string, value: any, icon: React.ReactNode, className?: string }) {
  return (
    <div className={cn("bg-card border border-border/50 rounded-xl p-4 flex flex-col gap-2 shadow-sm", className)}>
      <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
        {icon}
        {title}
      </div>
      <div className="text-lg font-bold text-foreground truncate">{value || '-'}</div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap",
        active 
          ? "border-primary text-primary bg-primary/5" 
          : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
