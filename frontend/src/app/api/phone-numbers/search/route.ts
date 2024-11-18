import { NextResponse } from 'next/server';
import { PhoneNumberService } from '@/services/phoneNumberService';
import { VAPI_TOKEN } from '@/config';

const phoneNumberService = new PhoneNumberService(VAPI_TOKEN);

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const params = url.searchParams;
    const country = params.get('country') || 'US';
    const type = params.get('type') || 'local';
    const areaCode = params.get('areaCode');
    const contains = params.get('contains');

    const searchOptions = {
      country,
      type,
      ...(areaCode && { areaCode }),
      ...(contains && { contains })
    };

    const result = await phoneNumberService.listAvailableNumbers(searchOptions);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to search phone numbers' },
        { status: 400 }
      );
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error('Error searching phone numbers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 