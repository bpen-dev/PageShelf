import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/libs/microcms';

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    const data = await client.create({
      endpoint: 'folders',
      content: { name },
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
  }
}