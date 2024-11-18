import { NextResponse } from 'next/server';
import { PhoneNumberService } from '@backend/services/phoneNumberService';
import { VAPI_TOKEN } from '@backend/config';

const phoneNumberService = new PhoneNumberService(VAPI_TOKEN);

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { assistantId } = await request.json();

    const result = await phoneNumberService.updatePhoneNumber(params.id, {
      assistantId
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to update phone number');
    }

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Error updating phone number:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update phone number' 
      },
      { status: 500 }
    );
  }
} 