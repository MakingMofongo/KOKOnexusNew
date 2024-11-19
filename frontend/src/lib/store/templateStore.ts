import { create } from 'zustand';
import type { IndustryConfig } from '../types/templates';
import type { IndustryTemplateType, SubtypeType } from '../constants/templates';

interface TemplateState {
  selectedTemplate: IndustryTemplateType | null;
  selectedSubtype: string | null;
  customConfig: IndustryConfig;
  industryPrompt: string | null;
  setTemplate: (template: IndustryTemplateType) => void;
  setSubtype: (subtype: string) => void;
  setConfig: (config: Partial<IndustryConfig>) => void;
  setIndustryPrompt: (prompt: string) => void;
}

export const useTemplateStore = create<TemplateState>((set) => ({
  selectedTemplate: null,
  selectedSubtype: null,
  customConfig: {
    businessName: '',
    industry: '',
    settings: {
      tone: 'professional',
      language: ['en'],
      recordCalls: false,
      transcribeCalls: true
    }
  } as IndustryConfig,
  industryPrompt: null,
  setTemplate: (template) => set({ selectedTemplate: template }),
  setSubtype: (subtype) => set({ selectedSubtype: subtype }),
  setConfig: (config) => set((state) => ({ 
    customConfig: { ...state.customConfig, ...config }
  })),
  setIndustryPrompt: (prompt) => set({ industryPrompt: prompt })
})); 