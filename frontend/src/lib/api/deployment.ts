import { API_BASE } from './config'
import type { BusinessConfig, DeploymentResult } from '@backend/types/business'

export const deploymentApi = {
  deploy: async (config: BusinessConfig): Promise<DeploymentResult> => {
    const res = await fetch(`${API_BASE}/deploy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })
    if (!res.ok) throw new Error('Failed to deploy')
    return res.json()
  },

  getStatus: async (deploymentId: string) => {
    const res = await fetch(`${API_BASE}/deploy/${deploymentId}`)
    if (!res.ok) throw new Error('Failed to get deployment status')
    return res.json()
  }
} 