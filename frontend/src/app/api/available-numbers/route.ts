import { NextResponse } from 'next/server';
import { PhoneNumberService } from '@backend/services/phoneNumberService';
import { VAPI_TOKEN } from '@backend/config';
import type { PhoneNumber } from '@backend/types/phoneNumber';

const phoneNumberService = new PhoneNumberService(VAPI_TOKEN);

interface AvailableNumber {
  phoneNumber: string;
  friendlyName: string;
  locality: string;
  region: string;
  country: string;
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
  };
  type: 'local' | 'tollfree' | 'mobile';
  price: {
    amount: number;
    currency: string;
  };
}

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

    // Get pricing info
    const pricingResult = await phoneNumberService.getPhoneNumberPricing(country);
    console.log('Pricing result:', pricingResult);
    
    if (!pricingResult.success) {
      throw new Error(pricingResult.error || 'Failed to fetch pricing');
    }

    // Match pricing with number type
    const normalizedSearchType = type.toLowerCase().trim();
    const selectedPrice = pricingResult.data?.prices.find(p => {
      console.log('Comparing price types:', { 
        priceType: p.numberType, 
        searchType: normalizedSearchType 
      });
      
      const isExactMatch = p.numberType.toLowerCase() === normalizedSearchType;
      const isTollFreeMatch = (normalizedSearchType === 'tollfree' && p.numberType.toLowerCase() === 'toll free') ||
                           (normalizedSearchType === 'toll free' && p.numberType.toLowerCase() === 'tollfree');
      const isLocalMatch = p.numberType.toLowerCase() === 'local' && normalizedSearchType === 'local';
      
      return isExactMatch || isTollFreeMatch || isLocalMatch;
    });

    console.log('Selected price:', selectedPrice);

    // Format the response with actual pricing info
    const numbersWithPricing = result.data.map(number => ({
      ...number,
      type: type as 'local' | 'tollfree' | 'mobile',
      price: {
        amount: parseFloat(selectedPrice?.currentPrice || '0'),
        currency: pricingResult.data?.priceUnit || 'USD'
      },
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