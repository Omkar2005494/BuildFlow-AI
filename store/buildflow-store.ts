import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BuildFlow } from '@/types';

interface BuildFlowState {
  buildFlow: BuildFlow | null;
  selectedSection: string;
  setBuildFlow: (buildFlow: BuildFlow) => void;
  setSelectedSection: (section: string) => void;
  clearBuildFlow: () => void;
}

export const useBuildFlowStore = create<BuildFlowState>()(
  persist(
    (set) => ({
      buildFlow: null,
      selectedSection: 'ai-team',
      setBuildFlow: (buildFlow) => set({ buildFlow, selectedSection: 'ai-team' }),
      setSelectedSection: (section) => set({ selectedSection: section }),
      clearBuildFlow: () => set({ buildFlow: null, selectedSection: 'ai-team' }),
    }),
    {
      name: 'buildflow-storage',
    }
  )
);
