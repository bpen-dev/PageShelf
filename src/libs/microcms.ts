import { createClient } from 'microcms-js-sdk';

// ブックマークの型定義
export type Bookmark = {
  id: string;
  url: string;
  title: string;
  description: string;
  tags: { id: string; name: string }[];
};

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error('MICROCMS_SERVICE_DOMAIN is required');
}
if (!process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_API_KEY is required');
}

// APIクライアントの初期化
export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

// ブックマーク一覧を取得
export const getBookmarks = async () => {
  const bookmarks = await client.getList<Bookmark>({
    endpoint: 'bookmarks',
    queries: { orders: '-createdAt', limit: 100 }, // 作成日の降順で100件まで取得
  });
  return bookmarks.contents;
};

// IDを指定してブックマークを1件取得
export const getBookmarkDetail = async (contentId: string) => {
  const bookmark = await client.get<Bookmark>({
    endpoint: 'bookmarks',
    contentId,
  });
  return bookmark;
};