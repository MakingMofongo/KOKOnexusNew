import { VapiClient } from "@vapi-ai/server-sdk";
import { ReadStream } from 'fs';
import {
  File,
  FileResponse,
  FileListResponse,
  ListFilesOptions,
  FileUploadResponse,
  FileUploadOptions,
  DeleteFileResponse,
  UpdateFileDto,
  UpdateFileResponse
} from "../types/file";

// Define our own RequestOptions type
interface RequestOptions {
  [key: string]: any;
}

export class FileService {
  private client: VapiClient;

  constructor(token: string) {
    this.client = new VapiClient({ token });
  }

  async listFiles(options?: ListFilesOptions): Promise<FileListResponse> {
    try {
      // Convert our options to a generic object
      const requestOptions: RequestOptions = options || {};
      
      const files = await this.client.files.list(requestOptions);
      return {
        success: true,
        data: files as File[]
      };
    } catch (error) {
      // Enhanced error handling
      if (error instanceof Error) {
        // Check for server down error
        if (error.message.includes('521')) {
          return {
            success: false,
            error: 'Vapi API server is currently unavailable. Please try again later.'
          };
        }
        return {
          success: false,
          error: error.message
        };
      }
      return {
        success: false,
        error: 'Unknown error occurred'
      };
    }
  }

  async getFile(id: string): Promise<FileResponse> {
    try {
      const file = await this.client.files.get(id);
      return {
        success: true,
        data: file as File
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('521')) {
          return {
            success: false,
            error: 'Vapi API server is currently unavailable. Please try again later.'
          };
        }
        return {
          success: false,
          error: error.message
        };
      }
      return {
        success: false,
        error: 'Unknown error occurred'
      };
    }
  }

  async uploadFile(
    fileStream: ReadStream,
    options?: FileUploadOptions
  ): Promise<FileUploadResponse> {
    try {
      // Convert our options to a generic object
      const requestOptions: RequestOptions = options || {};
      
      const file = await this.client.files.create(fileStream, requestOptions);
      return {
        success: true,
        data: file as File
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('521')) {
          return {
            success: false,
            error: 'Vapi API server is currently unavailable. Please try again later.'
          };
        }
        return {
          success: false,
          error: error.message
        };
      }
      return {
        success: false,
        error: 'Unknown error occurred'
      };
    }
  }

  async deleteFile(id: string): Promise<DeleteFileResponse> {
    try {
      const file = await this.client.files.delete(id);
      return {
        success: true,
        data: file as File
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('521')) {
          return {
            success: false,
            error: 'Vapi API server is currently unavailable. Please try again later.'
          };
        }
        return {
          success: false,
          error: error.message
        };
      }
      return {
        success: false,
        error: 'Unknown error occurred'
      };
    }
  }

  async updateFile(id: string, updates: UpdateFileDto): Promise<UpdateFileResponse> {
    try {
      const file = await this.client.files.update(id, updates);
      return {
        success: true,
        data: file as File
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('521')) {
          return {
            success: false,
            error: 'Vapi API server is currently unavailable. Please try again later.'
          };
        }
        return {
          success: false,
          error: error.message
        };
      }
      return {
        success: false,
        error: 'Unknown error occurred'
      };
    }
  }
} 