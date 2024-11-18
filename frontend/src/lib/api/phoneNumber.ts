import { API_BASE } from './config'
import type { CreatePhoneNumberConfig, PhoneNumberResponse } from '@backend/types/phoneNumber'

export const phoneNumberApi = {
  list: async () => {
    const res = await fetch(`${API_BASE}/phone-number`)
    if (!res.ok) throw new Error('Failed to list phone numbers')
    return res.json()
  },

  create: async (config: CreatePhoneNumberConfig): Promise<PhoneNumberResponse> => {
    const res = await fetch(`${API_BASE}/phone-number`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })
    if (!res.ok) throw new Error('Failed to create phone number')
    return res.json()
  },

  port: async (number: string) => {
    const res = await fetch(`${API_BASE}/phone-number/port`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ number }),
    })
    if (!res.ok) throw new Error('Failed to port number')
    return res.json()
  }
} 