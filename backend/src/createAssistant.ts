import { VapiClient } from "@vapi-ai/server-sdk";

export async function createCallAssistant(token: string, systemMessage?: string) {
  const client = new VapiClient({ token });

  const assistant = await client.assistants.create({
    name: "Customer Service Assistant",
    firstMessage: "Hello! I'm your virtual assistant. How can I help you today?",
    
    model: {
      provider: "vapi",
      model: "gpt-4",
      temperature: 0.7,
      maxTokens: 150,
      emotionRecognitionEnabled: true,
      messages: [
        {
          role: "system",
          content: systemMessage || "You are a helpful customer service assistant. Be concise, professional, and friendly."
        }
      ]
    },
    
    voice: {
      provider: "11labs",
      voiceId: "marsh",
      model: "eleven_turbo_v2_5",
      stability: 0.5,
      similarityBoost: 0.75
    },
    
    transcriber: {
      provider: "deepgram",
      language: "en",
      endpointing: 10,
      model: "nova-2-phonecall",
      smartFormat: false,
      keywords: ["vapi", "assistant"]
    },

    silenceTimeoutSeconds: 20,
    maxDurationSeconds: 600,
    backgroundSound: "office",
    backchannelingEnabled: true
  });

  return assistant;
} 