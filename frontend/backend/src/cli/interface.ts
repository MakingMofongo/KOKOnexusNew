import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';
import ora from 'ora';
import { AssistantService } from '../services/assistantService';
import { PhoneNumberService } from '../services/phoneNumberService';
import { VAPI_TOKEN } from '../config';
import { defaultByoConfig, defaultTwilioConfig, defaultVonageConfig, defaultVapiConfig } from '../config/phoneNumberConfig';
import { BusinessDeploymentService } from '../services/businessDeploymentService';
import { UpdatePhoneNumberDto, TwilioPhoneNumberConfig } from '../types/phoneNumber';
import { FileService } from '../services/fileService';
import * as fs from 'fs';
import * as path from 'path';
import { File } from '../types/file';
import { TranscriberConfig, DeepgramTranscriberConfig, GladiaTranscriberConfig, GladiaLanguage, GladiaLanguageBehaviour } from '../types/assistant';
import twilio from 'twilio';
import { VapiVoiceProvider, VapiVoiceConfig } from '../types/assistant';

const assistantService = new AssistantService(VAPI_TOKEN);
const phoneNumberService = new PhoneNumberService(VAPI_TOKEN);

export async function showWelcomeMessage() {
  console.clear();
  console.log(
    chalk.cyan(
      figlet.textSync('Vapi Assistant', { horizontalLayout: 'full' })
    )
  );
  console.log(chalk.yellow('Welcome to the Vapi Assistant Manager\n'));
}

const mainMenuChoices = {
  ASSISTANTS: 'Manage Assistants',
  PHONE_NUMBERS: 'Manage Phone Numbers',
  FILES: 'Manage Files',
  TEST_FEATURES: 'Test Business Features',
  EXIT: 'Exit'
} as const;

const assistantMenuChoices = {
  LIST: 'List Assistants',
  CREATE: 'Create Assistant',
  GET: 'Get Assistant Details',
  UPDATE: 'Update Assistant',
  DELETE: 'Delete Assistant',
  BACK: 'Back to Main Menu'
} as const;

const phoneNumberMenuChoices = {
  LIST: 'List Phone Numbers',
  PURCHASE: 'Purchase Phone Number',
  GET: 'Get Phone Number Details',
  UPDATE: 'Update Phone Number',
  DELETE: 'Delete Phone Number',
  BACK: 'Back to Main Menu'
} as const;

const testMenuChoices = {
  DEPLOY_RETAIL: 'Test Retail Assistant Deployment',
  DEPLOY_HEALTHCARE: 'Test Healthcare Assistant Deployment',
  DEPLOY_HOSPITALITY: 'Test Hospitality Assistant Deployment',
  ANALYZE_DEPLOYMENT: 'Analyze Existing Deployment',
  BACK: 'Back to Main Menu'
} as const;

const fileMenuChoices = {
  LIST: 'List Files',
  UPLOAD: 'Upload File',
  GET: 'Get File Details',
  UPDATE: 'Update File',
  DELETE: 'Delete File',
  BACK: 'Back to Main Menu'
} as const;

// Helper function to fetch assistants for selection
async function getAssistantChoices() {
  const result = await assistantService.listAssistants({ limit: 100 });
  if (!result.success || !result.data) {
    throw new Error('Failed to fetch assistants');
  }
  return result.data.map(assistant => ({
    name: `${assistant.name} (${assistant.id})`,
    value: assistant.id,
    short: assistant.name
  }));
}

// Helper function to fetch phone numbers for selection
async function getPhoneNumberChoices() {
  const result = await phoneNumberService.listPhoneNumbers({ limit: 100 });
  if (!result.success || !result.data) {
    throw new Error('Failed to fetch phone numbers');
  }
  return result.data.map(number => ({
    name: `${number.name || 'Unnamed'} (${number.id})${number.assistantId ? chalk.gray(` - Linked to assistant: ${number.assistantId}`) : ''}`,
    value: number.id,
    short: number.name || number.id
  }));
}

// Add helper function to chunk array for better display
function chunkArray<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}

// Add Gladia-specific configuration function
async function configureGladiaTranscriber(): Promise<GladiaTranscriberConfig> {
  const languageChoices = Object.entries(GladiaLanguage).map(([key, value]) => ({
    name: `${key} (${value})`,
    value: value
  }));

  // Split language choices into columns for better display
  const columnWidth = 3;
  const languageColumns = chunkArray(languageChoices, Math.ceil(languageChoices.length / columnWidth))
    .map(column => column.map(choice => choice.name).join('  '))
    .join('\n');

  const gladiaConfig = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'audioEnhancer',
      message: 'Enable audio enhancement? (May increase latency)',
      default: false
    },
    {
      type: 'list',
      name: 'languageBehaviour',
      message: 'Select language behavior:',
      choices: [
        { 
          name: 'Manual (You specify the language)', 
          value: 'manual' 
        },
        { 
          name: 'Automatic Single Language (Auto-detect one language)', 
          value: 'automatic single language' 
        },
        { 
          name: 'Automatic Multiple Languages (Auto-detect language switches)', 
          value: 'automatic multiple languages' 
        }
      ]
    },
    {
      type: 'list',
      name: 'language',
      message: 'Select language:\n' + languageColumns,
      choices: languageChoices,
      when: (answers: any) => answers.languageBehaviour === 'manual',
      pageSize: 20
    },
    {
      type: 'list',
      name: 'model',
      message: 'Select transcription model:',
      choices: [
        { 
          name: 'Fast (Lower accuracy, lower latency)', 
          value: 'fast' 
        },
        { 
          name: 'Accurate (Higher accuracy, higher latency)', 
          value: 'accurate' 
        }
      ]
    },
    {
      type: 'confirm',
      name: 'prosody',
      message: 'Enable prosody detection? (laugh, giggles, music, etc.)',
      default: false
    },
    {
      type: 'input',
      name: 'transcriptionHint',
      message: 'Enter transcription hints (custom vocabulary, max 600 chars):',
      validate: (input: string) => {
        if (input.length > 600) {
          return 'Hint must be 600 characters or less';
        }
        return true;
      }
    }
  ] as any);

  // Build the configuration object
  const config: GladiaTranscriberConfig = {
    provider: 'gladia',
    audioEnhancer: gladiaConfig.audioEnhancer,
    languageBehaviour: gladiaConfig.languageBehaviour,
    model: gladiaConfig.model,
    prosody: gladiaConfig.prosody
  };

  // Only add language if languageBehaviour is 'manual'
  if (gladiaConfig.languageBehaviour === 'manual' && gladiaConfig.language) {
    config.language = gladiaConfig.language;
  }

  if (gladiaConfig.transcriptionHint?.trim()) {
    config.transcriptionHint = gladiaConfig.transcriptionHint.trim();
  }

  return config;
}

