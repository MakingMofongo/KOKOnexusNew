import { Assistant } from './assistant';
import { PhoneNumber } from './phoneNumber';

// Core business configuration
export interface BusinessConfig {
  businessName: string;
  industry: string;
  size: 'small' | 'medium' | 'enterprise';
  region: string;
  expectedCallVolume: number;
  businessHours: {
    timezone: string;
    schedule: Array<{
      days: string[];
      hours: string;
    }>;
  };
  languages: string[];
  tone: 'professional' | 'friendly' | 'casual';
  customPrompts?: Array<{ role: string; content: string }>;
  customInstructions?: string;
  voiceId?: string;
  settings?: {
    recordCalls?: boolean;
    transcribeCalls?: boolean;
    analyticsEnabled?: boolean;
  };
  timezone?: string;
  additionalInstructions?: string;
}

// Deployment result
export interface DeploymentResult {
  success: boolean;
  assistant: {
    id: string;
    name: string;
    phoneNumber?: string;
  };
  phoneNumber: {
    id: string;
    number: string;
  };
  analytics?: AnalyticsConfig;
  quickStartGuide: {
    setup: Array<{
      description: string;
    }>;
  };
  estimatedCosts: {
    monthly: number;
    perCall: number;
  };
  error?: string;
}

// Analytics configuration
export interface AnalyticsConfig {
  metrics: {
    successRate: number;
    avgDuration: number;
    csat: number;
  };
  insights: string[];
}

// Quick start guide structure
export interface QuickStartGuide {
  setup: SetupStep[];
  bestPractices: string[];
  commonScenarios: Scenario[];
  troubleshooting: TroubleshootingGuide;
}

export interface SetupStep {
  title: string;
  description: string;
  status: 'pending' | 'completed';
}

export interface Scenario {
  name: string;
  description: string;
  example: string;
  resolution: string;
}

export interface TroubleshootingGuide {
  commonIssues: Array<{
    problem: string;
    solution: string;
  }>;
  contacts: {
    technical: string;
    support: string;
  };
}

// Cost breakdown structure
export interface CostBreakdown {
  monthly: number;
  perCall: number;
  breakdown: {
    assistant: number;
    phoneNumber: number;
    analytics: number;
  };
}

// Analysis results
export interface DeploymentAnalysis {
  metrics: {
    successRate: number;
    avgDuration: number;
    csat: number;
  };
  suggestions: string[];
  costs: {
    current: number;
    projected: number;
    savings: number;
  };
}

// ... other business-focused types 