import { createClient, type MicroCMSContentId, type MicroCMSDate } from 'microcms-js-sdk';

export type Tag = {
  name: string;
} & MicroCMSContentId & MicroCMSDate;

export type Bookmark = {
  url: string;
  title: string;
  description: string;
  tags: Tag[];
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

export const getTags = async () => {
  const tags = await client.getList<Tag>({
    endpoint: 'tags',
    queries: { limit: 100 },
  });
  return tags.contents;
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

export const getBookmarksByTag = async (tagId: string) => {
  const bookmarks = await client.getList<Bookmark>({
    endpoint: 'bookmarks',
    queries: {
      filters: `tags[contains]${tagId}`,
      orders: '-createdAt',
      limit: 100,
      depth: 1,
    },
  });
  return bookmarks.contents;
};