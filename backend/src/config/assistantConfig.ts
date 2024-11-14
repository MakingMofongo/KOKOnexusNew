// Default configuration for creating assistants
export const defaultAssistantConfig = {
  name: "Customer Service Assistant",
  firstMessage: "Hello! I'm your virtual assistant. How can I help you today?",
  voice: {
    provider: "rime-ai",
    voiceId: "marsh",
    speed: 1.0,
    chunkPlan: {
      enabled: true,
      minCharacters: 30,
      formatPlan: {
        enabled: true,
        numberToDigitsCutoff: 2025
      }
    }
  },
  // ... rest of your existing configuration
} as const; 