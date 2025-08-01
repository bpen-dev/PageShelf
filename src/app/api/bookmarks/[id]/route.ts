import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/libs/microcms';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

// ユーザーがそのブックマークの所有者かを確認するヘルパー関数
async function checkOwnership(contentId: string, userEmail: string) {
  try {
    const bookmark = await client.get({ endpoint: 'bookmarks', contentId });
    return bookmark.userId === userEmail;
  } catch (error) {
    return false;
  }
}

// データを更新する (PATCH)
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
  
  try {
    const changes = await request.json(); // ブラウザからの変更点 (例: { color: 'red' })

    const contentToUpdate = { ...changes };

    // 👇 [修正点] もしcolorの変更があれば、配列で囲む
    if (contentToUpdate.color) {
      contentToUpdate.color = [contentToUpdate.color];
    }

    // もしcolorを「なし」にする場合は、空の配列を送る
    if (changes.color === null) {
      contentToUpdate.color = [];
    }
    
    const data = await client.update({
      endpoint: 'bookmarks',
      contentId: params.id,
      content: contentToUpdate, // 変更点だけを送る
    });
    
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('API Update Error:', error);
    return NextResponse.json({ error: 'Failed to update bookmark' }, { status: 500 });
  }
}

// データを削除する (DELETE)
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
  
  try {
    await client.delete({ endpoint: 'bookmarks', contentId: params.id });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete bookmark' }, { status: 500 });
  }
}