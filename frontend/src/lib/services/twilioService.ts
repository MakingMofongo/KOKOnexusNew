import twilio from 'twilio';

export class TwilioService {
  private client: twilio.Twilio;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials not configured');
    }

    this.client = twilio(accountSid, authToken);
  }

  async listAvailableNumbers(country: string, type: string, limit: number) {
    try {
      const phoneNumberList = type === 'tollfree'
        ? await this.client.availablePhoneNumbers(country).tollFree.list({ limit })
        : await this.client.availablePhoneNumbers(country).local.list({ limit });

      return {
        success: true,
        data: phoneNumberList.map(number => ({
          phoneNumber: number.phoneNumber,
          friendlyName: number.friendlyName,
          locality: number.locality || '',
          region: number.region || '',
          isoCountry: number.isoCountry,
          capabilities: {
            voice: number.capabilities.voice || false,
            SMS: number.capabilities.sms || false,
            MMS: number.capabilities.mms || false,
          }
        }))
      };
    } catch (error) {
      console.error('Error fetching numbers:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch numbers'
      };
    }
  }
}

// Create singleton instance
export const twilioService = new TwilioService(); 