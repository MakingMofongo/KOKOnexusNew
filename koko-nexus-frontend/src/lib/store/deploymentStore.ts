import { create } from 'zustand'
import { deploymentApi } from '@/lib/api/deployment'
import { assistantApi } from '@/lib/api/assistant'
import { phoneNumberApi } from '@/lib/api/phoneNumber'
import type { BusinessConfig, DeploymentResult } from '@/types/business'

interface DeploymentState {
  step: 'template' | 'voice' | 'number' | 'deploy'
  selectedIndustry: string | null
  selectedTemplate: string | null
  selectedVoice: {
    id: string
    name: string
    preview: string
  } | null
  selectedNumber: {
    number: string
    location: string
    type: 'local' | 'tollfree'
  } | null
  deploymentStatus: 'idle' | 'deploying' | 'success' | 'error'
  deploymentResult: DeploymentResult | null
  deploymentError: string | null
  setStep: (step: DeploymentState['step']) => void
  setIndustry: (industry: string) => void
  setTemplate: (template: string) => void
  setVoice: (voice: DeploymentState['selectedVoice']) => void
  setNumber: (number: DeploymentState['selectedNumber']) => void
  deploy: () => Promise<void>
  reset: () => void
}

export const useDeploymentStore = create<DeploymentState>((set, get) => ({
  step: 'template',
  selectedIndustry: null,
  selectedTemplate: null,
  selectedVoice: null,
  selectedNumber: null,
  deploymentStatus: 'idle',
  deploymentResult: null,
  deploymentError: null,

  setStep: (step) => set({ step }),
  setIndustry: (industry) => set({ selectedIndustry: industry }),
  setTemplate: (template) => set({ selectedTemplate: template }),
  setVoice: (voice) => set({ selectedVoice: voice }),
  setNumber: (number) => set({ selectedNumber: number }),

  deploy: async () => {
    const state = get()
    if (!state.selectedTemplate || !state.selectedVoice || !state.selectedNumber) {
      set({ deploymentError: 'Missing required configuration' })
      return
    }

    set({ deploymentStatus: 'deploying', deploymentError: null })

    try {
      // Create business config from state
      const config: BusinessConfig = {
        businessName: 'Test Business', // TODO: Add to state
        industry: state.selectedIndustry as any,
        template: state.selectedTemplate,
        voice: state.selectedVoice.id,
        phoneNumber: state.selectedNumber.number,
        // ... other required fields
      }

      // Deploy
      const result = await deploymentApi.deploy(config)
      set({ 
        deploymentStatus: 'success',
        deploymentResult: result,
        step: 'deploy'
      })
    } catch (error) {
      set({ 
        deploymentStatus: 'error',
        deploymentError: error instanceof Error ? error.message : 'Deployment failed'
      })
    }
  },

  reset: () => set({
    step: 'template',
    selectedIndustry: null,
    selectedTemplate: null,
    selectedVoice: null,
    selectedNumber: null,
    deploymentStatus: 'idle',
    deploymentResult: null,
    deploymentError: null,
  }),
})) 