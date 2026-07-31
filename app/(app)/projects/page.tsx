"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { listProjects, deleteProject, getProject, ProjectMetadata } from "@/services/db.service";
import { useRouter } from "next/navigation";
import { useBuildFlowStore } from "@/store/buildflow-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Trash2, FolderOpen, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<ProjectMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const setBuildFlow = useBuildFlowStore((state) => state.setBuildFlow);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/");
      return;
    }
    fetchProjects();
  }, [user, authLoading, router]);

  const fetchProjects = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await listProjects(user.uid);
      // Sort by newest first
      setProjects(data.sort((a, b) => b.createdAt?.toMillis?.() - a.createdAt?.toMillis?.()));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(user.uid, projectId);
      setProjects(projects.filter((p) => p.id !== projectId));
    } catch (error) {
      console.error(error);
      alert("Failed to delete project");
    }
  };

  const handleOpen = async (projectId: string) => {
    if (!user) return;
    try {
      const project = await getProject(user.uid, projectId);
      if (project) {
        setBuildFlow(project.buildFlow);
        router.push("/workspace");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to open project");
    }
  };

  if (authLoading || (loading && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8 md:p-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
            <p className="text-muted-foreground mt-1">Manage your saved BuildFlows</p>
          </div>
          <Button onClick={() => router.push("/")} className="shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border/50 rounded-2xl shadow-sm">
            <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground">No projects found</h3>
            <p className="text-muted-foreground mt-1 mb-6">You haven't saved any BuildFlows yet.</p>
            <Button onClick={() => router.push("/")} variant="outline">Create your first project</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="p-5 flex flex-col justify-between hover:border-primary/50 transition-colors group">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1" title={project.name}>{project.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4 line-clamp-2" title={project.description}>
                    {project.description}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">
                    {project.createdAt?.toDate ? project.createdAt.toDate().toLocaleDateString() : 'Just now'}
                  </span>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(project.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleOpen(project.id)}>
                      Open
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
