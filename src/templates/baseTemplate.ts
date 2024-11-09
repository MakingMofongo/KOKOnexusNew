import { BusinessConfig } from '../types/business';

export interface BusinessHoursConfig {
  timezone: string;
  schedule: Array<{
    days: string[];
    hours: string;
  }>;
}

export interface FailoverConfig {
  enabled: boolean;
  maxAttempts: number;
  retryDelay: number;
  fallbackMessage: string;
}

export interface DataHandlingRules {
  piiHandling: 'mask' | 'remove' | 'store';
  retentionPeriod: number;
  encryptionRequired: boolean;
  dataCategories: string[];
}

export interface RecordingRules {
  enabled: boolean;
  format: 'mp3' | 'wav';
  retention: number;
  encryption: boolean;
}

export interface IndustryTemplate {
  // Core configuration methods
  getBasePrompts(): Array<{ role: string; content: string }>;
  getVoiceConfig(): VoiceConfig;
  getOptimalTemperature(): number;
  getOptimalTokens(): number;
  getAnalysisPlan(): AnalysisPlan;
  generateGreeting(config: BusinessConfig): string;

  // Business logic methods
  handleCommonScenarios(): ScenarioHandling;
  getComplianceRules(): ComplianceRules;
  getBusinessHoursHandling(): BusinessHoursConfig;
  getFailoverBehavior(): FailoverConfig;
}

interface VoiceConfig {
  provider: string;
  voiceId: string;
  speed: number;
  chunkPlan?: {
    enabled: boolean;
    minCharacters: number;
  };
}

interface AnalysisPlan {
  summaryPlan?: {
    enabled: boolean;
    timeoutSeconds: number;
  };
  successEvaluationPlan?: {
    enabled: boolean;
    rubric: "NumericScale";
    timeoutSeconds: number;
  };
  structuredDataPlan?: {
    enabled: boolean;
    timeoutSeconds: number;
    schema: Record<string, any>;
  };
}

interface ScenarioHandling {
  commonQueries: string[];
  responses: Record<string, string>;
  escalationTriggers: string[];
  fallbackResponses: string[];
}

interface ComplianceRules {
  requiredDisclosures: string[];
  restrictedPhrases: string[];
  dataHandling: DataHandlingRules;
  recordingRequirements: RecordingRules;
}

// ... other interfaces 