import { DefaultTemplate } from '../defaultTemplate';
import { BusinessConfig } from '../../types/business';

export class RetailTemplate extends DefaultTemplate {
  constructor(config: BusinessConfig) {
    super(config);
  }

  protected generateBasePrompt(): string {
    return `${super.generateBasePrompt()}
            
            Retail-specific guidelines:
            1. Product knowledge is priority
            2. Always check stock before making promises
            3. Know return/exchange policies
            4. Promote loyalty program when relevant
            5. Handle pricing questions accurately`;
  }

  getVoiceConfig() {
    return {
      ...super.getVoiceConfig(),
      voiceId: "emily", // Optimized for retail
      speed: 1.1 // Slightly faster for retail efficiency
    };
  }

  getOptimalTemperature() {
    return 0.6; // More consistent for retail
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
      },
      structuredDataPlan: {
        enabled: true,
        timeoutSeconds: 30,
        schema: {
          type: "object",
          properties: {
            productInquiries: { type: "number" },
            salesOpportunities: { type: "number" },
            customerSatisfaction: { type: "number" }
          }
        }
      }
    };
  }

  generateSystemMessage(config: BusinessConfig): string {
    return `${super.generateSystemMessage(config)}
    
    Retail-Specific Guidelines:
    1. Focus on product information and availability
    2. Handle pricing and inventory inquiries accurately
    3. Explain return/exchange policies clearly
    4. Promote relevant loyalty programs
    5. Process basic order status inquiries
    
    Key Retail Policies:
    - Returns within 30 days
    - Price matching available
    - Loyalty program benefits
    - Gift card services
    - Special order options`;
  }
} 