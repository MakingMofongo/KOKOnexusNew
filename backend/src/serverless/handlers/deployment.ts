import { NextResponse } from 'next/server';
import { AssistantService } from '../../services/assistantService';
import { PhoneNumberService } from '../../services/phoneNumberService';
import { VAPI_TOKEN } from '../../config';
import type { UpdateAssistantDto } from '../../types/assistant';

const assistantService = new AssistantService(VAPI_TOKEN);
const phoneNumberService = new PhoneNumberService(VAPI_TOKEN);

export async function handleDeployment(req: Request) {
  try {
    const clone = req.clone();
    const body = await clone.json();
    
    console.log('Deployment request received:', body);

    const {
      config,
      template,
      voice,
      number
    } = body;

    // 1. Update the assistant with final configuration
    const assistantUpdateData: UpdateAssistantDto = {
      name: config.businessName || 'AI Assistant',
      model: {
        provider: 'vapi',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 150
      },
      voice: {
        provider: voice.provider,
        voiceId: voice.voiceId,
        model: voice.model,
        stability: voice.stability,
        similarityBoost: voice.similarityBoost
      }
    };

    console.log('Updating assistant:', config.assistantId, assistantUpdateData);
    const assistantResult = await assistantService.updateAssistant(
      config.assistantId, 
      assistantUpdateData
    );

    if (!assistantResult.success) {
      return NextResponse.json(
        { success: false, error: `Failed to update assistant: ${assistantResult.error}` },
        { status: 500 }
      );
    }

    // 2. Update the phone number with the assistant ID (if a number was selected)
    let phoneNumberResult = null;
    if (number && number.id) {
      console.log('Updating phone number:', { id: number.id, assistantId: config.assistantId });
      
      phoneNumberResult = await phoneNumberService.updatePhoneNumber(
        number.id,
        {
          assistantId: config.assistantId,
          name: config.businessName || 'AI Assistant Line'
        }
      );

      if (!phoneNumberResult.success) {
        return NextResponse.json(
          { success: false, error: `Failed to update phone number: ${phoneNumberResult.error}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        assistantId: config.assistantId,
        phoneNumber: number?.number,
        businessName: config.businessName
      }
    });
  } catch (error) {
    console.error('Deployment handler error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Deployment failed'
      },
      { status: 500 }
    );
  }
} 