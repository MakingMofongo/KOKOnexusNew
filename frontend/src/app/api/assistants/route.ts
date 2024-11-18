import { NextResponse } from 'next/server';
import { fetchVapiAssistants } from '@/lib/vapi';

export async function GET() {
  try {
    const assistants = await fetchVapiAssistants();
    
    // Format assistants similar to CLI interface
    const formattedAssistants = assistants.map(assistant => ({
      id: assistant.id,
      name: assistant.name,
      type: assistant.type || 'custom',
      description: assistant.description,
      status: assistant.status
    }));

    return NextResponse.json({
      success: true,
      data: formattedAssistants
    });
  } catch (error) {
    console.error('Error listing assistants:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list assistants' },
      { status: 500 }
    );
  }
} 