// Update the configureDeepgramTranscriber function
async function configureDeepgramTranscriber() {
  const { codeSwitchingEnabled } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'codeSwitchingEnabled',
      message: 'Enable automatic language switching?',
      default: false
    }
  ]);

  const deepgramConfig: DeepgramTranscriberConfig = {
    provider: 'deepgram',
    codeSwitchingEnabled,
    endpointing: 10, // Default value
    model: 'nova-2', // Default value
    language: codeSwitchingEnabled ? 'multi' : undefined, // Set to 'multi' if code switching is enabled
    smartFormat: false // Default value
  };

  // Only ask for language if code switching is disabled
  if (!codeSwitchingEnabled) {
    const { language } = await inquirer.prompt([
      {
        type: 'list',
        name: 'language',
        message: 'Select primary language:',
        choices: [
          { name: 'English', value: 'en' },
          { name: 'Spanish', value: 'es' },
          { name: 'French', value: 'fr' },
          { name: 'German', value: 'de' },
          { name: 'Japanese', value: 'ja' },
          { name: 'Korean', value: 'ko' },
          { name: 'Portuguese', value: 'pt' },
          { name: 'Russian', value: 'ru' },
          { name: 'Chinese', value: 'zh' }
        ]
      }
    ]);
    deepgramConfig.language = language;
  }

  // Continue with other Deepgram settings
  const { endpointing, keywords, model, smartFormat } = await inquirer.prompt([
    {
      type: 'number',
      name: 'endpointing',
      message: 'Enter endpointing timeout (10-500ms):',
      default: 10,
      validate: (value) => value >= 10 && value <= 500
    },
    {
      type: 'input',
      name: 'keywords',
      message: 'Enter keywords (comma-separated):',
      filter: (input: string) => input.split(',').map(k => k.trim()).filter(k => k)
    },
    {
      type: 'list',
      name: 'model',
      message: 'Select Deepgram model:',
      choices: [
        { name: 'Nova 2 (General)', value: 'nova-2' },
        { name: 'Nova 2 (Phone Call)', value: 'nova-2-phonecall' },
        { name: 'Nova 2 (Meeting)', value: 'nova-2-meeting' },
        { name: 'Nova 2 (Finance)', value: 'nova-2-finance' },
        { name: 'Nova 2 (Conversational AI)', value: 'nova-2-conversationalai' },
        { name: 'Nova 2 (Medical)', value: 'nova-2-medical' },
        { name: 'Enhanced (General)', value: 'enhanced' },
        { name: 'Enhanced (Phone Call)', value: 'enhanced-phonecall' },
        { name: 'Base (General)', value: 'base' },
        { name: 'Base (Phone Call)', value: 'base-phonecall' }
      ]
    },
    {
      type: 'confirm',
      name: 'smartFormat',
      message: 'Enable smart formatting?',
      default: false
    }
  ]);

  // Update the config with the remaining settings
  deepgramConfig.endpointing = endpointing;
  if (keywords.length > 0) deepgramConfig.keywords = keywords;
  deepgramConfig.model = model;
  deepgramConfig.smartFormat = smartFormat;

  return deepgramConfig;
}

// Add after the existing configureDeepgramTranscriber function
async function configureCustomTranscriber() {
  const customConfig = await inquirer.prompt([
    {
      type: 'input',
      name: 'url',
      message: 'Enter the custom transcriber server URL:',
      validate: (input: string) => {
        if (!input.trim()) {
          return 'Server URL is required';
        }
        try {
          new URL(input);
          return true;
        } catch {
          return 'Please enter a valid URL';
        }
      }
    },
    {
      type: 'number',
      name: 'timeoutSeconds',
      message: 'Enter timeout in seconds (1-60):',
      default: 20,
      validate: (value) => {
        if (value >= 1 && value <= 60) return true;
        return 'Timeout must be between 1 and 60 seconds';
      }
    },
    {
      type: 'input',
      name: 'secret',
      message: 'Enter server secret (optional):',
    },
    {
      type: 'confirm',
      name: 'hasCustomHeaders',
      message: 'Do you want to add custom headers?',
      default: false
    }
  ]);

  let headers = {};
  if (customConfig.hasCustomHeaders) {
    let addingHeaders = true;
    while (addingHeaders) {
      const header = await inquirer.prompt([
        {
          type: 'input',
          name: 'key',
          message: 'Enter header name:',
          validate: (input) => input.trim() !== '' || 'Header name is required'
        },
        {
          type: 'input',
          name: 'value',
          message: 'Enter header value:',
          validate: (input) => input.trim() !== '' || 'Header value is required'
        },
        {
          type: 'confirm',
          name: 'addAnother',
          message: 'Add another header?',
          default: false
        }
      ]);

      headers = {
        ...headers,
        [header.key]: header.value
      };

      if (!header.addAnother) {
        addingHeaders = false;
      }
    }
  }

  return {
    provider: 'custom-transcriber' as const,
    server: {
      url: customConfig.url,
      timeoutSeconds: customConfig.timeoutSeconds,
      ...(customConfig.secret && { secret: customConfig.secret }),
      ...(Object.keys(headers).length > 0 && { headers })
    }
  };
}

// Update the configureCustomGladia function
async function configureCustomGladia() {
  const { languages } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'languages',
      message: 'Select languages for code switching:',
      choices: [
        { name: 'Arabic', value: 'ar' },
        { name: 'English', value: 'en' },
        { name: 'French', value: 'fr' },
        { name: 'Spanish', value: 'es' },
        { name: 'German', value: 'de' },
        { name: 'Italian', value: 'it' },
        { name: 'Portuguese', value: 'pt' },
        { name: 'Hindi', value: 'hi' }
      ],
      validate: (answer) => answer.length > 0 || 'Select at least one language',
      default: ['en']
    }
  ]);

  // Create the configuration object as a header
  const configHeader = JSON.stringify({
    language_config: {
      code_switching: true,
      languages: languages
    },
    encoding: 'wav/pcm',
    bit_depth: 16
  });

  // Return custom transcriber configuration
  return {
    provider: 'custom-transcriber' as const,
    server: {
      url: 'https://api.gladia.io/v2/live',
      timeoutSeconds: 20,
      headers: {
        'x-gladia-key': '0cf94ad0-74e5-4621-a606-10b5712a4e25',
        'Content-Type': 'application/json',
        'x-gladia-config': configHeader // Pass configuration as a header
      }
    }
  };
}

