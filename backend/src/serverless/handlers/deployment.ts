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
    
    console.log('Deployment request received:', JSON.stringify(body, null, 2));

    const {
      config,
      template,
      subtype,
      voice,
      number,
      systemPrompt
    } = body;

    // Validate required fields
    if (!systemPrompt) {
      console.error('Missing system prompt');
      return NextResponse.json(
        { success: false, error: 'System prompt is required' },
        { status: 400 }
      );
    }

    if (!config?.businessName) {
      console.error('Missing business name');
      return NextResponse.json(
        { success: false, error: 'Business name is required' },
        { status: 400 }
      );
    }

    if (!config?.assistantId) {
      console.error('Missing assistant ID');
      return NextResponse.json(
        { success: false, error: 'Assistant ID is required' },
        { status: 400 }
      );
    }

    // Create the system message by combining template prompt with business details
    const systemMessage = `${systemPrompt}

Business Details:
- Name: ${config.businessName}
- Industry: ${config.industry || 'Retail'}
- Region: ${config.region || 'US'}
- Languages: ${config.languages?.join(', ') || 'English'}
- Tone: ${config.tone || 'Professional'}

${config.customInstructions ? `Additional Instructions:\n${config.customInstructions}` : ''}`;

    console.log('Generated system message:', systemMessage);

    // Update the assistant with final configuration
    const assistantUpdateData: UpdateAssistantDto = {
      name: config.businessName,
      model: {
        provider: 'vapi',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 150,
        messages: [
          {
            role: 'system',
            content: systemMessage
          }
        ]
      },
      voice: {
        provider: voice.provider,
        voiceId: voice.voiceId,
        model: voice.model,
        stability: voice.stability,
        similarityBoost: voice.similarityBoost
      }
    };

    console.log('Updating assistant with data:', JSON.stringify(assistantUpdateData, null, 2));
    
    const assistantResult = await assistantService.updateAssistant(
      config.assistantId, 
      assistantUpdateData
    );

    console.log('Assistant update result:', assistantResult);

    if (!assistantResult.success) {
      return NextResponse.json(
        { success: false, error: `Failed to update assistant: ${assistantResult.error}` },
        { status: 500 }
      );
    }

    // Update the phone number with the assistant ID (if a number was selected)
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

      console.log('Phone number update result:', phoneNumberResult);

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