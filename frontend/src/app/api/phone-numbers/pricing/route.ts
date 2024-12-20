import { NextResponse } from 'next/server';
import { PhoneNumberService } from '@backend/services/phoneNumberService';
import { VAPI_TOKEN } from '@backend/config';

const phoneNumberService = new PhoneNumberService(VAPI_TOKEN);

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const country = url.searchParams.get('country') || 'US';

    const result = await phoneNumberService.getPhoneNumberPricing(country);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in phone number pricing:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
} 