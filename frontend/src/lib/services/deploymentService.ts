import type { DeploymentConfig } from '../types/templates';
import { industryTemplates } from '../constants/templates';

export class DeploymentService {
  private apiClient: any;

  constructor() {
    this.apiClient = {
      post: async (url: string, data: any) => {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return response.json();
      }
    };
  }

  async deploy(config: DeploymentConfig) {
    console.log('Starting deployment with config:', {
      template: config.template,
      subtype: config.subtype,
      businessName: config.industryConfig.businessName
    });

    // Get the template configuration - FIXED LOOKUP
    const [industry] = config.template.split('-');
    
    console.log('Template lookup details:', {
      industry,
      fullTemplate: config.template,
      availableIndustries: Object.keys(industryTemplates),
      industryExists: !!industryTemplates[industry],
      templates: industryTemplates
    });

    // First get the industry template
    const industryTemplate = industryTemplates[industry];
    if (!industryTemplate) {
      console.error('Industry not found:', {
        industry,
        availableIndustries: Object.keys(industryTemplates)
      });
      throw new Error(`Industry template not found: ${industry}`);
    }

    console.log('Found industry template:', {
      industry,
      subtypes: Object.keys(industryTemplate.subtypes)
    });

    // Then get the specific subtype
    const templateConfig = industryTemplate.subtypes[config.template];
    console.log('Template config lookup:', {
      lookingFor: config.template,
      found: !!templateConfig,
      availableSubtypes: Object.keys(industryTemplate.subtypes),
      templateConfig: templateConfig
    });

    if (!templateConfig) {
      console.error('Template not found:', {
        industry,
        template: config.template,
        availableSubtypes: Object.keys(industryTemplate.subtypes)
      });
      throw new Error(`Template configuration not found: ${config.template}`);
    }

    console.log('System prompt check:', {
      hasSystemPrompt: !!templateConfig.systemPrompt,
      systemPromptPreview: templateConfig.systemPrompt?.substring(0, 100) + '...',
      systemPromptLength: templateConfig.systemPrompt?.length
    });

    if (!templateConfig.systemPrompt) {
      console.error('System prompt missing for template:', {
        template: config.template,
        templateConfig
      });
      throw new Error('System prompt not found in template configuration');
    }

    // Prepare deployment data with required fields
    const deploymentData = {
      config: {
        assistantId: config.industryConfig.assistantId,
        businessName: config.industryConfig.businessName,
        industry: config.industryConfig.industry,
        size: config.industryConfig.size || 'small',
        region: config.industryConfig.region || 'US',
        expectedCallVolume: config.industryConfig.expectedCallVolume || 100,
        languages: config.industryConfig.settings?.language || ['en'],
        tone: config.industryConfig.settings?.tone || 'professional',
        businessHours: {
          timezone: 'America/New_York',
          schedule: [{ 
            days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'], 
            hours: '9:00-17:00' 
          }]
        },
        customInstructions: config.industryConfig.customInstructions
      },
      template: config.template,
      voice: config.voice,
      number: config.number,
      systemPrompt: templateConfig.systemPrompt
    };

    console.log('Final deployment data:', {
      businessName: deploymentData.config.businessName,
      template: deploymentData.template,
      hasSystemPrompt: !!deploymentData.systemPrompt,
      systemPromptPreview: deploymentData.systemPrompt?.substring(0, 100) + '...',
      systemPromptLength: deploymentData.systemPrompt?.length,
      fullData: JSON.stringify(deploymentData, null, 2)
    });

    const result = await this.apiClient.post('/api/deploy', deploymentData);
    console.log('Deployment result:', result);

    return result;
  }
} 