import { FileService } from '@backend/services/fileService';
import * as fs from 'fs';
import { industryTemplates, IndustryTemplateType } from '../constants/templates';
import type { IndustryConfig } from '../types/templates';
import type { FileUploadResponse } from '@backend/types/file';

export class PromptService {
  private fileService: FileService;

  constructor() {
    this.fileService = new FileService(process.env.VAPI_TOKEN!);
  }

  async createAndUploadPrompt(
    config: IndustryConfig, 
    template: IndustryTemplateType,
    subtype: string
  ): Promise<FileUploadResponse> {
    const promptContent = this.generatePromptContent(config, template, subtype as any);
    
    // Create a temporary file
    const tempFilePath = `/tmp/${config.businessName}-prompt.txt`;
    await fs.promises.writeFile(tempFilePath, promptContent);
    
    try {
      const fileStream = fs.createReadStream(tempFilePath);
      const result = await this.fileService.uploadFile(fileStream, {
        name: `${config.businessName} Industry Prompt`,
        purpose: 'industry-customization'
      });
      
      return result;
    } finally {
      // Clean up temp file
      await fs.promises.unlink(tempFilePath).catch(console.error);
    }
  }

  private generatePromptContent(
    config: IndustryConfig, 
    template: IndustryTemplateType,
    subtype: keyof typeof industryTemplates[IndustryTemplateType]['subtypes']
  ): string {
    const templateConfig = industryTemplates[template]?.subtypes[subtype];
    if (!templateConfig) {
      throw new Error(`Template configuration not found for ${template}/${subtype}`);
    }

    return `${templateConfig.basePrompt}

    Custom Configuration:
    ${Object.entries(config)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')}`;
  }
} 