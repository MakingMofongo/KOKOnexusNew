import { NextResponse } from 'next/server';
import { PhoneNumberService } from '@backend/services/phoneNumberService';
import { VAPI_TOKEN } from '@backend/config';

const phoneNumberService = new PhoneNumberService(VAPI_TOKEN);

export async function GET() {
  try {
    console.log('Listing phone numbers using PhoneNumberService...');
    
    const result = await phoneNumberService.listPhoneNumbers();

    if (!result.success) {
      throw new Error(result.error || 'Failed to list phone numbers');
    }

    const formattedNumbers = result.data?.map(number => ({
      phoneNumber: number.number || '',
      friendlyName: number.name || `Assistant ${number.assistantId}`,
      locality: number.region || '',
      region: number.region || '',
      isoCountry: 'US',
      capabilities: {
        voice: true,  // VAPI numbers always have voice capability
        SMS: false,   // SMS capabilities can be added if needed
        MMS: false
      },
      status: 'active',
      assistantId: number.assistantId,
      createdAt: number.createdAt,
      provider: number.provider
    })) || [];

    console.log('Formatted numbers:', formattedNumbers);

    return NextResponse.json({
      success: true,
      data: formattedNumbers
    });
  } catch (error) {
    console.error('Error listing phone numbers:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to list phone numbers' 
      },
      { status: 500 }
    );
  }
} 