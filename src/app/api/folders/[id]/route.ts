import { NextRequest, NextResponse } from 'next/server';
import { client, updateFolderName, deleteFolder, getDefaultFolderId } from '@/libs/microcms';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

// フォルダの所有者かを確認するヘルパー関数
async function checkFolderOwnership(folderId: string, userEmail: string) {
  try {
    const folder = await client.get({ endpoint: 'folders', contentId: folderId });
    return folder.userId === userEmail;
  } catch (error) {
    return false;
  }
}

// フォルダ名を更新 (PATCH)
export async function PATCH(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
  }

  const params = await paramsPromise;
  const isOwner = await checkFolderOwnership(params.id, session.user.email);
  if (!isOwner) {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 });
  }

  try {
    const { name } = await request.json();
    const data = await updateFolderName(params.id, name);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update folder' }, { status: 500 });
  }
}

// フォルダを削除 (DELETE)
export async function DELETE(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
  }

  const params = await paramsPromise;
  const folderIdToDelete = params.id;
  const isOwner = await checkFolderOwnership(folderIdToDelete, session.user.email);
  if (!isOwner) {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 });
  }
  
  try {
    // 1. DefaultフォルダのIDを取得する
    const defaultFolderId = await getDefaultFolderId(session);
    if (!defaultFolderId) {
      return NextResponse.json({ error: 'Defaultフォルダが見つかりません' }, { status: 500 });
    }

    // 2. 削除対象のフォルダに属するブックマークを全て取得する
    const bookmarksToUpdate = await client.getList({
      endpoint: 'bookmarks',
      queries: {
        filters: `folder[equals]${folderIdToDelete}`,
        limit: 100,
        fields: 'id',
      },
    });

    // 3. 取得した各ブックマークのfolderをDefaultフォルダのIDにする
    await Promise.all(
      bookmarksToUpdate.contents.map((bookmark) =>
        client.update({
          endpoint: 'bookmarks',
          contentId: bookmark.id,
          content: {
            folder: defaultFolderId,
          },
        })
      )
    );

    // 4. ブックマークの移動が完了したら、フォルダ自体を削除する
    await deleteFolder(folderIdToDelete);
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Delete Folder API Error:', error);
    return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 });
  }
}