export interface PhoneNumber {
  id: string;
  name?: string;
  phoneNumber: string;
  assistantId?: string;
  status: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
  sipUri?: string;
}

export interface PhoneNumberConfig {
  provider: 'twilio' | 'vonage' | 'byo';
  number: string;
  name?: string;
  assistantId?: string;
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  // Add other provider-specific fields as needed
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AvailablePhoneNumber {
  phoneNumber: string;
  country: string;
  region: string;
  locality?: string;
  type: string;
  capabilities: string[];
  price?: {
    amount: number;
    currency: string;
  };
} 