import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/libs/microcms';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

async function checkOwnership(contentId: string, userEmail: string) {
  try {
    const bookmark = await client.get({ endpoint: 'bookmarks', contentId });
    return bookmark.userId === userEmail;
  } catch (error) {
    return false;
  }
}

export async function PATCH(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
  }

  const params = await paramsPromise;
  const isOwner = await checkOwnership(params.id, session.user.email);
  if (!isOwner) {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 });
  }
  
  // (ここから下は変更なし)
  try {
    const json = await request.json();
    const { url, title, description, folder } = json;
    const data = await client.update({
      endpoint: 'bookmarks',
      contentId: params.id,
      content: { url, title, description, folder: folder || null, },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update bookmark' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
  }

  const params = await paramsPromise;
  const isOwner = await checkOwnership(params.id, session.user.email);
  if (!isOwner) {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 });
  }
  
  // (ここから下は変更なし)
  try {
    await client.delete({ endpoint: 'bookmarks', contentId: params.id });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete bookmark' }, { status: 500 });
  }
}