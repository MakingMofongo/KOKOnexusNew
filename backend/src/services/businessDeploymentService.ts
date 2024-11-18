import { AssistantService } from './assistantService';
import { PhoneNumberService } from './phoneNumberService';
import { BusinessConfig, DeploymentResult, AnalyticsConfig } from '../types/business';
import { RetailTemplate } from '../templates/industries/retailTemplate';
import { DefaultTemplate } from '../templates/defaultTemplate';
import { IndustryTemplate } from '../templates/baseTemplate';

export class BusinessDeploymentService {
  private businessConfig: BusinessConfig | null = null;

  constructor(
    private assistantService: AssistantService,
    private phoneNumberService: PhoneNumberService
  ) {}

  async deployBusinessAssistant(config: BusinessConfig): Promise<DeploymentResult> {
    this.businessConfig = config;
    
    // 1. Generate assistant configuration based on business type
    const assistantConfig = this.generateAssistantConfig(config);

    // 2. Create the assistant
    const assistantResult = await this.assistantService.createAssistant(assistantConfig);
    if (!assistantResult.success || !assistantResult.data) {
      throw new Error(`Failed to create assistant: ${assistantResult.error}`);
    }

    // 3. Set up optimal phone number based on region and requirements
    const phoneConfig = await this.generatePhoneConfig({
      ...config,
      assistantId: assistantResult.data.id
    });

    const phoneResult = await this.phoneNumberService.createPhoneNumber(phoneConfig);
    if (!phoneResult.success || !phoneResult.data || !phoneResult.data.number) {
      throw new Error(`Failed to create phone number: ${phoneResult.error}`);
    }

    // 4. Set up analytics and monitoring based on business needs
    const analytics = await this.setupAnalytics(config, assistantResult.data.id);

    // 5. Format the response according to DeploymentResult interface
    return {
      success: true,
      assistant: {
        id: assistantResult.data.id,
        name: assistantResult.data.name || config.businessName,
        phoneNumber: phoneResult.data.number
      },
      phoneNumber: {
        id: phoneResult.data.id,
        number: phoneResult.data.number
      },
      analytics,
      quickStartGuide: this.generateQuickStartGuide(config),
      estimatedCosts: this.calculateCosts(config)
    };
  }

  private generateAssistantConfig(config: BusinessConfig) {
    const template = this.getIndustryTemplate(config.industry);
    
    return {
      name: `${config.businessName} Assistant`,
      firstMessage: template.generateGreeting(config),
      model: {
        provider: "vapi",
        model: "gpt-4",
        temperature: template.getOptimalTemperature(),
        maxTokens: template.getOptimalTokens(),
        emotionRecognitionEnabled: true,
        messages: template.getBasePrompts()
      },
      voice: template.getVoiceConfig(),
      analysisPlan: template.getAnalysisPlan()
    };
  }

  private async generatePhoneConfig(config: BusinessConfig & { assistantId: string }) {
    const provider = this.determineOptimalProvider(config);
    
    switch (provider) {
      case 'twilio':
        return {
          provider: 'twilio' as const,
          name: `${config.businessName} Line`,
          number: '', // Would be determined by availability
          twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || '',
          twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || '',
          assistantId: config.assistantId
        };
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  private async setupAnalytics(config: BusinessConfig, assistantId: string): Promise<AnalyticsConfig> {
    return {
      metrics: {
        successRate: 0,
        avgDuration: 0,
        csat: 0
      },
      insights: []
    };
  }

  private generateQuickStartGuide(config: BusinessConfig) {
    return {
      setup: [
        {
          title: 'Initial Setup',
          description: 'Assistant and phone number have been configured',
          status: 'completed' as const
        }
      ],
      bestPractices: [
        'Monitor call analytics regularly',
        'Update assistant responses based on feedback'
      ],
      commonScenarios: [
        {
          name: 'Basic Inquiry',
          description: 'Customer asking for basic information',
          example: 'What are your business hours?',
          resolution: 'Assistant provides accurate business hours'
        }
      ],
      troubleshooting: {
        commonIssues: [],
        contacts: {
          technical: 'support@example.com',
          support: '1-800-SUPPORT'
        }
      }
    };
  }

  private calculateCosts(config: BusinessConfig) {
    const baseMonthly = 50;
    const perCallCost = 0.05;
    const estimatedMonthlyCalls = config.expectedCallVolume * 22; // business days

    return {
      monthly: baseMonthly + (estimatedMonthlyCalls * perCallCost),
      perCall: perCallCost,
      breakdown: {
        assistant: baseMonthly * 0.6,
        phoneNumber: baseMonthly * 0.3,
        analytics: baseMonthly * 0.1
      }
    };
  }

  private determineOptimalProvider(config: BusinessConfig): string {
    // Logic to determine best provider based on region, volume, etc.
    return 'twilio';
  }

  private getIndustryTemplate(industry: string): IndustryTemplate {
    if (!this.businessConfig) {
      throw new Error('Business config not initialized');
    }

    const templates: Record<string, IndustryTemplate> = {
      retail: new RetailTemplate(this.businessConfig),
      // Add other templates as they're implemented
    };

    return templates[industry] || new DefaultTemplate(this.businessConfig);
  }

  // Method to analyze an existing deployment
  async analyzeDeployment(deploymentId: string) {
    // Implementation for deployment analysis
    return {
      metrics: {
        successRate: 95,
        avgDuration: 180,
        csat: 4.5
      },
      suggestions: [
        'Consider enabling backchannel responses for more natural conversation',
        'Adjust voice speed during peak hours'
      ],
      costs: {
        current: 500,
        projected: 400,
        savings: 100
      }
    };
  }
} 