// Update the configureTranscriber function to include the new option
async function configureTranscriber() {
  const { provider } = await inquirer.prompt([
    {
      type: 'list',
      name: 'provider',
      message: 'Select transcriber provider:',
      choices: [
        { name: 'Deepgram', value: 'deepgram' },
        { name: 'Gladia (Standard)', value: 'gladia' },
        { name: 'Gladia (Custom Code Switching)', value: 'gladia-custom' },
        { name: 'Custom Transcriber', value: 'custom-transcriber' },
        { name: 'Talkscriber', value: 'talkscriber' }
      ]
    }
  ]);

  switch (provider) {
    case 'gladia':
      return configureGladiaTranscriber();
    case 'gladia-custom':
      return configureCustomGladia();
    case 'deepgram':
      return configureDeepgramTranscriber();
    case 'custom-transcriber':
      return configureCustomTranscriber();
    case 'talkscriber':
      // ... existing talkscriber configuration
      break;
  }
}

async function handleAssistants() {
  while (true) {
    const { choice } = await inquirer.prompt({
      type: 'list',
      name: 'choice',
      message: 'What would you like to do with assistants?',
      choices: Object.values(assistantMenuChoices),
      pageSize: 10,
      loop: false
    });

    const spinner = ora();

    if (choice === assistantMenuChoices.BACK) {
      break;
    }

    switch (choice) {
      case assistantMenuChoices.LIST: {
        spinner.start('Fetching assistants...');
        const result = await assistantService.listAssistants({ limit: 10 });
        spinner.stop();

        if (result.success && result.data) {
          console.log(chalk.green('\nFound Assistants:'));
          result.data.forEach(assistant => {
            console.log(chalk.cyan(`- ${assistant.name} (${assistant.id})`));
          });
        } else {
          console.log(chalk.red('Error:', result.error));
        }
        break;
      }

      case assistantMenuChoices.GET: {
        spinner.start('Fetching assistants...');
        const choices = await getAssistantChoices();
        spinner.stop();

        if (choices.length === 0) {
          console.log(chalk.yellow('No assistants found. Create one first.'));
          break;
        }

        const { id } = await inquirer.prompt({
          type: 'list',
          name: 'id',
          message: 'Select assistant to view:',
          choices,
          pageSize: 10,
          loop: false
        });

        spinner.start('Fetching assistant details...');
        const result = await assistantService.getAssistant(id);
        spinner.stop();

        if (result.success && result.data) {
          console.log(chalk.green('\nAssistant Details:'));
          console.log(chalk.cyan(JSON.stringify(result.data, null, 2)));
        } else {
          console.log(chalk.red('Error:', result.error));
        }
        break;
      }

      case assistantMenuChoices.CREATE: {
        // Get basic assistant info
        const { name, firstMessage, modelProvider } = await inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: 'Enter assistant name:',
            default: 'New Assistant'
          },
          {
            type: 'input',
            name: 'firstMessage',
            message: 'Enter first message:',
            default: 'Hello! How can I help you today?'
          },
          {
            type: 'list',
            name: 'modelProvider',
            message: 'Select model provider:',
            choices: [
              { name: 'Groq', value: 'groq' },
              { name: 'Vapi (GPT-4)', value: 'vapi' },
              { name: 'OpenAI', value: 'openai' },
              { name: 'Anthropic', value: 'anthropic' },
              { name: 'Google', value: 'google' }
            ]
          }
        ]);

        // Get system message
        const { systemMessage } = await inquirer.prompt({
          type: 'editor',
          name: 'systemMessage',
          message: 'Enter system message (opens in editor):',
          default: `You are a helpful customer service assistant for ${name}.

Key Guidelines:
1. Be professional and courteous
2. Keep responses concise and clear
3. Ask for clarification when needed
4. Know when to escalate to a human agent

Remember to:
- Maintain a helpful tone
- Protect customer privacy
- Follow business policies
- Be accurate and honest`
        });

        // Get model configuration
        const modelConfig = await configureModel(modelProvider);
        modelConfig.messages = [{
          role: 'system',
          content: systemMessage
        }];

        // Then ask for voice provider
        const { voiceProvider } = await inquirer.prompt([
          {
            type: 'list',
            name: 'voiceProvider',
            message: 'Select voice provider:',
            choices: [
              { name: 'Eleven Labs', value: '11labs' },
              { name: 'Azure', value: 'azure' },
              { name: 'OpenAI', value: 'openai' },
              { name: 'PlayHT', value: 'playht' }
            ]
          }
        ]);

        // Get voice configuration
        const voiceConfig = await configureVoice(voiceProvider);

        // Rest of the configuration...
        const transcriber = await configureTranscriber();

        const { silenceTimeout, maxDuration, backgroundSound } = await inquirer.prompt([
          {
            type: 'number',
            name: 'silenceTimeout',
            message: 'Enter silence timeout in seconds (10-600):',
            default: 30,
            validate: (value) => value >= 10 && value <= 600
          },
          {
            type: 'number',
            name: 'maxDuration',
            message: 'Enter maximum call duration in seconds (10-43200):',
            default: 600,
            validate: (value) => value >= 10 && value <= 43200
          },
          {
            type: 'list',
            name: 'backgroundSound',
            message: 'Select background sound:',
            choices: [
              { name: 'Off', value: 'off' },
              { name: 'Office', value: 'office' }
            ]
          }
        ]);

        spinner.start('Creating assistant...');
        const result = await assistantService.createAssistant({
          name,
          firstMessage,
          model: modelConfig,
          voice: voiceConfig,
          transcriber,
          silenceTimeoutSeconds: silenceTimeout,
          maxDurationSeconds: maxDuration,
          backgroundSound,
          hipaaEnabled: false,
          backgroundDenoisingEnabled: false
        });
        spinner.stop();

        if (result.success) {
          console.log(chalk.green('\nAssistant created successfully!'));
          console.log(chalk.cyan('ID:', result.data?.id));
        } else {
          console.log(chalk.red('Error:', result.error));
        }
        break;
      }

      case assistantMenuChoices.UPDATE: {
        spinner.start('Fetching assistants...');
        const choices = await getAssistantChoices();
        spinner.stop();

        if (choices.length === 0) {
          console.log(chalk.yellow('No assistants found. Create one first.'));
          break;
        }

        const { id } = await inquirer.prompt({
          type: 'list',
          name: 'id',
          message: 'Select assistant to update:',
          choices,
          pageSize: 10,
          loop: false
        });

        const { updateType } = await inquirer.prompt({
          type: 'checkbox',
          name: 'updateType',
          message: 'What would you like to update?',
          choices: [
            { name: 'Name', value: 'name' },
            { name: 'First Message', value: 'firstMessage' },
            { name: 'System Message', value: 'systemMessage' },
            { name: 'Transcriber', value: 'transcriber' }
          ]
        });

        const updates: any = {};

        if (updateType.includes('name')) {
          const { name } = await inquirer.prompt({
            type: 'input',
            name: 'name',
            message: 'Enter new name:'
          });
          if (name) updates.name = name;
        }

        if (updateType.includes('firstMessage')) {
          const { firstMessage } = await inquirer.prompt({
            type: 'input',
            name: 'firstMessage',
            message: 'Enter new first message:'
          });
          if (firstMessage) updates.firstMessage = firstMessage;
        }

        if (updateType.includes('systemMessage')) {
          // First get current system message if it exists
          spinner.start('Fetching current assistant details...');
          const currentAssistant = await assistantService.getAssistant(id);
          spinner.stop();

          const currentSystemMessage = currentAssistant.success && 
            currentAssistant.data?.model?.messages?.find(m => m.role === 'system')?.content;

          const { systemMessage } = await inquirer.prompt({
            type: 'editor',
            name: 'systemMessage',
            message: 'Enter new system message (opens in editor):',
            default: currentSystemMessage || 'You are a helpful customer service assistant.'
          });

          if (systemMessage) {
            updates.model = {
              ...(updates.model || {}),
              messages: [{
                role: 'system',
                content: systemMessage
              }]
            };
          }
        }

        if (updateType.includes('transcriber')) {
          updates.transcriber = await configureTranscriber();
        }

        if (Object.keys(updates).length === 0) {
          console.log(chalk.yellow('No updates specified'));
          break;
        }

        spinner.start('Updating assistant...');
        const result = await assistantService.updateAssistant(id, updates);
        spinner.stop();

        if (result.success) {
          console.log(chalk.green('\nAssistant updated successfully!'));
          console.log(chalk.cyan('Updated assistant:', result.data?.id));
        } else {
          console.log(chalk.red('Error:', result.error));
        }
        break;
      }

      case assistantMenuChoices.DELETE: {
        spinner.start('Fetching assistants...');
        const choices = await getAssistantChoices();
        spinner.stop();

        if (choices.length === 0) {
          console.log(chalk.yellow('No assistants found. Create one first.'));
          break;
        }

        const { id, confirm } = await inquirer.prompt([
          {
            type: 'list',
            name: 'id',
            message: 'Select assistant to delete:',
            choices,
            pageSize: 10,
            loop: false
          },
          {
            type: 'confirm',
            name: 'confirm',
            message: (answers) => `Are you sure you want to delete this assistant? (${answers.id})`,
            default: false
          }
        ]);

        if (!confirm) {
          console.log(chalk.yellow('Operation cancelled'));
          break;
        }

        spinner.start('Deleting assistant...');
        const result = await assistantService.deleteAssistant(id);
        spinner.stop();

        if (result.success) {
          console.log(chalk.green('\nAssistant deleted successfully!'));
        } else {
          console.log(chalk.red('Error:', result.error));
        }
        break;
      }
    }
  }
}

