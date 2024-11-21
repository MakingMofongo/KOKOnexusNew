import { NextResponse } from 'next/server';
import { PhoneNumberService } from '../../services/phoneNumberService';
import { VAPI_TOKEN } from '../../config';

const phoneNumberService = new PhoneNumberService(VAPI_TOKEN);

export async function handleCreatePhoneNumber(req: Request) {
  try {
    const config = await req.json();
    const result = await phoneNumberService.createPhoneNumber(config);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function handleListPhoneNumbers(req: Request) {
  try {
    console.log('Handling list phone numbers request...');
    const result = await phoneNumberService.listPhoneNumbers();
    console.log('List phone numbers result:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in handleListPhoneNumbers:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function handleSearchPhoneNumbers(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
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

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function handleGetPhoneNumberPricing(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get('country') || 'US';
    const result = await phoneNumberService.getPhoneNumberPricing(country);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function handleUpdatePhoneNumber(req: Request) {
  try {
    const body = await req.json();
    const { id, updates } = body;

    console.log('Handling phone number update:', { id, updates });

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