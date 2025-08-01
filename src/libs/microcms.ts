import { createClient, type MicroCMSContentId, type MicroCMSDate } from 'microcms-js-sdk';
import { Session } from 'next-auth';

// [修正点1] Folderの型定義を、microCMSのシステムフィールドを含む完全なものにします
export type Folder = {
  name: string;
  userId: string;
} & MicroCMSContentId & MicroCMSDate;

export type Bookmark = {
  url: string;
  title: string;
  description: string;
  folder?: Folder;
  userId: string;
} & MicroCMSContentId & MicroCMSDate;


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
  const newFolder = await client.create({ // client.create<Folder> は不要
    endpoint: 'folders',
    content: { name, userId },
  });
  return newFolder;
};

export const updateFolderName = async (id: string, name: string) => {
  const updatedFolder = await client.update({ // client.update<Folder> は不要
    endpoint: 'folders',
    contentId: id,
    content: { name },
  });
  return updatedFolder;
};

// 👇 [修正点2] エラーの原因となっていた、この関数が不足していました
export const deleteFolder = async (id: string) => {
  await client.delete({
    endpoint: 'folders',
    contentId: id,
  });
};


// --- これ以降の関数はユーザー情報で絞り込む ---
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