async function handlePhoneNumbers() {
  while (true) {
    const { choice } = await inquirer.prompt({
      type: 'list',
      name: 'choice',
      message: 'What would you like to do with phone numbers?',
      choices: Object.values(phoneNumberMenuChoices),
      pageSize: 10,
      loop: false
    });

    const spinner = ora();

    if (choice === phoneNumberMenuChoices.BACK) {
      break;
    }

    switch (choice) {
      case phoneNumberMenuChoices.LIST: {
        spinner.start('Fetching phone numbers...');
        const result = await phoneNumberService.listPhoneNumbers({ limit: 10 });
        spinner.stop();

        if (result.success && result.data) {
          console.log(chalk.green('\nFound Phone Numbers:'));
          result.data.forEach(number => {
            console.log(chalk.cyan(`- ${number.name || 'Unnamed'} (${number.id})`));
            if (number.assistantId) {
              console.log(chalk.gray(`  Assigned to assistant: ${number.assistantId}`));
            }
          });
        } else {
          console.log(chalk.red('Error:', result.error));
        }
        break;
      }

      case phoneNumberMenuChoices.GET: {
        spinner.start('Fetching phone numbers...');
        const choices = await getPhoneNumberChoices();
        spinner.stop();

        if (choices.length === 0) {
          console.log(chalk.yellow('No phone numbers found. Create one first.'));
          break;
        }

        const { id } = await inquirer.prompt({
          type: 'list',
          name: 'id',
          message: 'Select phone number to view:',
          choices,
          pageSize: 10,
          loop: false
        });

        spinner.start('Fetching phone number details...');
        const result = await phoneNumberService.getPhoneNumber(id);
        spinner.stop();

        if (result.success && result.data) {
          console.log(chalk.green('\nPhone Number Details:'));
          console.log(chalk.cyan(JSON.stringify(result.data, null, 2)));
        } else {
          console.log(chalk.red('Error:', result.error));
        }
        break;
      }

      case phoneNumberMenuChoices.PURCHASE: {
        await handlePhoneNumberPurchase();
        break;
      }

      case phoneNumberMenuChoices.DELETE: {
        spinner.start('Fetching phone numbers...');
        const choices = await getPhoneNumberChoices();
        spinner.stop();

        if (choices.length === 0) {
          console.log(chalk.yellow('No phone numbers found. Create one first.'));
          break;
        }

        const { id, confirm } = await inquirer.prompt([
          {
            type: 'list',
            name: 'id',
            message: 'Select phone number to delete:',
            choices,
            pageSize: 10,
            loop: false
          },
          {
            type: 'confirm',
            name: 'confirm',
            message: (answers) => `Are you sure you want to delete this phone number? (${answers.id})`,
            default: false
          }
        ]);

        if (!confirm) {
          console.log(chalk.yellow('Operation cancelled'));
          break;
        }

        spinner.start('Deleting phone number...');
        const result = await phoneNumberService.deletePhoneNumber(id);
        spinner.stop();

        if (result.success) {
          console.log(chalk.green('\nPhone number deleted successfully!'));
        } else {
          console.log(chalk.red('Error:', result.error));
        }
        break;
      }

      case phoneNumberMenuChoices.UPDATE: {
        spinner.start('Fetching phone numbers...');
        const choices = await getPhoneNumberChoices();
        spinner.stop();

        if (choices.length === 0) {
          console.log(chalk.yellow('No phone numbers found. Create one first.'));
          break;
        }

        const { id } = await inquirer.prompt({
          type: 'list',
          name: 'id',
          message: 'Select phone number to update:',
          choices,
          pageSize: 10,
          loop: false
        });

        // Get available assistants for linking
        spinner.start('Fetching available assistants...');
        const assistantChoices = await getAssistantChoices();
        spinner.stop();

        const { name, assistantId, serverUrl } = await inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: 'Enter new name (leave empty to skip):'
          },
          {
            type: 'list',
            name: 'assistantId',
            message: 'Select assistant to link (optional):',
            choices: [
              { name: 'No Change', value: undefined },
              { name: 'None', value: null },
              ...assistantChoices
            ],
            pageSize: 10,
            loop: false
          },
          {
            type: 'input',
            name: 'serverUrl',
            message: 'Enter new server URL (leave empty to skip):'
          }
        ]);

        const updates: UpdatePhoneNumberDto = {};
        if (name) updates.name = name;
        if (assistantId !== undefined) updates.assistantId = assistantId;
        if (serverUrl) updates.serverUrl = serverUrl;

        spinner.start('Updating phone number...');
        const result = await phoneNumberService.updatePhoneNumber(id, updates);
        spinner.stop();

        if (result.success) {
          console.log(chalk.green('\nPhone number updated successfully!'));
          console.log(chalk.cyan('Updated phone number:', result.data?.id));
        } else {
          console.log(chalk.red('Error:', result.error));
        }
        break;
      }
    }
  }
}

