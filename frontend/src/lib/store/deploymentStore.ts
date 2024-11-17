import { create } from 'zustand'
import { BusinessConfig, DeploymentResult } from '@backend/types/business'
import { Assistant } from '@backend/types/assistant'
import { PhoneNumber } from '@backend/types/phoneNumber'

interface DeploymentState {
  step: 'template' | 'voice' | 'number' | 'deploy'
  businessConfig: Partial<BusinessConfig>
  selectedTemplate: string
  selectedVoice: {
    provider: string
    voiceId: string
    name: string
  } | null
  selectedNumber: {
    number: string
    location: string
  } | null
  deploymentResult: DeploymentResult | null
  isDeploying: boolean
  error: string | null

  // Actions
  setStep: (step: DeploymentState['step']) => void
  updateBusinessConfig: (config: Partial<BusinessConfig>) => void
  setTemplate: (template: string) => void
  setVoice: (voice: DeploymentState['selectedVoice']) => void
  setNumber: (number: DeploymentState['selectedNumber']) => void
  deploy: () => Promise<void>
  reset: () => void
}

export const useDeploymentStore = create<DeploymentState>((set, get) => ({
  step: 'template',
  businessConfig: {},
  selectedTemplate: '',
  selectedVoice: null,
  selectedNumber: null,
  deploymentResult: null,
  isDeploying: false,
  error: null,

  setStep: (step) => set({ step }),
  
  updateBusinessConfig: (config) => set((state) => ({
    businessConfig: { ...state.businessConfig, ...config }
  })),

  setTemplate: (template) => set({ selectedTemplate: template }),
  
  setVoice: (voice) => set({ selectedVoice: voice }),
  
  setNumber: (number) => set({ selectedNumber: number }),

  deploy: async () => {
    const state = get()
    set({ isDeploying: true, error: null })

    try {
      // Create full business config
      const config: BusinessConfig = {
        ...state.businessConfig,
        businessName: state.businessConfig.businessName || '',
        industry: state.businessConfig.industry || 'retail',
        size: state.businessConfig.size || 'small',
        region: state.businessConfig.region || 'US',
        expectedCallVolume: state.businessConfig.expectedCallVolume || 100,
        languages: state.businessConfig.languages || ['en'],
        tone: state.businessConfig.tone || 'professional',
        businessHours: state.businessConfig.businessHours || {
          timezone: 'America/New_York',
          schedule: [
            {
              days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              hours: '9:00-17:00'
            }
          ]
        }
      }

      // Call backend deployment service
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config,
          template: state.selectedTemplate,
          voice: state.selectedVoice,
          number: state.selectedNumber
        })
      })

      if (!response.ok) {
        throw new Error('Deployment failed')
      }

      const result = await response.json()
      set({ deploymentResult: result, step: 'deploy' })

    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      set({ isDeploying: false })
    }
  },

  reset: () => set({
    step: 'template',
    businessConfig: {},
    selectedTemplate: '',
    selectedVoice: null,
    selectedNumber: null,
    deploymentResult: null,
    error: null
  })
})) 