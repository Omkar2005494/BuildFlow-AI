import { db } from "@/lib/firebase/client";
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { BuildFlow } from "@/types";

export interface ProjectMetadata {
  id: string;
  name: string;
  description: string;
  createdAt: any;
  updatedAt: any;
}

export interface SavedProject {
  metadata: ProjectMetadata;
  buildFlow: BuildFlow;
}

/**
 * Saves a generated BuildFlow as a new project for the authenticated user.
 */
export async function saveProject(uid: string, projectId: string, name: string, description: string, buildFlow: BuildFlow) {
  const projectRef = doc(db, "users", uid, "projects", projectId);
  
  await setDoc(projectRef, {
    metadata: {
      id: projectId,
      name,
      description,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    buildFlow,
  });
}

/**
 * Loads a specific project by ID for a user.
 */
export async function getProject(uid: string, projectId: string): Promise<SavedProject | null> {
  const projectRef = doc(db, "users", uid, "projects", projectId);
  const docSnap = await getDoc(projectRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as SavedProject;
  }
  return null;
}

/**
 * Lists all projects for a user.
 */
export async function listProjects(uid: string): Promise<ProjectMetadata[]> {
  const projectsRef = collection(db, "users", uid, "projects");
  const querySnapshot = await getDocs(projectsRef);
  
  return querySnapshot.docs.map(doc => doc.data().metadata as ProjectMetadata);
}

/**
 * Deletes a project.
 */
export async function deleteProject(uid: string, projectId: string) {
  const projectRef = doc(db, "users", uid, "projects", projectId);
  await deleteDoc(projectRef);
}
