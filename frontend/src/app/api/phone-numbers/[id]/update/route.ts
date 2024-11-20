import { NextRequest, NextResponse } from 'next/server';
import { PhoneNumberService } from '@backend/services/phoneNumberService';
import { VAPI_TOKEN } from '@backend/config';

const phoneNumberService = new PhoneNumberService(VAPI_TOKEN);

// Using the exact type structure Next.js expects
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const { assistantId } = await req.json();

    const result = await phoneNumberService.updatePhoneNumber(id, {
      assistantId
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to update phone number' },
        { status: 400 }
      );
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