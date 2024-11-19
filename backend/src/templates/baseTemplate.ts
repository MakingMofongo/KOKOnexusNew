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
  getBasePrompts(config: BusinessConfig): Array<{ role: string; content: string }>;
  getVoiceConfig(config: BusinessConfig): VoiceConfig;
  getOptimalTemperature(): number;
  getOptimalTokens(): number;
  getAnalysisPlan(): AnalysisPlan;
  generateSystemMessage(config: BusinessConfig): string;
  getBusinessHoursHandling(config: BusinessConfig): BusinessHoursConfig;
  getFailoverBehavior(): FailoverConfig;
  generateGreeting(config: BusinessConfig): string;
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

export class BaseTemplate implements IndustryTemplate {
  protected businessConfig: BusinessConfig;
  protected industryPrompt: string;

  constructor(config: BusinessConfig, industryPrompt?: string) {
    this.businessConfig = config;
    this.industryPrompt = industryPrompt || '';
  }

  getBasePrompts() {
    return [
      {
        role: "system",
        content: this.generateSystemMessage(this.businessConfig)
      }
    ];
  }

  getVoiceConfig(config: BusinessConfig) {
    return {
      provider: "rime-ai",
      voiceId: "neutral",
      speed: 1.0,
      chunkPlan: {
        enabled: true,
        minCharacters: 30
      }
    };
  }

  getOptimalTemperature(): number {
    return 0.7;
  }

  getOptimalTokens(): number {
    return 150;
  }

  getAnalysisPlan() {
    return {
      summaryPlan: {
        enabled: true,
        timeoutSeconds: 30
      },
      successEvaluationPlan: {
        enabled: true,
        rubric: "NumericScale" as const,
        timeoutSeconds: 30
      }
    };
  }

  generateSystemMessage(config: BusinessConfig): string {
    return `${this.industryPrompt}

    Business Details:
    - Name: ${config.businessName}
    - Industry: ${config.industry}
    - Region: ${config.region}
    - Languages: ${config.languages.join(', ')}
    - Tone: ${config.tone}
    
    ${config.additionalInstructions || ''}`;
  }

  generateGreeting(config: BusinessConfig): string {
    return `Hello! Welcome to ${config.businessName}. How can I assist you today?`;
  }

  getBusinessHoursHandling(config: BusinessConfig): BusinessHoursConfig {
    return {
      timezone: config.timezone || 'UTC',
      schedule: [
        {
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          hours: '9:00-17:00'
        }
      ]
    };
  }

  getFailoverBehavior(): FailoverConfig {
    return {
      enabled: true,
      maxAttempts: 3,
      retryDelay: 1000,
      fallbackMessage: "I'm currently experiencing difficulties. Please try again shortly."
    };
  }

  // ... implement other required methods
}

// ... other interfaces 