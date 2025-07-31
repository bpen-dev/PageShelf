import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/libs/microcms';

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    
    // ★デバッグ用：ターミナルに、ブラウザから送られてきたデータが表示されます
    console.log('Received data:', json); 

    const { url, title, description, tags, newTag } = json;
    const allTagIds = [...(tags || [])]; // 既存のタグをコピー (tagsが空の場合も考慮)

    // 新しいタグ名が入力されていた場合の処理
    if (newTag && typeof newTag === 'string' && newTag.trim() !== '') {
      const newTagResponse = await client.create({
        endpoint: 'tags',
        content: { name: newTag.trim() },
      });
      allTagIds.push(newTagResponse.id);
    }

    // microCMSに送信するブックマークのデータを作成
    const contentToCreate = {
      url,
      title,
      description,
      tags: allTagIds,
    };

    const data = await client.create({
      endpoint: 'bookmarks',
      content: contentToCreate,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('API Error:', error); // エラー内容もターミナルに表示
    return NextResponse.json({ error: 'Failed to create bookmark' }, { status: 500 });
  }
}