import { createClient, type MicroCMSContentId, type MicroCMSDate } from 'microcms-js-sdk';

export type Folder = {
  name: string;
} & MicroCMSContentId & MicroCMSDate;

export type Bookmark = {
  url: string;
  title: string;
  description: string;
  folder?: Folder; // フォルダは任意なので '?' をつけます
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

export const getFolders = async () => {
  const folders = await client.getList<Folder>({
    endpoint: 'folders',
    queries: { limit: 100 },
  });
  return folders.contents;
};

export const getBookmarks = async () => {
  const bookmarks = await client.getList<Bookmark>({
    endpoint: 'bookmarks',
    queries: { orders: '-createdAt', limit: 100, depth: 1 },
  });
  return bookmarks.contents;
};

export const getBookmarkDetail = async (contentId: string) => {
  const bookmark = await client.get<Bookmark>({
    endpoint: 'bookmarks',
    contentId,
    queries: { depth: 1 },
  });
  return bookmark;
};

// フォルダIDでブックマークを絞り込み取得
export const getBookmarksByFolder = async (folderId: string) => {
  const bookmarks = await client.getList<Bookmark>({
    endpoint: 'bookmarks',
    queries: {
      filters: `folder[equals]${folderId}`, // 👈 フォルダIDで絞り込み
      orders: '-createdAt',
      limit: 100,
      depth: 1,
    },
  });
  return bookmarks.contents;
};

// 未分類のブックマークを取得
export const getUnclassifiedBookmarks = async () => {
  const bookmarks = await client.getList<Bookmark>({
    endpoint: 'bookmarks',
    queries: {
      filters: 'folder[not_exists]', // 👈 フォルダが未設定のものを取得
      orders: '-createdAt',
      limit: 100,
      depth: 1,
    },
  });
  return bookmarks.contents;
};

// 新しいフォルダを作成する
export const createFolder = async (name: string) => {
  const newFolder = await client.create<Omit<Folder, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'>>({
    endpoint: 'folders',
    content: { name },
  });
  return newFolder;
};

// フォルダ名を更新する
export const updateFolderName = async (id: string, name: string) => {
  const updatedFolder = await client.update<Folder>({
    endpoint: 'folders',
    contentId: id,
    content: { name },
  });
  return updatedFolder;
};

// フォルダを削除する
export const deleteFolder = async (id: string) => {
  await client.delete({
    endpoint: 'folders',
    contentId: id,
  });
};