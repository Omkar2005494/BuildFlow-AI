"use client";

import React, { useState } from "react";
import { useBuildFlowStore } from "@/store/buildflow-store";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Search, Lock, Globe, Server, Code2, Database, Shield, Zap, Activity, Clock, Box, ShieldCheck, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ApiViewer() {
  const { buildFlow } = useBuildFlowStore();
  if (!buildFlow) return null;

  if (Array.isArray(buildFlow.api)) {
    return <LegacyApiViewer api={buildFlow.api} />;
  }

  return <PremiumApiViewer api={buildFlow.api as any} />;
}

// ----------------------------------------------------------------------
// LEGACY VIEWER
// ----------------------------------------------------------------------
function LegacyApiViewer({ api }: { api: any[] }) {
  const getMethodColor = (method: string) => {
    switch(method.toUpperCase()) {
      case 'GET': return 'bg-blue-500/10 text-blue-500';
      case 'POST': return 'bg-emerald-500/10 text-emerald-500';
      case 'PUT': return 'bg-yellow-500/10 text-yellow-500';
      case 'DELETE': return 'bg-red-500/10 text-red-500';
      case 'PATCH': return 'bg-orange-500/10 text-orange-500';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Specification</h1>
        <p className="text-muted-foreground mt-2 text-lg">RESTful endpoints and payload definitions.</p>
      </div>

      <Accordion className="w-full space-y-4 mt-8">
        {api.map((endpoint, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border border-border/50 rounded-xl bg-card px-6">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className={`w-16 justify-center ${getMethodColor(endpoint.method)} border-0 font-mono rounded-md py-1`}>
                  {endpoint.method.toUpperCase()}
                </Badge>
                <span className="font-mono text-sm tracking-tight">{endpoint.endpoint}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-6 border-t border-border/50">
              <p className="text-muted-foreground mb-4 text-sm">{endpoint.description}</p>
              
              {endpoint.payload && endpoint.payload.trim().length > 2 && (
                <div className="bg-background border border-border/50 p-4 rounded-lg overflow-x-auto relative group">
                  <div className="absolute top-2 right-4 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Payload</div>
                  <pre className="text-xs font-mono text-foreground/80 mt-2">
                    {endpoint.payload}
                  </pre>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

// ----------------------------------------------------------------------
// PREMIUM VIEWER
// ----------------------------------------------------------------------
function PremiumApiViewer({ api }: { api: any }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMethod, setActiveMethod] = useState<string | null>(null);

  const insights = api.insights;
  const modules = api.modules || [];

  const filteredModules = modules.map((mod: any) => {
    const filteredEndpoints = (mod.endpoints || []).filter((ep: any) => {
      const matchesSearch = ep.route.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            ep.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            mod.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMethod = activeMethod ? ep.method.toUpperCase() === activeMethod : true;
      return matchesSearch && matchesMethod;
    });
    return { ...mod, endpoints: filteredEndpoints };
  }).filter((mod: any) => mod.endpoints.length > 0);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">API Design & Specifications</h1>
        <p className="text-muted-foreground text-lg text-balance">
          Comprehensive RESTful architecture, payload definitions, and business logic mapping.
        </p>
      </div>

      {/* Insights Header */}
      {insights && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <MetricCard title="Total" value={insights.metrics?.totalEndpoints} icon={<Server className="w-4 h-4 text-indigo-400" />} />
          <MetricCard title="Public" value={insights.metrics?.publicEndpoints} icon={<Globe className="w-4 h-4 text-emerald-400" />} />
          <MetricCard title="Protected" value={insights.metrics?.protectedEndpoints} icon={<Shield className="w-4 h-4 text-amber-400" />} />
          <MetricCard title="Admin" value={insights.metrics?.adminEndpoints} icon={<Lock className="w-4 h-4 text-rose-400" />} />
          <MetricCard title="Est. Traffic" value={insights.metrics?.estimatedRequestsPerDay} icon={<Activity className="w-4 h-4 text-blue-400" />} className="col-span-2 md:col-span-1 lg:col-span-2" />
          <MetricCard title="Auth Strategy" value={insights.metrics?.authenticationStrategy} icon={<ShieldCheck className="w-4 h-4 text-purple-400" />} className="col-span-2 md:col-span-3 lg:col-span-1" />
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-black/20 p-4 rounded-xl border border-white/5">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search endpoints, modules, descriptions..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder:text-muted-foreground/50"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(method => (
            <button 
              key={method}
              onClick={() => setActiveMethod(activeMethod === method ? null : method)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-mono border transition-all",
                activeMethod === method 
                  ? "bg-primary/20 border-primary/50 text-primary" 
                  : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
              )}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-6">
        {filteredModules.map((mod: any, i: number) => (
          <div key={i} className="border border-white/10 rounded-2xl overflow-hidden bg-black/20 shadow-xl">
            <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center gap-3">
              <Box className="w-5 h-5 text-primary/70" />
              <h2 className="text-lg font-bold text-white tracking-wide">{mod.name}</h2>
              <Badge variant="outline" className="ml-auto bg-black/40 text-xs border-white/10 text-white/50">
                {mod.endpoints.length} Endpoints
              </Badge>
            </div>
            <div className="p-4 space-y-3">
              {mod.endpoints.map((ep: any, j: number) => (
                <EndpointCard key={j} endpoint={ep} />
              ))}
            </div>
          </div>
        ))}
        {filteredModules.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No endpoints matched your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, className }: { title: string, value: any, icon: React.ReactNode, className?: string }) {
  return (
    <div className={cn("bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2 shadow-sm", className)}>
      <div className="flex items-center gap-2 text-white/50 text-xs font-semibold uppercase tracking-wider">
        {icon}
        {title}
      </div>
      <div className="text-lg font-bold text-white truncate">{value || '-'}</div>
    </div>
  );
}

function EndpointCard({ endpoint }: { endpoint: any }) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const getMethodColor = (method: string) => {
    switch(method?.toUpperCase()) {
      case 'GET': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'POST': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'PUT': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'DELETE': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'PATCH': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-white/10 text-white/70 border-white/20';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'request', label: 'Request' },
    { id: 'response', label: 'Response' },
    { id: 'logic', label: 'Business Logic' }
  ];

  const renderJson = (data: any) => {
    if (!data) return null;
    const str = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    return (
      <pre className="text-[11px] font-mono text-white/80 p-4 bg-black/50 rounded-lg overflow-x-auto border border-white/5">
        {str}
      </pre>
    );
  };

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-black/40 transition-all duration-200 hover:border-white/20">
      <div 
        className="px-5 py-3.5 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={cn("w-16 py-1 text-center rounded text-xs font-mono font-bold border", getMethodColor(endpoint.method))}>
          {endpoint.method?.toUpperCase()}
        </div>
        <div className="font-mono text-sm text-white/90 truncate flex-1">{endpoint.route}</div>
        
        <div className="hidden md:flex items-center gap-2">
          {endpoint.authentication && endpoint.authentication !== 'Public' && (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] uppercase">
              <Lock className="w-3 h-3 mr-1" />
              {endpoint.authentication}
            </Badge>
          )}
          {endpoint.authentication === 'Public' && (
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] uppercase">
              <Globe className="w-3 h-3 mr-1" />
              Public
            </Badge>
          )}
        </div>
        
        <ChevronRight className={cn("w-4 h-4 text-white/30 transition-transform", expanded && "rotate-90")} />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/10 bg-[#0a0a0a]"
          >
            {/* Tabs */}
            <div className="flex border-b border-white/10 px-4 bg-black/20 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap",
                    activeTab === tab.id 
                      ? "border-primary text-primary" 
                      : "border-transparent text-white/40 hover:text-white/70"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-white/90 font-medium mb-2">Description</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{endpoint.description}</p>
                  </div>
                  
                  {endpoint.requiredRoles && endpoint.requiredRoles.length > 0 && (
                    <div>
                      <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Required Roles</h3>
                      <div className="flex flex-wrap gap-2">
                        {endpoint.requiredRoles.map((role: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="bg-white/5 border-white/10 text-white/70">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {endpoint.successCodes && endpoint.successCodes.length > 0 && (
                    <div>
                      <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Expected Responses</h3>
                      <div className="space-y-2">
                        {endpoint.successCodes.map((sc: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 text-sm bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-lg">
                            <span className="font-mono text-emerald-400 font-bold">{sc.code}</span>
                            <span className="text-white/70">{sc.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'request' && (
                <div className="space-y-6">
                  {endpoint.requestHeaders && endpoint.requestHeaders.length > 0 && (
                    <div>
                      <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Headers</h3>
                      <ParameterTable params={endpoint.requestHeaders} />
                    </div>
                  )}
                  {endpoint.pathParameters && endpoint.pathParameters.length > 0 && (
                    <div>
                      <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Path Parameters</h3>
                      <ParameterTable params={endpoint.pathParameters} />
                    </div>
                  )}
                  {endpoint.queryParameters && endpoint.queryParameters.length > 0 && (
                    <div>
                      <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Query Parameters</h3>
                      <ParameterTable params={endpoint.queryParameters} />
                    </div>
                  )}
                  {endpoint.requestBody && (
                    <div>
                      <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Request Body</h3>
                      {renderJson(endpoint.requestBody)}
                    </div>
                  )}
                  {!endpoint.requestHeaders?.length && !endpoint.pathParameters?.length && !endpoint.queryParameters?.length && !endpoint.requestBody && (
                    <div className="text-white/40 text-sm italic">No specific request parameters or body required.</div>
                  )}
                </div>
              )}

              {activeTab === 'response' && (
                <div className="space-y-6">
                  {endpoint.responseBody ? (
                    <div>
                      <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Response Payload</h3>
                      {renderJson(endpoint.responseBody)}
                    </div>
                  ) : (
                    <div className="text-white/40 text-sm italic">No response payload specified.</div>
                  )}

                  {endpoint.errorCodes && endpoint.errorCodes.length > 0 && (
                    <div>
                      <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3 mt-6">Error Codes</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {endpoint.errorCodes.map((ec: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 text-sm bg-rose-500/5 border border-rose-500/10 p-2.5 rounded-lg">
                            <span className="font-mono text-rose-400 font-bold">{ec.code}</span>
                            <span className="text-white/70">{ec.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'logic' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Business Logic Steps
                    </h3>
                    <ul className="space-y-3">
                      {endpoint.businessLogicNotes?.map((note: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-white/80">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-[10px] font-bold text-white/50 shrink-0 mt-0.5">{idx + 1}</span>
                          <span className="leading-relaxed">{note}</span>
                        </li>
                      ))}
                    </ul>
                    {(!endpoint.businessLogicNotes || endpoint.businessLogicNotes.length === 0) && (
                      <div className="text-white/40 text-sm italic">Standard CRUD operations apply.</div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      Validation Rules
                    </h3>
                    <ul className="space-y-2">
                      {endpoint.validationRules?.map((rule: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-white/70 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                    {(!endpoint.validationRules || endpoint.validationRules.length === 0) && (
                      <div className="text-white/40 text-sm italic">No specific validation rules provided.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ParameterTable({ params }: { params: any[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full text-sm text-left">
        <thead className="bg-black/40 text-white/50 text-xs uppercase font-semibold">
          <tr>
            <th className="px-4 py-3 border-b border-white/10">Name</th>
            <th className="px-4 py-3 border-b border-white/10">Type</th>
            <th className="px-4 py-3 border-b border-white/10">Required</th>
            <th className="px-4 py-3 border-b border-white/10 w-1/2">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {params.map((p, idx) => (
            <tr key={idx} className="bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <td className="px-4 py-3 font-mono text-white/90">{p.name}</td>
              <td className="px-4 py-3 font-mono text-white/50 text-xs">{p.type || 'string'}</td>
              <td className="px-4 py-3">
                {p.required ? (
                  <span className="text-rose-400 text-xs font-bold uppercase tracking-wider">Yes</span>
                ) : (
                  <span className="text-white/30 text-xs uppercase tracking-wider">Optional</span>
                )}
              </td>
              <td className="px-4 py-3 text-white/60">{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
