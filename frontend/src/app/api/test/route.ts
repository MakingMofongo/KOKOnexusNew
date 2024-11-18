import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test the phone number list endpoint
    const listResponse = await fetch('http://localhost:3000/api/phone-numbers/list');
    const listResult = await listResponse.json();
    
    return NextResponse.json({
      success: true,
      data: listResult
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
} 