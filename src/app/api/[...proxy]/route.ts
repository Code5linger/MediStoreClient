// app/api/[...proxy]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  return proxyRequest(request);
}

export async function POST(request: NextRequest) {
  return proxyRequest(request);
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request);
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request);
}

export async function PATCH(request: NextRequest) {
  return proxyRequest(request);
}

async function proxyRequest(request: NextRequest) {
  const path = request.nextUrl.pathname.replace('/api', '');
  const search = request.nextUrl.search;
  const url = `${BACKEND_URL}${path}${search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!['host', 'connection'].includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  const options: RequestInit = {
    method: request.method,
    headers,
  };

  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    options.body = await request.text();
  }

  try {
    const response = await fetch(url, options);
    const data = await response.text();

    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });

    return new NextResponse(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new NextResponse('Proxy Error', { status: 500 });
  }
}
