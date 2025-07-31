import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/libs/microcms';

// POSTリクエストの処理
export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const data = await client.create({
      endpoint: 'bookmarks',
      content: {
        url: json.url,
        title: json.title,
        description: json.description,
        // tagsはフェーズ2で実装
      },
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create bookmark' }, { status: 500 });
  }
}