import { NextResponse } from 'next/server';
import { handleDeployment } from '@backend/serverless/handlers/deployment';

export async function POST(req: Request) {
  try {
    const result = await handleDeployment(req.clone());
    return result;
  } catch (error) {
    console.error('Error in deployment route:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
} 