async function handleTestFeatures() {
  const businessService = new BusinessDeploymentService(
    assistantService,
    phoneNumberService
  );

  while (true) {
    const { choice } = await inquirer.prompt({
      type: 'list',
      name: 'choice',
      message: 'What would you like to test?',
      choices: Object.values(testMenuChoices),
      pageSize: 10,
      loop: false
    });

    const spinner = ora();

    if (choice === testMenuChoices.BACK) {
      break;
    }

    switch (choice) {
      case testMenuChoices.DEPLOY_RETAIL: {
        const { businessName, callVolume, languages } = await inquirer.prompt([
          {
            type: 'input',
            name: 'businessName',
            message: 'Enter retail business name:',
            default: 'Test Retail Store'
          },
          {
            type: 'list',
            name: 'callVolume',
            message: 'Expected call volume:',
            choices: [
              { name: 'Low (< 100 calls/day)', value: 100 },
              { name: 'Medium (100-1000 calls/day)', value: 500 },
              { name: 'High (> 1000 calls/day)', value: 1500 }
            ],
            pageSize: 10,
            loop: false
          },
          {
            type: 'checkbox',
            name: 'languages',
            message: 'Select supported languages:',
            choices: [
              { name: 'English', value: 'en', checked: true },
              { name: 'Spanish', value: 'es' },
              { name: 'French', value: 'fr' }
            ],
            validate: (answer) => answer.length > 0 || 'Select at least one language',
            pageSize: 10,
            loop: false
          }
        ]);

        spinner.start('Deploying retail assistant...');
        
        try {
          const result = await businessService.deployBusinessAssistant({
            businessName,
            industry: 'retail',
            size: callVolume < 200 ? 'small' : callVolume < 1000 ? 'medium' : 'enterprise',
            region: 'US-EAST',
            expectedCallVolume: callVolume,
            businessHours: {
              timezone: 'America/New_York',
              schedule: [
                { days: ['MONDAY', 'FRIDAY'], hours: '9:00-17:00' }
              ]
            },
            languages,
            tone: 'friendly'
          });

          spinner.stop();
          console.log(chalk.green('\nRetail Assistant Deployment Successful!'));
          console.log(chalk.cyan('\nDeployment Details:'));
          console.log(chalk.cyan('Assistant ID:', result.assistant.id));
          console.log(chalk.cyan('Phone Number:', result.phoneNumber.id));
          
          console.log(chalk.yellow('\nQuick Start Guide:'));
          result.quickStartGuide.setup.forEach((step: { description: string }, index: number) => {
            console.log(chalk.yellow(`${index + 1}. ${step.description}`));
          });

          console.log(chalk.magenta('\nEstimated Costs:'));
          console.log(chalk.magenta(`Monthly: $${result.estimatedCosts.monthly}`));
          console.log(chalk.magenta(`Per Call: $${result.estimatedCosts.perCall}`));

        } catch (error) {
          spinner.stop();
          console.log(chalk.red('Deployment failed:', error instanceof Error ? error.message : error));
        }
        break;
      }

      case testMenuChoices.ANALYZE_DEPLOYMENT: {
        spinner.start('Fetching deployments...');
        const deployments = await getAssistantChoices();
        spinner.stop();

        if (deployments.length === 0) {
          console.log(chalk.yellow('No deployments found. Create one first.'));
          break;
        }

        const { deploymentId } = await inquirer.prompt({
          type: 'list',
          name: 'deploymentId',
          message: 'Select deployment to analyze:',
          choices: deployments,
          pageSize: 10,
          loop: false
        });

        spinner.start('Analyzing deployment...');
        
        try {
          const analysis = await businessService.analyzeDeployment(deploymentId);
          spinner.stop();

          console.log(chalk.green('\nDeployment Analysis:'));
          
          console.log(chalk.cyan('\nPerformance Metrics:'));
          console.log(chalk.cyan(`Call Success Rate: ${analysis.metrics.successRate}%`));
          console.log(chalk.cyan(`Average Call Duration: ${analysis.metrics.avgDuration}s`));
          console.log(chalk.cyan(`Customer Satisfaction: ${analysis.metrics.csat}/5`));

          console.log(chalk.yellow('\nOptimization Suggestions:'));
          analysis.suggestions.forEach((suggestion, index) => {
            console.log(chalk.yellow(`${index + 1}. ${suggestion}`));
          });

          console.log(chalk.magenta('\nCost Analysis:'));
          console.log(chalk.magenta(`Current Monthly Cost: $${analysis.costs.current}`));
          console.log(chalk.magenta(`Projected Optimized Cost: $${analysis.costs.projected}`));
          console.log(chalk.magenta(`Potential Savings: $${analysis.costs.savings}`));

        } catch (error) {
          spinner.stop();
          console.log(chalk.red('Analysis failed:', error instanceof Error ? error.message : error));
        }
        break;
      }

      // Add other test cases...
    }
  }
}

