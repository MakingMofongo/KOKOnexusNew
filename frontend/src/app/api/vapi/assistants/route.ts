import { NextResponse } from 'next/server';
import { AssistantService } from '@backend/services/assistantService';
import { VAPI_TOKEN } from '@backend/config';

// Initialize the AssistantService like the CLI does
const assistantService = new AssistantService(VAPI_TOKEN);

export async function GET() {
  try {
    console.log('Fetching assistants using AssistantService...');
    
    // Use the backend service directly like the CLI
    const result = await assistantService.listAssistants();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch assistants');
    }

    console.log('Assistants fetched successfully:', result.data?.length);

    return NextResponse.json({
      success: true,
      assistants: result.data || []
    });
  } catch (error) {
    console.error('Error in assistants route:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch assistants' 
      },
      { status: 500 }
    );
  }
} 