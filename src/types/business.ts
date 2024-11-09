import { Assistant } from './assistant';
import { PhoneNumber } from './phoneNumber';

// Core business configuration
export interface BusinessConfig {
  businessName: string;
  industry: 'retail' | 'healthcare' | 'hospitality' | 'technology';
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
  complianceRequirements?: string[];
  languages: string[];
  tone: 'professional' | 'friendly' | 'casual';
}

// Deployment result
export interface DeploymentResult {
  assistant: Assistant;
  phoneNumber: PhoneNumber;
  analytics: AnalyticsConfig;
  quickStartGuide: QuickStartGuide;
  estimatedCosts: CostBreakdown;
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