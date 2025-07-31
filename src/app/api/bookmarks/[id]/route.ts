import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/libs/microcms';

// データを更新する (PATCH)
export async function PATCH(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  try {
    const params = await paramsPromise;
    const id = params.id;
    const json = await request.json();
    const { url, title, description, folder } = json;

    const data = await client.update({
      endpoint: 'bookmarks',
      contentId: id,
      content: {
        url,
        title,
        description,
        folder: folder || null, // フォルダが選択されていなければnullとして保存
      },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to update bookmark' }, { status: 500 });
  }
}

// データを削除する (DELETE)
export async function DELETE(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  try {
    const params = await paramsPromise;
    const id = params.id;
    await client.delete({
      endpoint: 'bookmarks',
      contentId: id,
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete bookmark' }, { status: 500 });
  }
}