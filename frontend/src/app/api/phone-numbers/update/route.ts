import { NextResponse } from 'next/server';
import { PhoneNumberService } from '@backend/services/phoneNumberService';
import { VAPI_TOKEN } from '@backend/config';

const phoneNumberService = new PhoneNumberService(VAPI_TOKEN);

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, updates } = body;

    console.log('Updating phone number:', { id, updates });

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Phone number ID is required' },
        { status: 400 }
      );
    }

    const result = await phoneNumberService.updatePhoneNumber(id, updates);
    console.log('Update result:', result);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in handleUpdatePhoneNumber:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
} 