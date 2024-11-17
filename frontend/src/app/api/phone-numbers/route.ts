import { PhoneNumberService } from '@backend/services/phoneNumberService'

// Get token from environment variables
const VAPI_TOKEN = process.env.VAPI_TOKEN
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN

if (!VAPI_TOKEN) {
  throw new Error('VAPI_TOKEN is required in environment variables')
}

const phoneNumberService = new PhoneNumberService(VAPI_TOKEN)

export async function POST(req: Request) {
  try {
    const { country, type, areaCode } = await req.json()
    
    console.log('Fetching numbers with params:', { country, type, areaCode })
    
    // First get available numbers using the service's listAvailableNumbers method
    const numbersResult = await phoneNumberService.listAvailableNumbers({
      country,
      type,
      areaCode,
      limit: 20
    })

    console.log('Numbers result:', numbersResult)

    if (!numbersResult.success) {
      console.error('Failed to fetch numbers:', numbersResult.error)
      throw new Error(numbersResult.error)
    }

    // Get pricing using the service's getPhoneNumberPricing method
    const pricingResult = await phoneNumberService.getPhoneNumberPricing(country)

    console.log('Pricing result:', pricingResult)

    if (!pricingResult.success) {
      console.error('Failed to fetch pricing:', pricingResult.error)
      throw new Error(pricingResult.error)
    }

    return new Response(JSON.stringify({
      success: true,
      numbers: numbersResult.data,
      pricing: pricingResult.data
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Phone number API error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch numbers'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function PUT(req: Request) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    throw new Error('Twilio credentials are required in environment variables')
  }

  try {
    const { number, assistantId } = await req.json()
    
    console.log('Purchasing number:', { number, assistantId })

    // Purchase the number using the service's createPhoneNumber method
    const result = await phoneNumberService.createPhoneNumber({
      provider: 'twilio',
      number,
      twilioAccountSid: TWILIO_ACCOUNT_SID,
      twilioAuthToken: TWILIO_AUTH_TOKEN,
      assistantId,
      name: `KOKO AI Number - ${number}`
    })

    console.log('Purchase result:', result)

    if (!result.success) {
      console.error('Failed to purchase number:', result.error)
      throw new Error(result.error)
    }

    return new Response(JSON.stringify({
      success: true,
      data: result.data
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Phone number purchase error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to purchase number'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 