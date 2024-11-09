export interface BusinessConfig {
  businessName: string
  industry: 'retail' | 'healthcare' | 'hospitality' | 'technology'
  size: 'small' | 'medium' | 'enterprise'
  region: string
  expectedCallVolume: number
  businessHours: BusinessHours
  languages: string[]
  tone: 'professional' | 'friendly' | 'casual'
  template: string
  voice: string
  phoneNumber: string
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