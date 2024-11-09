import { VapiClient } from "@vapi-ai/server-sdk";
import {
  PhoneNumber,
  PhoneNumberResponse,
  PhoneNumberListResponse,
  ListPhoneNumbersOptions,
  CreatePhoneNumberConfig,
  DeletePhoneNumberResponse,
  UpdatePhoneNumberDto,
  UpdatePhoneNumberResponse
} from "../types/phoneNumber";

export class PhoneNumberService {
  private client: VapiClient;

  constructor(token: string) {
    this.client = new VapiClient({ token });
  }

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

  async createPhoneNumber(config: CreatePhoneNumberConfig): Promise<PhoneNumberResponse> {
    try {
      const phoneNumber = await this.client.phoneNumbers.create(config);
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
} 