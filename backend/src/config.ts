import * as dotenv from 'dotenv';

// Load .env file
dotenv.config();

// Assert that VAPI_TOKEN is a string using type assertion
export const VAPI_TOKEN = process.env.VAPI_TOKEN as string;

if (!VAPI_TOKEN) {
    console.error('Could not find VAPI_TOKEN in environment variables');
    console.log('Current environment:', process.env);
    throw new Error('VAPI_TOKEN environment variable is required');
} 