import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/libs/microcms';

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const { url, title, description, folder } = json;

    // microCMSに送信するデータを作成
    const contentToCreate = {
      url,
      title,
      description,
      folder: folder || null, // フォルダが選択されていなければnullとして保存
    };

    const data = await client.create({
      endpoint: 'bookmarks',
      content: contentToCreate,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to create bookmark' }, { status: 500 });
  }
}