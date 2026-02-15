import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  if (process.env.NODE_ENV === 'development') {
    response.headers.append('Access-Control-Allow-Origin', '*');
  }

  return response;
}
