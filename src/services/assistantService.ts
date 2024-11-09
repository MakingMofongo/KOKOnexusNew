import { VapiClient } from "@vapi-ai/server-sdk";
import { 
  Assistant, 
  AssistantResponse, 
  AssistantListResponse,
  ListAssistantsOptions,
  DeleteAssistantResponse,
  UpdateAssistantResponse,
  UpdateAssistantPayload
} from "../types/assistant";

export class AssistantService {
  private client: VapiClient;

  constructor(token: string) {
    this.client = new VapiClient({ token });
  }

  async createAssistant(config: any): Promise<AssistantResponse> {
    try {
      const assistant = await this.client.assistants.create(config);
      return {
        success: true,
        data: assistant as Assistant
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getAssistant(id: string): Promise<AssistantResponse> {
    try {
      const assistant = await this.client.assistants.get(id);
      return {
        success: true,
        data: assistant as Assistant
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async listAssistants(options?: ListAssistantsOptions): Promise<AssistantListResponse> {
    try {
      const assistants = await this.client.assistants.list(options);
      return {
        success: true,
        data: assistants as Assistant[]
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async deleteAssistant(id: string): Promise<DeleteAssistantResponse> {
    try {
      const deletedAssistant = await this.client.assistants.delete(id);
      return {
        success: true,
        data: deletedAssistant as Assistant
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async updateAssistant(id: string, updates: UpdateAssistantPayload): Promise<UpdateAssistantResponse> {
    try {
      const updatedAssistant = await this.client.assistants.update(id, updates);
      return {
        success: true,
        data: updatedAssistant as Assistant
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
} 