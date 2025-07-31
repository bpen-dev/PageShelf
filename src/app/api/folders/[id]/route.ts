import { NextRequest, NextResponse } from 'next/server';
import { client, updateFolderName, deleteFolder } from '@/libs/microcms';

// PATCH function (no changes here)
export async function PATCH(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  try {
    const params = await paramsPromise;
    const { name } = await request.json();
    const data = await updateFolderName(params.id, name);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update folder' }, { status: 500 });
  }
}

// DELETE function (this is where the fix is)
export async function DELETE(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  try {
    const params = await paramsPromise;
    const folderId = params.id;

    // 1. Get all bookmarks in the folder to be deleted.
    const bookmarksToUpdate = await client.getList({
      endpoint: 'bookmarks',
      queries: {
        filters: `folder[equals]${folderId}`,
        limit: 100, // Corrected from 1000 to 100
        fields: 'id',
      },
    });

    // 2. Move each bookmark to "unclassified."
    await Promise.all(
      bookmarksToUpdate.contents.map((bookmark) =>
        client.update({
          endpoint: 'bookmarks',
          contentId: bookmark.id,
          content: {
            folder: null,
          },
        })
      )
    );

    // 3. Delete the now-empty folder.
    await deleteFolder(folderId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Delete Folder API Error:', error);
    return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 });
  }
}