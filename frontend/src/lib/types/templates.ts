export interface IndustryConfig {
  businessName: string;
  industry: string;
  subtype?: string;
  customPrompts?: Array<{ role: string; content: string }>;
  settings?: {
    tone?: 'professional' | 'friendly' | 'casual';
    language?: string[];
    recordCalls?: boolean;
    transcribeCalls?: boolean;
    model?: {
      provider: string;
      model: string;
      temperature?: number;
    };
  };
  [key: string]: any;
}

export interface DeploymentConfig {
  industryConfig: IndustryConfig;
  template: string;
  subtype: string;
  voice: {
    provider: string;
    voiceId: string;
    model?: string;
    stability?: number;
    similarityBoost?: number;
  };
  number?: {
    id: string;
    number: string;
  };
} 