import { createClient, type MicroCMSContentId, type MicroCMSDate } from 'microcms-js-sdk';
import { Session } from 'next-auth';

// ユーザーが自分で定義したフィールドの型
type FolderContent = {
  name: string;
  userId: string;
};
// microCMSのシステムフィールドを含んだ、最終的なフォルダの型
export type Folder = FolderContent & MicroCMSContentId & MicroCMSDate;

// ユーザーが自分で定義したフィールドの型
export type BookmarkContent = {
  url: string;
  title: string;
  description?: string;
  folder?: Folder;
  color?: 'red' | 'blue' | 'green' | 'yellow' | 'gray';
  userId: string;
};
// microCMSのシステムフィールドを含んだ、最終的なブックマークの型
export type Bookmark = BookmarkContent & MicroCMSContentId & MicroCMSDate;

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error('MICROCMS_SERVICE_DOMAIN is required');
}
if (!process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_API_KEY is required');
}

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

// --- フォルダ操作用の関数 ---
export const createFolder = async (name: string, userId: string) => {
  const newFolder = await client.create<FolderContent>({
    endpoint: 'folders',
    content: { name, userId },
  });
  return newFolder;
};
export const updateFolderName = async (id: string, name: string) => {
  const updatedFolder = await client.update<Partial<FolderContent>>({
    endpoint: 'folders',
    contentId: id,
    content: { name },
  });
  return updatedFolder;
};
export const deleteFolder = async (id: string) => {
  await client.delete({
    endpoint: 'folders',
    contentId: id,
  });
};

// --- データ取得用の関数 ---
export const getFolders = async (session: Session | null) => {
  if (!session || !session.user?.email) return [];
  const folders = await client.getList<Folder>({
    endpoint: 'folders',
    queries: {
      filters: `userId[equals]${session.user.email}`,
      limit: 100
    },
  });
  return folders.contents;
};
export const getBookmarks = async (session: Session | null) => {
  if (!session || !session.user?.email) return [];
  const bookmarks = await client.getList<Bookmark>({
    endpoint: 'bookmarks',
    queries: {
      filters: `userId[equals]${session.user.email}`,
      orders: '-createdAt',
      limit: 100,
      depth: 1,
    },
  });
  return bookmarks.contents;
};
export const getBookmarkDetail = async (contentId: string, session: Session | null) => {
  if (!session || !session.user?.email) return null;
  const bookmark = await client.get<Bookmark>({
    endpoint: 'bookmarks',
    contentId,
    queries: {
      filters: `userId[equals]${session.user.email}`,
      depth: 1,
    },
  });
  return bookmark;
};
export const getBookmarksByFolder = async (folderId: string, session: Session | null) => {
  if (!session || !session.user?.email) return [];
  const bookmarks = await client.getList<Bookmark>({
    endpoint: 'bookmarks',
    queries: {
      filters: `folder[equals]${folderId}[and]userId[equals]${session.user.email}`,
      orders: '-createdAt',
      limit: 100,
      depth: 1,
    },
  });
  return bookmarks.contents;
};
export const getUnclassifiedBookmarks = async (session: Session | null) => {
  if (!session || !session.user?.email) return [];
  const bookmarks = await client.getList<Bookmark>({
    endpoint: 'bookmarks',
    queries: {
      filters: `folder[not_exists][and]userId[equals]${session.user.email}`,
      orders: '-createdAt',
      limit: 100,
      depth: 1,
    },
  });
  return bookmarks.contents;
};

// getDefaultFolderId関数は不要になったので削除