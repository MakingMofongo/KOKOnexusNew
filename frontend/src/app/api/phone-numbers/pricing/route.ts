import { NextResponse } from 'next/server';
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
  throw new Error('Missing Twilio credentials');
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || 'US';
    const type = searchParams.get('type') || 'local';

    console.log('Fetching pricing for:', { country, type });

    // Get voice pricing
    console.log('Fetching voice pricing...');
    const voicePricing = await client.pricing.v1.voice
      .countries(country)
      .fetch();
    
    console.log('Voice pricing response:', JSON.stringify(voicePricing, null, 2));

    // Get phone number pricing
    console.log('Fetching phone number pricing...');
    const phoneNumberPricing = await client.pricing.v1.phoneNumbers
      .countries(country)
      .fetch();
    
    console.log('Phone number pricing response:', JSON.stringify(phoneNumberPricing, null, 2));

    // Normalize the search type
    const normalizedSearchType = type.toLowerCase().trim();
    console.log('Normalized search type:', normalizedSearchType);
    
    // Find the matching number type price
    const numberPrice = phoneNumberPricing.phoneNumberPrices.find(price => {
      if (!price || !price.number_type) {
        console.log('Invalid price object:', price);
        return false;
      }

      const priceType = price.number_type.toLowerCase();
      console.log('Comparing price types:', { priceType, normalizedSearchType });
      
      return (
        priceType === normalizedSearchType ||
        (normalizedSearchType === 'tollfree' && priceType === 'toll free') ||
        (normalizedSearchType === 'toll free' && priceType === 'tollfree') ||
        (priceType === 'local' && normalizedSearchType === 'local')
      );
    });

    if (!numberPrice) {
      throw new Error(`No pricing found for ${type} numbers in ${country}`);
    }

    // Format pricing similar to CLI interface
    const prices = [{
      numberType: type,
      basePrice: numberPrice.base_price,
      currentPrice: numberPrice.current_price,
      voicePrice: voicePricing.outboundPrefixPrices[0].current_price
    }];

    // Add usage pricing
    const usagePricing = {
      voiceInbound: voicePricing.inboundCallPrices[0].current_price,
      voiceOutbound: voicePricing.outboundPrefixPrices[0].current_price,
      smsInbound: '0.0075',  // Standard Twilio pricing
      smsOutbound: '0.0079'  // Standard Twilio pricing
    };

    const response = {
      success: true,
      data: {
        priceUnit: phoneNumberPricing.priceUnit,
        prices,
        additionalInfo: usagePricing
      }
    };

    console.log('Final response:', JSON.stringify(response, null, 2));
    return NextResponse.json(response);
  } catch (error) {
    console.error('Detailed error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch pricing' 
      },
      { status: 500 }
    );
  }
} 