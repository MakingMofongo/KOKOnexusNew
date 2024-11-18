import { NextResponse } from 'next/server';
import { PhoneNumberService } from '@backend/services/phoneNumberService';
import { VAPI_TOKEN, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from '@backend/config';

const phoneNumberService = new PhoneNumberService(VAPI_TOKEN);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { number, assistantId } = body;

    if (!assistantId) {
      throw new Error('Assistant ID is required');
    }

    console.log('Purchasing number:', { number, assistantId });

    const shortAssistantId = assistantId.split('-')[0];

    const result = await phoneNumberService.createPhoneNumber({
      provider: 'twilio',
      number,
      assistantId,
      twilioAccountSid: TWILIO_ACCOUNT_SID,
      twilioAuthToken: TWILIO_AUTH_TOKEN,
      name: `AI-${shortAssistantId}`
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to purchase number');
    }

    console.log('Number purchased successfully:', result.data);

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Error purchasing number:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to purchase number' 
      },
      { status: 500 }
    );
  }
} 