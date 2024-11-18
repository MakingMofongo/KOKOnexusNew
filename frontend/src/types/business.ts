export interface BusinessConfig {
  businessName: string
  industry: 'retail' | 'healthcare' | 'hospitality' | 'technology'
  size: 'small' | 'medium' | 'enterprise'
  region: string
  expectedCallVolume: number
  businessHours: {
    timezone: string
    schedule: Array<{
      days: string[]
      hours: string
    }>
  }
  complianceRequirements?: string[]
  languages: string[]
  tone: 'professional' | 'friendly' | 'casual'
  assistantId?: string
}

export interface BusinessHours {
  timezone: string
  weekdays: {
    start: string
    end: string
  }
  weekend?: {
    start: string
    end: string
  }
}

export interface DeploymentResult {
  id: string
  status: 'success' | 'error'
  assistant: {
    id: string
    name: string
    phoneNumber: string
  }
  configuration: BusinessConfig
} 