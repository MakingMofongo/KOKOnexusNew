import { VapiClient } from "@vapi-ai/server-sdk";

export async function createCallAssistant(token: string) {
  const client = new VapiClient({ token });

  const assistant = await client.assistants.create({
    // Basic assistant configuration
    name: "Customer Service Assistant",
    firstMessage: "Hello! I'm your virtual assistant. How can I help you today?",
    
    // Voice and transcription settings
    voice: {
      provider: "11labs",
      voiceId: "marsh",
      model: "eleven_turbo_v2_5",
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
    
    transcriber: {
      provider: "deepgram",
      codeSwitchingEnabled: false,
      endpointing: 10,
      model: "nova-2-phonecall",
      language: "en",
      smartFormat: false,
      keywords: ["vapi", "assistant"]
    },

    // Updated model configuration
    model: {
      provider: "vapi",
      model: "gpt-4",
      temperature: 0.7,
      maxTokens: 150,
      emotionRecognitionEnabled: true,
      messages: [
        {
          role: "assistant",
          content: "You are a helpful customer service assistant. Be concise, professional, and friendly."
        }
      ]
    },

    // Call behavior settings
    silenceTimeoutSeconds: 20,
    maxDurationSeconds: 600, // 10 minute max call duration
    backgroundSound: "office",
    backchannelingEnabled: true,
    
    // End call configuration
    endCallMessage: "Thank you for calling. Have a great day!",
    endCallPhrases: ["goodbye", "thank you for your time"],

    // Voicemail handling
    voicemailDetection: {
      enabled: true,
      provider: "twilio"
    },
    voicemailMessage: "Please leave a message and we'll get back to you as soon as possible.",

    // Analysis and monitoring
    analysisPlan: {
      summaryPlan: {
        enabled: true,
        timeoutSeconds: 30
      },
      successEvaluationPlan: {
        enabled: true,
        rubric: "NumericScale"
      }
    },

    // Real-time monitoring
    monitorPlan: {
      listenEnabled: true,
      controlEnabled: true
    }
  });

  return assistant;
} 