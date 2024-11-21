export type RetailSubtype = 'boutique' | 'department' | 'specialty' | 'general';
export type HealthcareSubtype = 'clinic' | 'hospital' | 'specialist' | 'pharmacy';

export interface TemplateConfig {
  name: string;
  basePrompt: string;
  configFields: string[];
}

export interface IndustryTemplateConfig {
  name: string;
  subtypes: Record<string, TemplateConfig>;
} 