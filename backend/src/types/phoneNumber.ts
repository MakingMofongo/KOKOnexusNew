export interface PhoneNumber {
  provider: string;
  createdAt: string;
  id: string;
  orgId: string;
  sipUri: string;
  updatedAt: string;
  assistantId?: string;
  fallbackDestination?: {
    type: string;
    sipUri: string;
    description?: string;
    message?: string;
  };
  name?: string;
  serverUrl?: string;
  serverUrlSecret?: string;
  squadId?: string;
}

export interface ListPhoneNumbersOptions {
  limit?: number;
  createdAtGt?: string;
  createdAtLt?: string;
  createdAtGe?: string;
  createdAtLe?: string;
  updatedAtGt?: string;
  updatedAtLt?: string;
  updatedAtGe?: string;
  updatedAtLe?: string;
}

export interface PhoneNumberResponse {
  success: boolean;
  data?: PhoneNumber;
  error?: string;
}

export interface PhoneNumberListResponse {
  success: boolean;
  data?: PhoneNumber[];
  error?: string;
}

// Base interface for common properties
export interface BasePhoneNumberConfig {
  assistantId?: string;
  name?: string;
  serverUrl?: string;
  serverUrlSecret?: string;
  squadId?: string;
  fallbackDestination?: {
    type: 'sip';
    sipUri: string;
    description?: string;
    message?: string;
  };
}

// Provider-specific configurations
export interface ByoPhoneNumberConfig extends BasePhoneNumberConfig {
  provider: 'byo-phone-number';
  credentialId: string;
  number?: string;
  numberE164CheckEnabled?: boolean;
}

export interface TwilioPhoneNumberConfig extends BasePhoneNumberConfig {
  provider: 'twilio';
  number: string;
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioPhoneNumberSid?: string;
}

export interface VonagePhoneNumberConfig extends BasePhoneNumberConfig {
  provider: 'vonage';
  credentialId: string;
  number: string;
}

export interface VapiPhoneNumberConfig extends BasePhoneNumberConfig {
  provider: 'vapi';
  sipUri: string;
}

// Union type for all provider configurations
export type CreatePhoneNumberConfig = 
  | ByoPhoneNumberConfig 
  | TwilioPhoneNumberConfig 
  | VonagePhoneNumberConfig 
  | VapiPhoneNumberConfig; 

export interface DeletePhoneNumberResponse {
  success: boolean;
  data?: PhoneNumber;
  error?: string;
}

export interface UpdatePhoneNumberDto {
  name?: string;
  assistantId?: string;
  squadId?: string;
  serverUrl?: string;
  serverUrlSecret?: string;
  fallbackDestination?: {
    type: 'sip';
    sipUri: string;
    description?: string;
    message?: string;
  };
}

export interface UpdatePhoneNumberResponse {
  success: boolean;
  data?: PhoneNumber;
  error?: string;
}