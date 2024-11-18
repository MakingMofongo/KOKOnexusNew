# Backend Integration Guide

## Serverless Integration

### Phone Number Handlers
The backend provides serverless handlers for phone number operations:

```typescript
// backend/src/serverless/handlers/phoneNumber.ts
export async function handleListPhoneNumbers(req: Request)
export async function handleCreatePhoneNumber(req: Request)
export async function handleSearchPhoneNumbers(req: Request)
export async function handleGetPhoneNumberPricing(req: Request)
```

### Frontend API Routes
Import and use the handlers in your Next.js API routes:

```typescript
// frontend/src/app/api/phone-numbers/list/route.ts
import { handleListPhoneNumbers } from '@backend/serverless/handlers/phoneNumber';
export const GET = handleListPhoneNumbers;

// frontend/src/app/api/phone-numbers/search/route.ts
import { handleSearchPhoneNumbers } from '@backend/serverless/handlers/phoneNumber';
export const GET = handleSearchPhoneNumbers;
```

### Phone Number Types
```typescript
interface PhoneNumber {
  id: string;
  orgId: string;
  name?: string;
  sipUri?: string;
  number?: string;  // Added for Twilio numbers
  provider: string;
  assistantId?: string;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
  twilioAccountSid?: string;
  twilioAuthToken?: string;
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