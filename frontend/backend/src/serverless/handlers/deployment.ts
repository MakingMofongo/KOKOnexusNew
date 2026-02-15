import { NextResponse } from 'next/server';
import { AssistantService } from '../../services/assistantService';
import { PhoneNumberService } from '../../services/phoneNumberService';
import { VAPI_TOKEN } from '../../config';
// UpdateAssistantDto type removed — object is passed untyped to avoid SDK type mismatches
import { industryTemplates } from '../../constants/templates';

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
      voice,
      number,
      systemPrompt
    } = body;

    // Get the template configuration
    const [mainIndustry] = template.split('-');
    const templateConfig = industryTemplates[mainIndustry]?.subtypes[template];

    console.log('Template lookup:', {
      template,
      mainIndustry,
      hasTemplateConfig: !!templateConfig,
      systemPrompt,
      templateSystemPrompt: templateConfig?.systemPrompt
    });

    // Use provided system prompt or fall back to template's system prompt
    const finalSystemPrompt = systemPrompt || templateConfig?.systemPrompt;

    if (!finalSystemPrompt) {
      console.error('No system prompt available');
      return NextResponse.json(
        { success: false, error: 'System prompt is required' },
        { status: 400 }
      );
    }

    // Create the enhanced system message by combining template prompt with business details
    const systemMessage = `${finalSystemPrompt}

Hotel Specific Information:
- Name: ${config.businessName}
- Phone: ${config.businessPhone || 'Not provided'}
- Email: ${config.businessEmail || 'Not provided'}

Business Hours:
${config.businessHours?.schedule?.map((schedule: { days: string[], hours: string }) => 
  `- ${schedule.days.join(', ')}: ${schedule.hours}`
).join('\n') || '- Standard business hours'}

${config.specialServices?.length ? `
Luxury Amenities & Features:
${config.specialServices.map((service: string) => `- ${service}`).join('\n')}` : ''}

${config.specificDetails ? `
Special Experiences & Services:
${config.specificDetails}` : ''}

Languages: ${config.languages?.join(', ') || 'English'}
Service Tone: ${config.tone || 'Professional'}

${config.customInstructions ? `Additional Instructions:\n${config.customInstructions}` : ''}`;

    console.log('Generated system message:', systemMessage);

    // Update the assistant with final configuration
    const assistantUpdateData = {
      name: config.businessName,
      firstMessage: templateConfig?.firstMessage || `Hello! Welcome to ${config.businessName}. How can I assist you today?`,
      model: {
        provider: 'groq',
        model: 'llama-3.1-8b-instant',
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
      },
      transcriber: {
        model: "nova-2",
        language: "multi",
        provider: "deepgram",
        endpointing: 10,
        smartFormat: false,
        codeSwitchingEnabled: true
      }
    };

    console.log('Updating assistant with data:', JSON.stringify(assistantUpdateData, null, 2));
    
    const assistantResult = await assistantService.updateAssistant(
      config.assistantId, 
      assistantUpdateData as any
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