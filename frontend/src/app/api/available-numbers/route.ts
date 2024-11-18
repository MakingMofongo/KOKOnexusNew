import { NextResponse } from 'next/server';
import { PhoneNumberService } from '@backend/services/phoneNumberService';
import { VAPI_TOKEN } from '@backend/config';
import type { PhoneNumber } from '@backend/types/phoneNumber';

const phoneNumberService = new PhoneNumberService(VAPI_TOKEN);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || 'US';
    const type = searchParams.get('type') || 'local';
    const limit = parseInt(searchParams.get('limit') || '10');

    console.log('Fetching available numbers:', { country, type, limit });

    // Get available numbers
    const result = await phoneNumberService.listAvailableNumbers({
      country,
      type: type as 'local' | 'tollfree' | 'mobile',
      limit
    });

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch available numbers');
    }

    // Get pricing info like the CLI does
    const pricingResult = await phoneNumberService.getPhoneNumberPricing(country);
    
    if (!pricingResult.success) {
      throw new Error(pricingResult.error || 'Failed to fetch pricing');
    }

    // Match pricing with number type like the CLI
    const normalizedSearchType = type.toLowerCase().trim();
    const selectedPrice = pricingResult.data?.prices.find(p => {
      const isExactMatch = p.numberType === normalizedSearchType;
      const isTollFreeMatch = (normalizedSearchType === 'tollfree' && p.numberType === 'toll free') ||
                           (normalizedSearchType === 'toll free' && p.numberType === 'tollfree');
      const isLocalMatch = p.numberType === 'local' && normalizedSearchType === 'local';
      
      return isExactMatch || isTollFreeMatch || isLocalMatch;
    });

    // Format the response with actual pricing info
    const numbersWithPricing = result.data.map((number: PhoneNumber) => ({
      ...number,
      pricing: {
        basePrice: selectedPrice?.basePrice || '0',
        currentPrice: selectedPrice?.currentPrice || '0',
        priceUnit: pricingResult.data?.priceUnit || 'USD',
        voicePrice: '0.0085',
        additionalInfo: {
          voiceInbound: '0.0085',
          voiceOutbound: '0.0085',
          smsInbound: '0.0075',
          smsOutbound: '0.0079'
        }
      }
    }));

    return NextResponse.json({
      success: true,
      data: numbersWithPricing
    });
  } catch (error) {
    console.error('Error in available-numbers route:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch available numbers' 
      },
      { status: 500 }
    );
  }
} 