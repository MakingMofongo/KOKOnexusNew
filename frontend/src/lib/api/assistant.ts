import { API_BASE } from './config'
import type { VapiAssistantConfig as AssistantConfig, AssistantResponse } from '@backend/types/assistant'

export const assistantApi = {
  create: async (config: AssistantConfig): Promise<AssistantResponse> => {
    const res = await fetch(`${API_BASE}/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })
    if (!res.ok) throw new Error('Failed to create assistant')
    return res.json()
  },

  getAssistant: async (id: string): Promise<AssistantResponse> => {
    const res = await fetch(`${API_BASE}/assistant/${id}`)
    if (!res.ok) throw new Error('Failed to fetch assistant')
    return res.json()
  },

  listAssistants: async () => {
    const res = await fetch(`${API_BASE}/assistant`)
    if (!res.ok) throw new Error('Failed to list assistants')
    return res.json()
  }
} 