async function handleFiles() {
  const fileService = new FileService(VAPI_TOKEN);
  
  while (true) {
    const { choice } = await inquirer.prompt({
      type: 'list',
      name: 'choice',
      message: 'What would you like to do with files?',
      choices: Object.values(fileMenuChoices),
      pageSize: 10,
      loop: false
    });

    const spinner = ora();

    if (choice === fileMenuChoices.BACK) {
      break;
    }

    switch (choice) {
      case fileMenuChoices.UPLOAD: {
        const { filePath, name, purpose } = await inquirer.prompt([
          {
            type: 'input',
            name: 'filePath',
            message: 'Enter the path to the file:',
            validate: (input) => fs.existsSync(input) || 'File does not exist'
          },
          {
            type: 'input',
            name: 'name',
            message: 'Enter a name for the file (optional):',
            default: (answers: { filePath: string }) => path.basename(answers.filePath)
          },
          {
            type: 'input',
            name: 'purpose',
            message: 'Enter the purpose of the file (optional):'
          }
        ]);

        spinner.start('Uploading file...');
        
        try {
          const fileStream = fs.createReadStream(filePath);
          const result = await fileService.uploadFile(fileStream, {
            name,
            purpose: purpose || undefined
          });

          spinner.stop();
          if (result.success) {
            console.log(chalk.green('\nFile uploaded successfully!'));
            console.log(chalk.cyan('File ID:', result.data?.id));
          } else {
            console.log(chalk.red('Error:', result.error));
          }
        } catch (error) {
          spinner.stop();
          console.log(chalk.red('Upload failed:', error instanceof Error ? error.message : error));
        }
        break;
      }

      case fileMenuChoices.LIST: {
        spinner.start('Fetching files...');
        const result = await fileService.listFiles();
        spinner.stop();

        if (result.success && result.data) {
          console.log(chalk.green('\nFound Files:'));
          result.data.forEach((file: File) => {
            console.log(chalk.cyan(`- ${file.name || file.originalName || 'Unnamed'} (${file.id})`));
            if (file.status) {
              console.log(chalk.gray(`  Status: ${file.status}`));
            }
            if (file.purpose) {
              console.log(chalk.gray(`  Purpose: ${file.purpose}`));
            }
          });
        } else {
          console.log(chalk.red('Error:', result.error));
        }
        break;
      }

      case fileMenuChoices.GET: {
        const result = await fileService.listFiles();
        if (!result.success || !result.data?.length) {
          console.log(chalk.yellow('No files found. Upload one first.'));
          break;
        }

        const { id } = await inquirer.prompt({
          type: 'list',
          name: 'id',
          message: 'Select file to view:',
          choices: result.data.map((file: File) => ({
            name: `${file.name || file.originalName || 'Unnamed'} (${file.id})`,
            value: file.id
          })),
          pageSize: 10,
          loop: false
        });

        spinner.start('Fetching file details...');
        const fileResult = await fileService.getFile(id);
        spinner.stop();

        if (fileResult.success && fileResult.data) {
          console.log(chalk.green('\nFile Details:'));
          console.log(chalk.cyan(JSON.stringify(fileResult.data, null, 2)));
        } else {
          console.log(chalk.red('Error:', fileResult.error));
        }
        break;
      }

      case fileMenuChoices.DELETE: {
        spinner.start('Fetching files...');
        const result = await fileService.listFiles();
        spinner.stop();

        if (!result.success || !result.data?.length) {
          console.log(chalk.yellow('No files found. Upload one first.'));
          break;
        }

        const { id, confirm } = await inquirer.prompt([
          {
            type: 'list',
            name: 'id',
            message: 'Select file to delete:',
            choices: result.data.map((file: File) => ({
              name: `${file.name || file.originalName || 'Unnamed'} (${file.id})`,
              value: file.id
            })),
            pageSize: 10,
            loop: false
          },
          {
            type: 'confirm',
            name: 'confirm',
            message: (answers) => `Are you sure you want to delete this file? (${answers.id})`,
            default: false
          }
        ]);

        if (!confirm) {
          console.log(chalk.yellow('Operation cancelled'));
          break;
        }

        spinner.start('Deleting file...');
        const deleteResult = await fileService.deleteFile(id);
        spinner.stop();

        if (deleteResult.success) {
          console.log(chalk.green('\nFile deleted successfully!'));
        } else {
          console.log(chalk.red('Error:', deleteResult.error));
        }
        break;
      }

      case fileMenuChoices.UPDATE: {
        spinner.start('Fetching files...');
        const result = await fileService.listFiles();
        spinner.stop();

        if (!result.success || !result.data?.length) {
          console.log(chalk.yellow('No files found. Upload one first.'));
          break;
        }

        const { id } = await inquirer.prompt({
          type: 'list',
          name: 'id',
          message: 'Select file to update:',
          choices: result.data.map((file: File) => ({
            name: `${file.name || file.originalName || 'Unnamed'} (${file.id})`,
            value: file.id
          })),
          pageSize: 10,
          loop: false
        });

        const { name } = await inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: 'Enter new name (leave empty to skip):'
          }
        ]);

        if (!name) {
          console.log(chalk.yellow('No changes to make'));
          break;
        }

        spinner.start('Updating file...');
        const updateResult = await fileService.updateFile(id, { name });
        spinner.stop();

        if (updateResult.success) {
          console.log(chalk.green('\nFile updated successfully!'));
          console.log(chalk.cyan('Updated file:', updateResult.data?.id));
        } else {
          console.log(chalk.red('Error:', updateResult.error));
        }
        break;
      }
    }
  }
}

