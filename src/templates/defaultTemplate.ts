import { IndustryTemplate, BusinessHoursConfig, FailoverConfig } from './baseTemplate';
import { BusinessConfig } from '../types/business';

export class DefaultTemplate implements IndustryTemplate {
  protected businessConfig: BusinessConfig;

  constructor(config: BusinessConfig) {
    this.businessConfig = config;
  }

  getBasePrompts() {
    return [
      {
        role: "assistant",
        content: this.generateBasePrompt()
      }
    ];
  }

  getVoiceConfig() {
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

  getOptimalTemperature() {
    return 0.7; // Balanced between creative and consistent
  }

  getOptimalTokens() {
    return 150; // Good for most responses
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

  generateGreeting(config: BusinessConfig): string {
    return `Hello! I'm the virtual assistant for ${config.businessName}. How can I help you today?`;
  }

  protected generateBasePrompt(): string {
    const { businessName, tone, languages } = this.businessConfig;
    
    return `You are a customer service assistant for ${businessName}.
            Communication style: ${tone}
            Languages: ${languages.join(', ')}
            
            Key guidelines:
            1. Be helpful and professional
            2. Keep responses concise
            3. Ask for clarification when needed
            4. Know when to escalate to a human`;
  }

  handleCommonScenarios() {
    return {
      commonQueries: [
        "What are your hours?",
        "How can I contact support?"
      ],
      responses: {
        "hours": `Our hours are ${this.businessConfig.businessHours.schedule[0].hours}`,
        "support": "I can help you with most issues, or connect you with a human if needed."
      },
      escalationTriggers: [
        "speak to human",
        "manager",
        "supervisor"
      ],
      fallbackResponses: [
        "I apologize, but I'm not sure about that. Would you like me to connect you with someone who can help?"
      ]
    };
  }

  getComplianceRules() {
    return {
      requiredDisclosures: [
        "This call may be recorded for quality assurance",
        "I am an AI assistant"
      ],
      restrictedPhrases: [
        "guarantee",
        "promise"
      ],
      dataHandling: {
        piiHandling: "mask" as const,
        retentionPeriod: 90,
        encryptionRequired: true,
        dataCategories: ["contact", "preferences"]
      },
      recordingRequirements: {
        enabled: true,
        format: "mp3" as const,
        retention: 30,
        encryption: true
      }
    };
  }

  getBusinessHoursHandling(): BusinessHoursConfig {
    return {
      timezone: this.businessConfig.businessHours.timezone,
      schedule: this.businessConfig.businessHours.schedule
    };
  }

  getFailoverBehavior(): FailoverConfig {
    return {
      enabled: true,
      maxAttempts: 3,
      retryDelay: 1000,
      fallbackMessage: "I'm having trouble connecting. Let me transfer you to a human agent."
    };
  }

  // ... implement other required methods
} 