# Vapi Assistant Project Documentation

## Project Overview
A comprehensive solution for deploying and managing AI-powered call assistants using Vapi.ai. The project uses a template-based architecture for industry-specific customizations and provides business-focused abstractions over the Vapi API.

## Core Architecture

### Directory Structure
```
vapi-assistant/
├── src/
│   ├── services/
│   │   ├── assistantService.ts       # Core Vapi assistant operations
│   │   ├── phoneNumberService.ts     # Phone number management
│   │   └── businessDeploymentService.ts # Business-focused deployment logic
│   ├── templates/
│   │   ├── baseTemplate.ts          # Base template interface
│   │   ├── defaultTemplate.ts       # Default implementation
│   │   └── industries/
│   │       └── retailTemplate.ts    # Retail-specific template
│   ├── types/
│   │   ├── assistant.ts            # Assistant-related types
│   │   ├── phoneNumber.ts          # Phone number types
│   │   └── business.ts             # Business configuration types
│   ├── config/
│   │   ├── assistantConfig.ts      # Assistant defaults
│   │   └── phoneNumberConfig.ts    # Provider-specific configs
│   ├── cli/                        # CLI interface (temporary)
│   └── config.ts                   # Environment configuration
```

## Core Components

### 1. Template System
The template system provides industry-specific configurations and behaviors.

#### Base Template (`templates/baseTemplate.ts`)
Defines the contract for all industry templates:
```typescript
interface IndustryTemplate {
  // Core configuration
  getBasePrompts(): Array<{ role: string; content: string }>;
  getVoiceConfig(): VoiceConfig;
  getAnalysisPlan(): AnalysisPlan;
  
  // Business logic
  handleCommonScenarios(): ScenarioHandling;
  getComplianceRules(): ComplianceRules;
  getBusinessHoursHandling(): BusinessHoursConfig;
  getFailoverBehavior(): FailoverConfig;
}
```

#### Default Template (`templates/defaultTemplate.ts`)
Provides base implementation with sensible defaults:
- Generic customer service prompts
- Standard voice configuration
- Basic compliance rules
- Default business hours handling

#### Industry Templates
Located in `templates/industries/`:
- `retailTemplate.ts`: Retail-specific optimizations
  - Product-focused prompts
  - Faster voice speed
  - Sales metrics tracking

### 2. Business Deployment Service
`services/businessDeploymentService.ts` handles high-level deployment operations:

```typescript
class BusinessDeploymentService {
  async deployBusinessAssistant(config: BusinessConfig): Promise<DeploymentResult>
  async analyzeDeployment(deploymentId: string): Promise<DeploymentAnalysis>
}
```

Key features:
- Industry-specific template selection
- Optimal provider selection
- Analytics setup
- Cost estimation

### 3. Type System

#### Business Types (`types/business.ts`)
```typescript
interface BusinessConfig {
  businessName: string;
  industry: 'retail' | 'healthcare' | 'hospitality' | 'technology';
  size: 'small' | 'medium' | 'enterprise';
  region: string;
  expectedCallVolume: number;
  businessHours: BusinessHours;
  languages: string[];
  tone: 'professional' | 'friendly' | 'casual';
}
```

#### Phone Number Types (`types/phoneNumber.ts`)
Provider-specific configurations:
```typescript
type CreatePhoneNumberConfig = 
  | ByoPhoneNumberConfig 
  | TwilioPhoneNumberConfig 
  | VonagePhoneNumberConfig 
  | VapiPhoneNumberConfig;
```

### Transcriber Configuration
The system now supports multiple transcription providers:
- Custom Transcriber: For self-hosted transcription services
- Deepgram: Advanced transcription with code switching support
- Gladia: Multi-language transcription with prosody detection
- Talkscriber: Simple Whisper-based transcription

Each provider has specific configuration options that can be set through the CLI or programmatically.

## Configuration System

### Assistant Configuration
`config/assistantConfig.ts` provides default templates:
```typescript
export const defaultAssistantConfig = {
  voice: {
    provider: "rime-ai",
    voiceId: "marsh",
    speed: 1.0
  },
  analysisPlan: {
    summaryPlan: { enabled: true },
    successEvaluationPlan: { enabled: true }
  }
};
```

### Phone Number Configuration
`config/phoneNumberConfig.ts` contains provider defaults:
```typescript
export const defaultTwilioConfig: TwilioPhoneNumberConfig = {
  provider: 'twilio',
  name: 'Twilio Phone Number'
};
```

## Development Patterns

### Template Creation
1. Create new template in `templates/industries/`
2. Extend `DefaultTemplate`
3. Override necessary methods
4. Update business deployment service

Example:
```typescript
export class HealthcareTemplate extends DefaultTemplate {
  getComplianceRules() {
    return {
      ...super.getComplianceRules(),
      requiredDisclosures: [
        "HIPAA compliance notice",
        ...super.getComplianceRules().requiredDisclosures
      ]
    };
  }
}
```

### Error Handling
Standard response pattern:
```typescript
interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

## Future Development

### 1. Frontend Integration
Planned structure:
```
frontend/
├── components/
│   ├── deployment/
│   │   ├── IndustrySelector.tsx
│   │   └── ConfigurationForm.tsx
│   └── analytics/
│       └── DeploymentMetrics.tsx
├── pages/
└── state/
```

### 2. Template System Expansion
- Healthcare template with HIPAA compliance
- Hospitality template with multilingual support
- Financial services template with security focus

### 3. Analytics Enhancement
- Call pattern analysis
- Cost optimization suggestions
- Performance benchmarking
- A/B testing support

### 4. Provider Integration
- Enhanced provider selection logic
- Automatic number management
- Failover configurations
- Load balancing

### 5. Business Logic
- Business hours optimization
- Regional routing
- Language-based routing
- Dynamic scaling

## Testing Strategy
```
tests/
├── templates/
│   ├── defaultTemplate.test.ts
│   └── industries/
├── services/
│   └── businessDeployment.test.ts
└── e2e/
    └── deployment.test.ts
```

## Performance Considerations
- Template caching
- Provider response caching
- Batch operations
- Lazy loading of industry templates

## Security
- Environment-based configurations
- Provider credential management
- Audit logging
- Rate limiting

## Monitoring
- Deployment success rates
- Template performance metrics
- Cost tracking
- Usage patterns

---

Note: This documentation serves as a living guide. Update it when:
1. Adding new templates
2. Modifying core services
3. Adding new features
4. Changing configurations