async function handlePhoneNumberPurchase() {
  const spinner = ora();
  
  try {
    // Add warning about costs
    console.log(chalk.yellow('\n⚠️  WARNING: Phone number purchases will incur real charges on your Twilio account'));
    console.log(chalk.yellow('Typical costs:'));
    console.log(chalk.yellow('- Local numbers: ~$1.00/month'));
    console.log(chalk.yellow('- Toll-free numbers: ~$2.00/month'));
    console.log(chalk.yellow('- Additional per-minute charges will apply for calls\n'));

    const { proceed } = await inquirer.prompt({
      type: 'confirm',
      name: 'proceed',
      message: 'Do you understand that this will charge your Twilio account and wish to proceed?',
      default: false
    });

    if (!proceed) {
      console.log(chalk.yellow('Operation cancelled'));
      return;
    }

    // Step 1: Select country
    const { country } = await inquirer.prompt({
      type: 'list',
      name: 'country',
      message: 'Select country:',
      choices: [
        { name: 'United States', value: 'US' },
        { name: 'Canada', value: 'CA' },
        { name: 'United Kingdom', value: 'GB' }
        // Add more countries as needed
      ]
    });

    // Step 2: Select number type
    const { numberType } = await inquirer.prompt({
      type: 'list',
      name: 'numberType',
      message: 'Select number type:',
      choices: [
        { name: 'Local', value: 'local' },
        { name: 'Toll Free', value: 'tollfree' },
        { name: 'Mobile', value: 'mobile' }
      ]
    });

    // Step 3: Optional filters
    const { useFilters } = await inquirer.prompt({
      type: 'confirm',
      name: 'useFilters',
      message: 'Would you like to apply search filters?',
      default: false
    });

    let searchParams: any = { country, type: numberType };

    if (useFilters) {
      const filters = await inquirer.prompt([
        {
          type: 'input',
          name: 'areaCode',
          message: 'Enter area code (optional):',
          validate: (input) => !input || /^\d{3}$/.test(input) || 'Area code must be 3 digits'
        },
        {
          type: 'input',
          name: 'contains',
          message: 'Enter number pattern (optional):',
          validate: (input) => !input || /^[\d*]+$/.test(input) || 'Invalid pattern'
        }
      ]);

      if (filters.areaCode) searchParams.areaCode = filters.areaCode;
      if (filters.contains) searchParams.contains = filters.contains;
    }

    // Step 4: Fetch available numbers
    spinner.start('Searching for available numbers...');
    const result = await phoneNumberService.listAvailableNumbers(searchParams);
    spinner.stop();

    if (!result.success || !result.data?.length) {
      console.log(chalk.yellow('No numbers found matching your criteria'));
      return;
    }

    // Step 5: Display and select number
    const { selectedNumber } = await inquirer.prompt({
      type: 'list',
      name: 'selectedNumber',
      message: 'Select a number to purchase:',
      choices: result.data.map(num => ({
        name: `${num.friendlyName} - ${num.region}`,
        value: num.phoneNumber
      })),
      pageSize: 10
    });

    // Step 6: Link to assistant (optional)
    spinner.start('Fetching available assistants...');
    const assistantChoices = await getAssistantChoices();
    spinner.stop();

    const { assistantId } = await inquirer.prompt({
      type: 'list',
      name: 'assistantId',
      message: 'Select assistant to link (optional):',
      choices: [
        { name: 'None', value: null },
        ...assistantChoices
      ]
    });

    // Fetch actual pricing for the selected country
    spinner.start('Fetching pricing information...');
    const pricingResult = await phoneNumberService.getPhoneNumberPricing(country);
    spinner.stop();

    if (!pricingResult.success) {
      console.log(chalk.red('Error fetching pricing:', pricingResult.error));
      return;
    }

    // Display detailed pricing information
    console.log(chalk.yellow('\n📞 Phone Number Pricing Information'));
    console.log(chalk.yellow('────────────────────────────────'));
    pricingResult.data?.prices.forEach(price => {
      console.log(chalk.cyan(`${price.numberType}: ${pricingResult.data?.priceUnit} ${price.currentPrice}/month`));
    });
    console.log(chalk.yellow('\n⚠️  IMPORTANT: Additional charges'));
    console.log(chalk.yellow('- Voice calls: Varies by destination'));
    console.log(chalk.yellow('- SMS messages: Varies by destination'));
    console.log(chalk.yellow('- Additional features may incur extra costs\n'));

    // Get the specific price for the selected number type
    const normalizedSearchType = numberType.toLowerCase().trim();
    const selectedPrice = pricingResult.data?.prices.find(p => {
      const isExactMatch = p.numberType === normalizedSearchType;
      const isTollFreeMatch = (normalizedSearchType === 'tollfree' && p.numberType === 'toll free') ||
                             (normalizedSearchType === 'toll free' && p.numberType === 'tollfree');
      const isLocalMatch = p.numberType === 'local' && normalizedSearchType === 'local';
      
      return isExactMatch || isTollFreeMatch || isLocalMatch;
    });

    if (!selectedPrice) {
      console.log(chalk.red('\nError: Could not determine pricing for selected number type'));
      console.log(chalk.yellow('Available price types:'));
      pricingResult.data?.prices.forEach(price => {
        console.log(chalk.yellow(`  • ${price.numberType}: ${pricingResult.data?.priceUnit} ${price.currentPrice}/month`));
      });
      return;
    }

    // Display the matched price information
    console.log(chalk.green('\nFound matching price:'));
    console.log(chalk.green(`- Type: ${selectedPrice.numberType}`));
    console.log(chalk.green(`- Price: ${pricingResult.data?.priceUnit} ${selectedPrice.currentPrice}/month`));

    // Require explicit confirmation with price acknowledgment
    const { confirmPrice } = await inquirer.prompt({
      type: 'input',
      name: 'confirmPrice',
      message: `Type the monthly price (${selectedPrice.currentPrice}) to confirm:`,
      validate: (input) => {
        return input === selectedPrice.currentPrice || 
          'Please enter the exact price shown to confirm';
      }
    });

    const { confirmPurchase } = await inquirer.prompt({
      type: 'input',
      name: 'confirmPurchase',
      message: 'Type "PURCHASE" to confirm you want to buy this number:',
      validate: (input) => {
        return input === 'PURCHASE' || 
          'Please type PURCHASE (all caps) to confirm';
      }
    });

    // Proceed with purchase...
    spinner.start('Purchasing phone number...');
    const purchaseResult = await phoneNumberService.createPhoneNumber({
      provider: 'twilio',
      number: selectedNumber,
      twilioAccountSid: process.env.TWILIO_ACCOUNT_SID!,
      twilioAuthToken: process.env.TWILIO_AUTH_TOKEN!,
      assistantId: assistantId || undefined
    } as TwilioPhoneNumberConfig);
    spinner.stop();

    if (purchaseResult.success) {
      console.log(chalk.green('\nPhone number purchased successfully!'));
      console.log(chalk.cyan('ID:', purchaseResult.data?.id));
      console.log(chalk.yellow('\nMonthly Costs:'));
      console.log(chalk.yellow(`- Number rental: ${pricingResult.data?.priceUnit} ${selectedPrice.currentPrice}`));
      console.log(chalk.yellow('- Usage charges will appear in your Twilio console'));
      console.log(chalk.yellow('\nManage this number at: https://www.twilio.com/console/phone-numbers'));
    } else {
      console.log(chalk.red('Error:', purchaseResult.error));
    }

  } catch (error) {
    spinner.stop();
    console.log(chalk.red('Error:', error instanceof Error ? error.message : error));
  }
}

// Update the elevenLabsVoices enum with the exact IDs that Vapi expects
const elevenLabsVoices = {
  RACHEL: '21m00Tcm4TlvDq8ikWAM',  // Rachel
  DOMI: 'AZnzlk1XvdvUeBnXmlld',    // Domi
  BELLA: 'EXAVITQu4vr4xnSDxMaL',   // Bella
  ANTONI: 'ErXwobaYiN019PkySvjV',   // Antoni
  ELLI: 'MF3mGyEYCl7XYWbV9V6O',    // Elli
  JOSH: 'TxGEqnHWrfWFTfGW9XjX',    // Josh
  ARNOLD: 'VR6AewLTigWG4xSOukaG',   // Arnold
  ADAM: 'pNInz6obpgDQGcFmaJgB',    // Adam
  SAM: 'yoZ06aMxZJJ28mfd3POQ',     // Sam
  NICOLE: 'piTKgcLEGmPE4e6mEKli',   // Nicole
  GLINDA: 'z9fAnlkpzviPz146aGWa'    // Glinda
} as const;

