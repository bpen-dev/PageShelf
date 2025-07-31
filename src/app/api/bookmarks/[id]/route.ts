import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/libs/microcms';

export async function PATCH(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> } // 👈 params を Promise で囲む
) {
  try {
    const params = await paramsPromise; // 👈 ここで await する
    const id = params.id;
    const json = await request.json();
    const data = await client.update({
      endpoint: 'bookmarks',
      contentId: id,
      content: {
        url: json.url,
        title: json.title,
        description: json.description,
        tags: json.tags,
      },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update bookmark' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id:string }> } // 👈 こちらも同様に修正
) {
  try {
    const params = await paramsPromise; // 👈 ここで await する
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