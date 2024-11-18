import { NextResponse } from 'next/server';
import { PhoneNumberService } from '@backend/services/phoneNumberService';
import { VAPI_TOKEN } from '@backend/config';

const phoneNumberService = new PhoneNumberService(VAPI_TOKEN);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || 'US';
    const type = (searchParams.get('type') || 'local') as 'local' | 'tollfree' | 'mobile';
    const areaCode = searchParams.get('areaCode') || undefined;
    const contains = searchParams.get('contains') || undefined;
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const result = await phoneNumberService.listAvailableNumbers({
      country,
      type,
      areaCode,
      contains,
      limit
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to fetch numbers' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('Error fetching available numbers:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 