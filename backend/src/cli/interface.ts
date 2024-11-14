import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';
import ora from 'ora';
import { AssistantService } from '../services/assistantService';
import { PhoneNumberService } from '../services/phoneNumberService';
import { VAPI_TOKEN } from '../config';
import { defaultByoConfig, defaultTwilioConfig, defaultVonageConfig, defaultVapiConfig } from '../config/phoneNumberConfig';
import { BusinessDeploymentService } from '../services/businessDeploymentService';
import { UpdatePhoneNumberDto } from '../types/phoneNumber';
import { FileService } from '../services/fileService';
import * as fs from 'fs';
import * as path from 'path';
import { File } from '../types/file';
import { TranscriberConfig } from '../types/assistant';
import { GladiaLanguage, GladiaLanguageBehaviour, GladiaTranscriberConfig } from '../types/assistant';
import twilio from 'twilio';

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
      when: (answers) => answers.languageBehaviour === 'manual',
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
  ]);

  // Build the configuration object
  const config: GladiaTranscriberConfig = {
    provider: 'gladia',
    audioEnhancer: gladiaConfig.audioEnhancer,
    languageBehaviour: gladiaConfig.languageBehaviour,
    model: gladiaConfig.model,
    prosody: gladiaConfig.prosody
  };

  // Add optional fields only if they have values
  if (gladiaConfig.language) {
    config.language = gladiaConfig.language;
  }

  if (gladiaConfig.transcriptionHint?.trim()) {
    config.transcriptionHint = gladiaConfig.transcriptionHint.trim();
  }

  return config;
}

// Update the existing configureTranscriber function
async function configureTranscriber() {
  const { provider } = await inquirer.prompt([
    {
      type: 'list',
      name: 'provider',
      message: 'Select transcriber provider:',
      choices: [
        { name: 'Gladia (Advanced multi-language support)', value: 'gladia' },
        { name: 'Deepgram', value: 'deepgram' },
        { name: 'Custom Transcriber', value: 'custom-transcriber' },
        { name: 'Talkscriber', value: 'talkscriber' }
      ]
    }
  ]);

  switch (provider) {
    case 'gladia':
      return configureGladiaTranscriber();
    // ... other cases remain the same
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
        const { name, firstMessage } = await inquirer.prompt([
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
          }
        ]);

        spinner.start('Creating assistant...');
        const result = await assistantService.createAssistant({
          name,
          firstMessage,
          model: {
            provider: "vapi",
            model: "gpt-4",
            temperature: 0.7,
            maxTokens: 150,
            emotionRecognitionEnabled: true,
            messages: [
              {
                role: "assistant",
                content: "You are a helpful customer service assistant."
              }
            ]
          }
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

        const { name, firstMessage } = await inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: 'Enter new name (leave empty to skip):',
          },
          {
            type: 'input',
            name: 'firstMessage',
            message: 'Enter new first message (leave empty to skip):',
          }
        ]);

        const updates: any = {};
        if (name) updates.name = name;
        if (firstMessage) updates.firstMessage = firstMessage;

        const transcriberUpdate = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'updateTranscriber',
            message: 'Would you like to update the transcriber configuration?',
            default: false
          }
        ]);

        if (transcriberUpdate.updateTranscriber) {
          updates.transcriber = await configureTranscriber();
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
        const { provider } = await inquirer.prompt({
          type: 'list',
          name: 'provider',
          message: 'Select phone number provider:',
          choices: ['Twilio', 'Vonage', 'Vapi', 'BYO'],
          pageSize: 10,
          loop: false
        });

        // Get available assistants for linking
        spinner.start('Fetching available assistants...');
        const assistantChoices = await getAssistantChoices();
        spinner.stop();

        let config;
        switch (provider.toLowerCase()) {
          case 'twilio': {
            // First fetch available numbers
            spinner.start('Fetching available Twilio numbers...');
            const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            
            try {
              const availableNumbers = await twilioClient.availablePhoneNumbers('US')
                .local
                .list({ limit: 20 });
              spinner.stop();

              if (availableNumbers.length === 0) {
                console.log(chalk.yellow('No numbers available in this region'));
                break;
              }

              // Let user select from available numbers
              const { selectedNumber, accountSid, authToken, assistantId } = await inquirer.prompt([
                {
                  type: 'list',
                  name: 'selectedNumber',
                  message: 'Select a phone number to purchase:',
                  choices: availableNumbers.map(num => ({
                    name: `${num.friendlyName} - ${num.phoneNumber}`,
                    value: num.phoneNumber
                  })),
                  pageSize: 10,
                  loop: false
                },
                {
                  type: 'input',
                  name: 'accountSid',
                  message: 'Enter Twilio Account SID:',
                  default: process.env.TWILIO_ACCOUNT_SID,
                  validate: (input) => input.length > 0
                },
                {
                  type: 'input',
                  name: 'authToken',
                  message: 'Enter Twilio Auth Token:',
                  default: process.env.TWILIO_AUTH_TOKEN,
                  validate: (input) => input.length > 0
                },
                {
                  type: 'list',
                  name: 'assistantId',
                  message: 'Select assistant to link (optional):',
                  choices: [
                    { name: 'None', value: null },
                    ...assistantChoices
                  ],
                  pageSize: 10,
                  loop: false
                }
              ]);

              config = {
                ...defaultTwilioConfig,
                number: selectedNumber,
                twilioAccountSid: accountSid,
                twilioAuthToken: authToken,
                assistantId: assistantId || undefined
              };
            } catch (error) {
              spinner.stop();
              console.log(chalk.red('Error fetching Twilio numbers:', error instanceof Error ? error.message : error));
              break;
            }
            break;
          }
          // Add other provider configurations...
        }

        if (config) {
          spinner.start('Purchasing phone number...');
          const result = await phoneNumberService.createPhoneNumber(config);
          spinner.stop();

          if (result.success) {
            console.log(chalk.green('\nPhone number purchased successfully!'));
            console.log(chalk.cyan('ID:', result.data?.id));
          } else {
            console.log(chalk.red('Error:', result.error));
          }
        }
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