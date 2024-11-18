import { handleListAssistants, handleCreateAssistant } from '@backend/serverless/handlers/assistant';

export const GET = handleListAssistants;
export const POST = handleCreateAssistant; 