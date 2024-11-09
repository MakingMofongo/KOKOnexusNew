// Remove SDK imports and define our own types
export type MessageRole = 'system' | 'assistant' | 'user' | 'function';

export interface Message {
  role: MessageRole;
  content: string;
}

// Voice provider types
export type VoiceProvider = 'rime-ai' | 'azure' | 'deepgram' | 'eleven-labs' | 'lmnt' | 'neets' | 'playht';

interface BaseVoice {
  voiceId: string;
  speed?: number;
  chunkPlan?: {
    enabled: boolean;
    minCharacters: number;
  };
}

export interface RimeAiVoice extends BaseVoice {
  provider: 'rime-ai';
}

// Add other voice types as needed...

export type VoiceConfig = RimeAiVoice; // Union with other voice types when added

// Types for assistant-related data
export interface Assistant {
  id: string;
  orgId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  // ... other assistant properties
}

export interface ListAssistantsOptions {
  limit?: number;
  createdAtGt?: string;
  createdAtLt?: string;
  createdAtGe?: string;
  createdAtLe?: string;
  updatedAtGt?: string;
  updatedAtLt?: string;
  updatedAtGe?: string;
  updatedAtLe?: string;
}

export interface AssistantResponse {
  success: boolean;
  data?: Assistant;
  error?: string;
}

export interface AssistantListResponse {
  success: boolean;
  data?: Assistant[];
  error?: string;
}

export interface DeleteAssistantResponse {
  success: boolean;
  data?: Assistant;
  error?: string;
}

export interface UpdateAssistantResponse {
  success: boolean;
  data?: Assistant;
  error?: string;
}

// Update the DTO to match SDK expectations
export interface UpdateAssistantDto {
  name?: string;
  firstMessage?: string;
  model?: {
    provider: 'vapi';
    model: string;
    temperature?: number;
    maxTokens?: number;
    emotionRecognitionEnabled?: boolean;
    messages?: Message[];
  };
  voice?: VoiceConfig;
}

export type UpdateAssistantPayload = UpdateAssistantDto; 