// Update the configureVoice function with the same choices but using the correct IDs
async function configureVoice(provider: VapiVoiceProvider): Promise<VapiVoiceConfig> {
  const voiceConfig: VapiVoiceConfig = {
    provider,
    voiceId: ''
  };

  if (provider === '11labs') {
    const { voiceId, model, stability, similarityBoost } = await inquirer.prompt([
      {
        type: 'list',
        name: 'voiceId',
        message: 'Select voice:',
        choices: [
          { name: 'Rachel (Female, Conversational)', value: elevenLabsVoices.RACHEL },
          { name: 'Domi (Female, Strong)', value: elevenLabsVoices.DOMI },
          { name: 'Bella (Female, Soft)', value: elevenLabsVoices.BELLA },
          { name: 'Antoni (Male, Well-Rounded)', value: elevenLabsVoices.ANTONI },
          { name: 'Elli (Female, Young)', value: elevenLabsVoices.ELLI },
          { name: 'Josh (Male, Young)', value: elevenLabsVoices.JOSH },
          { name: 'Arnold (Male, Strong)', value: elevenLabsVoices.ARNOLD },
          { name: 'Adam (Male, Deep)', value: elevenLabsVoices.ADAM },
          { name: 'Sam (Male, Raspy)', value: elevenLabsVoices.SAM },
          { name: 'Nicole (Female, Professional)', value: elevenLabsVoices.NICOLE },
          { name: 'Glinda (Female, Warm)', value: elevenLabsVoices.GLINDA }
        ]
      },
      {
        type: 'list',
        name: 'model',
        message: 'Select model:',
        choices: [
          { name: 'Turbo V2.5 (Recommended)', value: 'eleven_turbo_v2_5' },
          { name: 'Multilingual V2', value: 'eleven_multilingual_v2' },
          { name: 'Turbo V2', value: 'eleven_turbo_v2' },
          { name: 'Monolingual V1', value: 'eleven_monolingual_v1' }
        ],
        default: 'eleven_turbo_v2_5'
      },
      {
        type: 'number',
        name: 'stability',
        message: 'Enter stability (0-1):',
        default: 0.5,
        validate: (value) => value >= 0 && value <= 1
      },
      {
        type: 'number',
        name: 'similarityBoost',
        message: 'Enter similarity boost (0-1):',
        default: 0.75,
        validate: (value) => value >= 0 && value <= 1
      }
    ]);

    voiceConfig.voiceId = voiceId;
    voiceConfig.model = model;
    voiceConfig.stability = stability;
    voiceConfig.similarityBoost = similarityBoost;
  }

  // Configure chunk plan
  const { useChunkPlan } = await inquirer.prompt({
    type: 'confirm',
    name: 'useChunkPlan',
    message: 'Would you like to configure chunking?',
    default: false
  });

  if (useChunkPlan) {
    const { minCharacters, formatEnabled } = await inquirer.prompt([
      {
        type: 'number',
        name: 'minCharacters',
        message: 'Enter minimum characters per chunk:',
        default: 30,
        validate: (value) => value >= 1 && value <= 80
      },
      {
        type: 'confirm',
        name: 'formatEnabled',
        message: 'Enable text formatting?',
        default: true
      }
    ]);

    voiceConfig.chunkPlan = {
      enabled: true,
      minCharacters,
      formatPlan: {
        enabled: formatEnabled
      }
    };
  }

  return voiceConfig;
}

// Add a function to configure model settings based on provider
async function configureModel(provider: string) {
  const baseConfig = {
    provider,
    temperature: 0.7,
    maxTokens: 150,
    emotionRecognitionEnabled: true,
    messages: [
      {
        role: "system",
        content: "You are a helpful customer service assistant."
      }
    ]
  };

  if (provider === 'groq') {
    const { model } = await inquirer.prompt([
      {
        type: 'list',
        name: 'model',
        message: 'Select Groq model:',
        choices: [
          { 
            name: 'LLaMA 3.1 405B (Reasoning)',
            value: 'llama-3.1-405b-reasoning'
          },
          { 
            name: 'LLaMA 3.1 70B (Versatile)',
            value: 'llama-3.1-70b-versatile'
          },
          { 
            name: 'LLaMA 3.1 8B (Instant)',
            value: 'llama-3.1-8b-instant'
          },
          { 
            name: 'Mixtral 8x7B',
            value: 'mixtral-8x7b-32768'
          },
          { 
            name: 'LLaMA3 8B',
            value: 'llama3-8b-8192'
          },
          { 
            name: 'LLaMA3 70B',
            value: 'llama3-70b-8192'
          },
          { 
            name: 'LLaMA3 8B (Tool Use Preview)',
            value: 'llama3-groq-8b-8192-tool-use-preview'
          },
          { 
            name: 'LLaMA3 70B (Tool Use Preview)',
            value: 'llama3-groq-70b-8192-tool-use-preview'
          },
          { 
            name: 'Gemma 7B',
            value: 'gemma-7b-it'
          },
          { 
            name: 'Gemma2 9B',
            value: 'gemma2-9b-it'
          }
        ]
      }
    ]);

    return {
      ...baseConfig,
      model
    };
  }

  // Default model selection for other providers
  return {
    ...baseConfig,
    model: provider === 'vapi' ? 'gpt-4' : 'gpt-3.5-turbo'
  };
}

// Main menu loop
export async function showMainMenu() {
  while (true) {
    console.log('\n');
    const { choice } = await inquirer.prompt({
      type: 'list',
      name: 'choice',
      message: 'What would you like to do?',
      choices: Object.values(mainMenuChoices),
      pageSize: 10,
      loop: false
    });

    switch (choice) {
      case mainMenuChoices.ASSISTANTS:
        await handleAssistants();
        break;
      case mainMenuChoices.PHONE_NUMBERS:
        await handlePhoneNumbers();
        break;
      case mainMenuChoices.FILES:
        await handleFiles();
        break;
      case mainMenuChoices.TEST_FEATURES:
        await handleTestFeatures();
        break;
      case mainMenuChoices.EXIT:
        console.log(chalk.yellow('\nGoodbye! 👋'));
        process.exit(0);
    }
  }
} 