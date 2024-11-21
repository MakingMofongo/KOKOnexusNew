import { 
  ByoPhoneNumberConfig, 
  TwilioPhoneNumberConfig, 
  VonagePhoneNumberConfig, 
  VapiPhoneNumberConfig 
} from '../types/phoneNumber';

export const defaultByoConfig: ByoPhoneNumberConfig = {
  provider: 'byo-phone-number',
  numberE164CheckEnabled: true,
  name: 'BYO Phone Number',
  credentialId: ''
};

export const defaultTwilioConfig: TwilioPhoneNumberConfig = {
  provider: 'twilio',
  name: 'Twilio Phone Number',
  number: '',
  twilioAccountSid: '',
  twilioAuthToken: ''
};

export const defaultVonageConfig: VonagePhoneNumberConfig = {
  provider: 'vonage',
  name: 'Vonage Phone Number',
  credentialId: '',
  number: ''
};

export const defaultVapiConfig: VapiPhoneNumberConfig = {
  provider: 'vapi',
  name: 'Vapi Phone Number',
  sipUri: ''
}; 