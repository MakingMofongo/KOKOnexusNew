import { NextResponse } from 'next/server';
import { AssistantService } from '@backend/services/assistantService';
import { VAPI_TOKEN } from '@backend/config';
import type { BusinessConfig } from '@backend/types/business';

const assistantService = new AssistantService(VAPI_TOKEN);

export async function POST(request: Request) {
  try {
    const config = await request.json() as BusinessConfig;

    // Create assistant config from business config
    // Only include fields that VAPI accepts
    const assistantConfig = {
      name: config.businessName,
      type: config.industry,
      // Remove description as it's not accepted
      // Add any other required fields from the business config
      languages: config.languages,
      tone: config.tone,
      businessHours: config.businessHours,
      region: config.region
    };

    console.log('Creating assistant with config:', assistantConfig);

    const result = await assistantService.createAssistant(assistantConfig);

    if (!result.success) {
      throw new Error(result.error || 'Failed to create assistant');
    }

    console.log('Assistant created successfully:', result.data);

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Error creating assistant:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create assistant' 
      },
      { status: 500 }
    );
  }
} 