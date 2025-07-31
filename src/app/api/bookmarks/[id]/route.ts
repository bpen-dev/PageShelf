import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/libs/microcms';

// PATCHリクエストの処理
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const json = await request.json();
    const data = await client.update({
      endpoint: 'bookmarks',
      contentId: id,
      content: {
        url: json.url,
        title: json.title,
        description: json.description,
      },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update bookmark' }, { status: 500 });
  }
}

// DELETEリクエストの処理
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await client.delete({
      endpoint: 'bookmarks',
      contentId: id,
    });
    // 削除が成功した場合、中身が空のレスポンスを返す
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete bookmark' }, { status: 500 });
  }
}