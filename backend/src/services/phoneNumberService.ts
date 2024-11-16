import { VapiClient } from "@vapi-ai/server-sdk";
import {
  PhoneNumber,
  PhoneNumberResponse,
  PhoneNumberListResponse,
  ListPhoneNumbersOptions,
  TwilioPhoneNumberConfig,
  DeletePhoneNumberResponse,
  UpdatePhoneNumberDto,
  UpdatePhoneNumberResponse
} from "../types/phoneNumber";
import twilio from 'twilio';

export class PhoneNumberService {
  private client: VapiClient;
  private twilioClient: twilio.Twilio | null = null;

  constructor(token: string) {
    this.client = new VapiClient({ token });
  }

  private getTwilioClient() {
    if (!this.twilioClient) {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      
      if (!accountSid || !authToken) {
        throw new Error('Twilio credentials not configured');
      }
      
      this.twilioClient = twilio(accountSid, authToken);
    }
    return this.twilioClient;
  }

  async listAvailableNumbers(options: {
    country: string;
    type: 'local' | 'tollfree' | 'mobile';
    areaCode?: string;
    contains?: string;
    limit?: number;
  }) {
    try {
      const twilioClient = this.getTwilioClient();
      const { country, type, areaCode, contains, limit = 20 } = options;

      const searchParams: any = {
        limit,
        ...(areaCode && { areaCode }),
        ...(contains && { contains })
      };

      let numbers;
      switch (type) {
        case 'local':
          numbers = await twilioClient.availablePhoneNumbers(country)
            .local.list(searchParams);
          break;
        case 'tollfree':
          numbers = await twilioClient.availablePhoneNumbers(country)
            .tollFree.list(searchParams);
          break;
        case 'mobile':
          numbers = await twilioClient.availablePhoneNumbers(country)
            .mobile.list(searchParams);
          break;
        default:
          throw new Error('Invalid number type');
      }

      return {
        success: true,
        data: numbers.map(num => ({
          phoneNumber: num.phoneNumber,
          friendlyName: num.friendlyName,
          locality: num.locality,
          region: num.region,
          isoCountry: num.isoCountry,
          capabilities: num.capabilities
        }))
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch available numbers'
      };
    }
  }


  //List all phone numbers associated with the VAPI account
  async listPhoneNumbers(options?: ListPhoneNumbersOptions): Promise<PhoneNumberListResponse> {
    try {
      const phoneNumbers = await this.client.phoneNumbers.list(options);
      return {
        success: true,
        data: phoneNumbers as PhoneNumber[]
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getPhoneNumber(id: string): Promise<PhoneNumberResponse> {
    try {
      const phoneNumber = await this.client.phoneNumbers.get(id);
      return {
        success: true,
        data: phoneNumber as PhoneNumber
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async createPhoneNumber(config: TwilioPhoneNumberConfig): Promise<PhoneNumberResponse> {
    try {
      const twilioClient = this.getTwilioClient();
      
      // First purchase the number through Twilio
      const purchasedNumber = await twilioClient.incomingPhoneNumbers.create({
        phoneNumber: config.number,
        friendlyName: config.name || undefined
      });

      // Then create the phone number in Vapi with the correct properties
      const phoneNumber = await this.client.phoneNumbers.create({
        provider: 'twilio',
        number: purchasedNumber.phoneNumber,
        twilioAccountSid: config.twilioAccountSid,
        twilioAuthToken: config.twilioAuthToken,
        assistantId: config.assistantId,
        name: config.name,
        serverUrl: config.serverUrl,
        serverUrlSecret: config.serverUrlSecret,
        squadId: config.squadId,
        fallbackDestination: config.fallbackDestination
      });

      return {
        success: true,
        data: phoneNumber as PhoneNumber
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to purchase number'
      };
    }
  }

  async deletePhoneNumber(id: string): Promise<DeletePhoneNumberResponse> {
    try {
      const phoneNumber = await this.client.phoneNumbers.delete(id);
      return {
        success: true,
        data: phoneNumber as PhoneNumber
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async updatePhoneNumber(id: string, updates: UpdatePhoneNumberDto): Promise<UpdatePhoneNumberResponse> {
    try {
      const phoneNumber = await this.client.phoneNumbers.update(id, updates);
      return {
        success: true,
        data: phoneNumber as PhoneNumber
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getPhoneNumberPricing(country: string): Promise<{
    success: boolean;
    data?: {
      priceUnit: string;
      prices: Array<{
        numberType: string;
        basePrice: string;
        currentPrice: string;
      }>;
    };
    error?: string;
  }> {
    try {
      const twilioClient = this.getTwilioClient();
      const pricing = await twilioClient.pricing.v1.phoneNumbers
        .countries(country)
        .fetch();

      if (!pricing.phoneNumberPrices) {
        throw new Error('No pricing information available');
      }

      // Handle the raw response data directly
      const rawPrices = pricing.phoneNumberPrices as Array<{
        number_type: string;
        base_price: string;
        current_price: string;
      }>;

      // Transform the raw data to our format
      const prices = rawPrices.map(price => ({
        numberType: price.number_type,
        basePrice: price.base_price,
        currentPrice: price.current_price
      }));

      return {
        success: true,
        data: {
          priceUnit: pricing.priceUnit || 'USD',
          prices
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch pricing'
      };
    }
  }
} 