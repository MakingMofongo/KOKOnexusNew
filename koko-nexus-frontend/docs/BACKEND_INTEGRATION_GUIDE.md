# Backend Integration Guide

## Backend Location & Structure
The backend is located at `../../VapiAssistant` relative to the frontend root. It provides a wrapper around the Vapi.ai API with business-focused abstractions.

## Core Services

### Assistant Service
Located at `../../VapiAssistant/src/services/assistantService.ts`

```typescript
interface AssistantService {
  createAssistant(config: AssistantConfig): Promise<AssistantResponse>
  getAssistant(id: string): Promise<AssistantResponse>
  listAssistants(options?: ListAssistantsOptions): Promise<AssistantListResponse>
  updateAssistant(id: string, updates: UpdateAssistantPayload): Promise<UpdateAssistantResponse>
  deleteAssistant(id: string): Promise<DeleteAssistantResponse>
}
```

### Phone Number Service
Located at `../../VapiAssistant/src/services/phoneNumberService.ts`

```typescript
interface PhoneNumberService {
  listPhoneNumbers(options?: ListPhoneNumbersOptions): Promise<PhoneNumberListResponse>
  getPhoneNumber(id: string): Promise<PhoneNumberResponse>
  createPhoneNumber(config: CreatePhoneNumberConfig): Promise<PhoneNumberResponse>
  deletePhoneNumber(id: string): Promise<DeletePhoneNumberResponse>
  updatePhoneNumber(id: string, updates: UpdatePhoneNumberDto): Promise<UpdatePhoneNumberResponse>
}
```

### Business Deployment Service
Located at `../../VapiAssistant/src/services/businessDeploymentService.ts`

```typescript
interface BusinessDeploymentService {
  deployBusinessAssistant(config: BusinessConfig): Promise<DeploymentResult>
  analyzeDeployment(deploymentId: string): Promise<DeploymentAnalysis>
}
```

## Type Definitions

### Assistant Types
Located at `../../VapiAssistant/src/types/assistant.ts`

```typescript
interface Assistant {
  id: string;
  orgId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  // ... other properties
}

interface AssistantConfig {
  name: string;
  firstMessage?: string;
  model: {
    provider: 'vapi';
    model: string;
    temperature?: number;
    maxTokens?: number;
    emotionRecognitionEnabled?: boolean;
    messages?: Message[];
  };
  voice?: VoiceConfig;
}
```

### Phone Number Types
Located at `../../VapiAssistant/src/types/phoneNumber.ts`

```typescript
interface PhoneNumber {
  id: string;
  orgId: string;
  provider: string;
  // ... other properties
}

type CreatePhoneNumberConfig = 
  | ByoPhoneNumberConfig 
  | TwilioPhoneNumberConfig 
  | VonagePhoneNumberConfig 
  | VapiPhoneNumberConfig;
```

### Business Types
Located at `../../VapiAssistant/src/types/business.ts`

```typescript
interface BusinessConfig {
  businessName: string;
  industry: 'retail' | 'healthcare' | 'hospitality' | 'technology';
  size: 'small' | 'medium' | 'enterprise';
  region: string;
  expectedCallVolume: number;
  businessHours: BusinessHours;
  languages: string[];
  tone: 'professional' | 'friendly' | 'casual';
}
```

## Integration Steps

### 1. API Layer Setup
Create an API layer in the frontend:

```typescript
// src/lib/api/index.ts
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

// src/lib/api/assistant.ts
import { API_BASE } from './index';
import type { AssistantConfig, AssistantResponse } from '@/types/assistant';

export const assistantApi = {
  create: async (config: AssistantConfig): Promise<AssistantResponse> => {
    const res = await fetch(`${API_BASE}/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    return res.json();
  },
  // ... other methods
};
```

### 2. State Management
Use Zustand for deployment state:

```typescript
// src/lib/store/deployment.ts
import { create } from 'zustand';
import type { BusinessConfig, DeploymentResult } from '@/types/business';

interface DeploymentStore {
  config: Partial<BusinessConfig>;
  status: 'idle' | 'deploying' | 'success' | 'error';
  result: DeploymentResult | null;
  setConfig: (config: Partial<BusinessConfig>) => void;
  deploy: () => Promise<void>;
}

export const useDeploymentStore = create<DeploymentStore>((set, get) => ({
  config: {},
  status: 'idle',
  result: null,
  setConfig: (config) => set((state) => ({
    config: { ...state.config, ...config }
  })),
  deploy: async () => {
    set({ status: 'deploying' });
    try {
      // Implementation
    } catch (error) {
      set({ status: 'error' });
    }
  }
}));
```

### 3. Error Handling
The backend uses a standard response pattern:

```typescript
interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

Frontend error handling should match this pattern:

```typescript
// src/lib/utils/error.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
  }
}

export const handleApiError = (error: unknown) => {
  if (error instanceof ApiError) {
    // Handle specific error types
  }
  return new ApiError('An unexpected error occurred');
};
```

### 4. Real-time Updates
The backend provides several event types for real-time updates:

```typescript
type DeploymentEvent = 
  | 'deployment.started'
  | 'deployment.progress'
  | 'deployment.completed'
  | 'deployment.failed';

interface DeploymentUpdate {
  type: DeploymentEvent;
  data: any;
  timestamp: string;
}
```

## Environment Setup
Required environment variables:

```env
NEXT_PUBLIC_API_BASE=http://localhost:3001
NEXT_PUBLIC_VAPI_TOKEN=your_vapi_token
```

## Deployment Flow
1. User configures deployment through UI
2. Frontend validates configuration
3. Backend creates assistant using Vapi API
4. Backend configures phone number
5. Backend sets up analytics
6. Frontend receives deployment result
7. Frontend shows success/error state

## Error States
Common error scenarios to handle:
- Invalid configuration
- Network errors
- Rate limiting
- Resource creation failures
- Timeout errors

## Loading States
Implement loading states for:
- Initial configuration validation
- Assistant creation
- Phone number setup
- Analytics configuration
- Overall deployment progress

## Success States
Track and display:
- Deployment completion
- Resource IDs
- Configuration details
- Next steps
- Quick start guide 