import { create } from 'zustand'
import { BusinessConfig, DeploymentResult } from '@backend/types/business'
import { Assistant } from '@backend/types/assistant'
import { PhoneNumber } from '@backend/types/phoneNumber'

interface DeploymentState {
  step: 'template' | 'voice' | 'number' | 'deploy'
  businessConfig: Partial<BusinessConfig> & { assistantId?: string }
  selectedTemplate: string
  selectedVoice: {
    provider: string
    voiceId: string
    name: string
  } | null
  selectedNumber: {
    id: string;
    number: string;
    location: string;
  } | null
  deploymentResult: DeploymentResult | null
  isDeploying: boolean
  error: string | null
  industry: string | null
  template: string | null
  languages: {
    primary: string
    additional: string[]
  }

  // Actions
  setStep: (step: DeploymentState['step']) => void
  updateBusinessConfig: (config: Partial<BusinessConfig>) => void
  setSelectedTemplate: (template: string) => void
  setVoice: (voice: DeploymentState['selectedVoice']) => void
  setNumber: (number: DeploymentState['selectedNumber']) => void
  deploy: () => Promise<void>
  reset: () => void
  setAssistantId: (id: string) => void
  setIndustry: (industry: string) => void
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
  industry: null,
  template: null,
  languages: {
    primary: 'en',
    additional: []
  },

  setStep: (step) => set({ step }),
  
  updateBusinessConfig: (config) => set((state) => ({
    businessConfig: { ...state.businessConfig, ...config }
  })),

  setSelectedTemplate: (template) => set({ selectedTemplate: template, template }),
  
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

      // After successful deployment, update the phone number with the assistant ID
      if (state.selectedNumber && state.businessConfig.assistantId) {
        const updateResponse = await fetch('/api/phone-numbers/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: state.selectedNumber.id,
            updates: {
              assistantId: state.businessConfig.assistantId,
              name: config.businessName || 'AI Assistant Line'
            }
          })
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to update phone number with assistant');
        }
      }

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
    error: null,
    industry: null,
    template: null,
    languages: {
      primary: 'en',
      additional: []
    }
  }),

  setAssistantId: (id) => set((state) => ({
    businessConfig: { ...state.businessConfig, assistantId: id }
  })),

  setIndustry: (industry) => set({ industry }),
})) 