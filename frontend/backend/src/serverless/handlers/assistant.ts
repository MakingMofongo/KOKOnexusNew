import { NextResponse } from 'next/server';
import { AssistantService } from '../../services/assistantService';
import { VAPI_TOKEN } from '../../config';

const assistantService = new AssistantService(VAPI_TOKEN);

export async function handleListAssistants(req: Request) {
  try {
    const result = await assistantService.listAssistants();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function handleCreateAssistant(req: Request) {
  try {
    const config = await req.json();
    const result = await assistantService.createAssistant(config);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
} 