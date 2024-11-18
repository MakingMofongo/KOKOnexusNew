import { NextResponse } from 'next/server';
import twilio from 'twilio';
const VoiceResponse = twilio.twiml.VoiceResponse;

export async function POST(request: Request) {
  const twiml = new VoiceResponse();
  
  // Basic TwiML response for testing
  twiml.say('Hello! This is your AI assistant speaking.');
  
  return new NextResponse(twiml.toString(), {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
} 