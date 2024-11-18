import { NextResponse } from 'next/server';
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || 'US';
    const type = searchParams.get('type') || 'local';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Fetch available numbers directly from Twilio
    const numbers = await client.availablePhoneNumbers(country)
      [type === 'tollfree' ? 'tollFree' : 'local']
      .list({ limit });

    // Format the response
    const formattedNumbers = numbers.map(number => ({
      phoneNumber: number.phoneNumber,
      friendlyName: number.friendlyName,
      locality: number.locality,
      region: number.region,
      isoCountry: number.isoCountry,
      capabilities: {
        voice: number.capabilities.voice,
        SMS: number.capabilities.sms,
        MMS: number.capabilities.mms,
      }
    }));

    return NextResponse.json({
      success: true,
      data: formattedNumbers
    });
  } catch (error) {
    console.error('Error in available-numbers API route:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch available numbers' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    throw new Error('Missing NEXT_PUBLIC_BASE_URL environment variable');
  }

  try {
    const body = await request.json();
    const { number, assistantId } = body;

    // Purchase the number through Twilio
    const purchasedNumber = await client.incomingPhoneNumbers
      .create({ 
        phoneNumber: number,
        voiceUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/voice-webhook`,
        voiceMethod: 'POST'
      });

    // Update the number with a friendly name
    await client.incomingPhoneNumbers(purchasedNumber.sid)
      .update({
        friendlyName: `Assistant ${assistantId}`
      });

    return NextResponse.json({
      success: true,
      data: {
        phoneNumber: purchasedNumber.phoneNumber,
        sid: purchasedNumber.sid
      }
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