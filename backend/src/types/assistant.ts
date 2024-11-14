
import { Vapi } from '@vapi-ai/server-sdk';
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

// Add after the VoiceConfig type
export type TranscriberProvider = 'custom-transcriber' | 'deepgram' | 'gladia' | 'talkscriber';

export interface BaseTranscriberConfig {
  provider: TranscriberProvider;
}

export interface CustomTranscriberConfig extends BaseTranscriberConfig {
  provider: 'custom-transcriber';
  server: {
    url: string;
    timeoutSeconds?: number;
    secret?: string;
    headers?: Record<string, any>;
  };
}

export interface DeepgramTranscriberConfig extends BaseTranscriberConfig {
  provider: 'deepgram';
  codeSwitchingEnabled?: boolean;
  endpointing?: number;
  keywords?: string[];
  language?: string;
  model?: string;
  smartFormat?: boolean;
}

export enum GladiaLanguage {
  AF = 'af', // Afrikaans
  SQ = 'sq', // Albanian
  AM = 'am', // Amharic
  AR = 'ar', // Arabic
  HY = 'hy', // Armenian
  AS = 'as', // Assamese
  AZ = 'az', // Azerbaijani
  BA = 'ba', // Bashkir
  EU = 'eu', // Basque
  BE = 'be', // Belarusian
  BN = 'bn', // Bengali
  BS = 'bs', // Bosnian
  BR = 'br', // Breton
  BG = 'bg', // Bulgarian
  CA = 'ca', // Catalan
  ZH = 'zh', // Chinese
  HR = 'hr', // Croatian
  CS = 'cs', // Czech
  DA = 'da', // Danish
  NL = 'nl', // Dutch
  EN = 'en', // English
  ET = 'et', // Estonian
  FO = 'fo', // Faroese
  FI = 'fi', // Finnish
  FR = 'fr', // French
  GL = 'gl', // Galician
  KA = 'ka', // Georgian
  DE = 'de', // German
  EL = 'el', // Greek
  GU = 'gu', // Gujarati
  HT = 'ht', // Haitian
  HA = 'ha', // Hausa
  HE = 'he', // Hebrew
  HI = 'hi', // Hindi
  HU = 'hu', // Hungarian
  IS = 'is', // Icelandic
  ID = 'id', // Indonesian
  IT = 'it', // Italian
  JA = 'ja', // Japanese
  JV = 'jv', // Javanese
  KN = 'kn', // Kannada
  KK = 'kk', // Kazakh
  KM = 'km', // Khmer
  KO = 'ko', // Korean
  LO = 'lo', // Lao
  LA = 'la', // Latin
  LV = 'lv', // Latvian
  LT = 'lt', // Lithuanian
  MK = 'mk', // Macedonian
  MS = 'ms', // Malay
  ML = 'ml', // Malayalam
  MT = 'mt', // Maltese
  MR = 'mr', // Marathi
  MN = 'mn', // Mongolian
  NE = 'ne', // Nepali
  NO = 'no', // Norwegian
  FA = 'fa', // Persian
  PL = 'pl', // Polish
  PT = 'pt', // Portuguese
  PA = 'pa', // Punjabi
  RO = 'ro', // Romanian
  RU = 'ru', // Russian
  SR = 'sr', // Serbian
  SK = 'sk', // Slovak
  SL = 'sl', // Slovenian
  ES = 'es', // Spanish
  SW = 'sw', // Swahili
  SV = 'sv', // Swedish
  TA = 'ta', // Tamil
  TE = 'te', // Telugu
  TH = 'th', // Thai
  TR = 'tr', // Turkish
  UK = 'uk', // Ukrainian
  UR = 'ur', // Urdu
  VI = 'vi', // Vietnamese
  CY = 'cy', // Welsh
}

export type GladiaLanguageBehaviour = 'manual' | 'automatic single language' | 'automatic multiple languages';
export type GladiaModel = 'fast' | 'accurate';

export interface GladiaTranscriberConfig {
  provider: 'gladia';
  audioEnhancer?: boolean;
  language?: GladiaLanguage;
  languageBehaviour?: GladiaLanguageBehaviour;
  model?: GladiaModel;
  prosody?: boolean;
  transcriptionHint?: string;
}

export interface TalkScriberConfig extends BaseTranscriberConfig {
  provider: 'talkscriber';
  language?: string;
  model?: 'whisper';
}

export type TranscriberConfig = 
  | CustomTranscriberConfig 
  | DeepgramTranscriberConfig 
  | GladiaTranscriberConfig 
  | TalkScriberConfig;

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
export interface UpdateAssistantDto extends Omit<Vapi.UpdateAssistantDto, 'transcriber'> {
  transcriber?: TranscriberConfig;
}

export type UpdateAssistantPayload = UpdateAssistantDto; 