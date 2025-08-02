import { createClient } from './server';
import 'server-only'; // このファイルがサーバーサイドでのみ使われることを保証

// --- 型定義 ---
export type Folder = {
  id: number;
  created_at: string;
  name: string;
  user_id: string;
};

export type Bookmark = {
  id: number;
  created_at: string;
  url: string;
  title: string;
  description?: string;
  color?: string[];
  is_favorite?: boolean;
  user_id: string;
  folder_id?: number;
  folders?: Folder; // フォルダ情報をJOINした時のため
};

// --- データ取得関数 ---

// フォルダ一覧を取得
export const getFolders = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: folders, error } = await supabase
    .from('folders')
    .select('*')
    .order('created_at', { ascending: true });
    
  if (error) {
    console.error('Error fetching folders:', error);
    return [];
  }
  return folders;
};

// 全てのブックマークを取得
export const getBookmarks = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: bookmarks, error } = await supabase
    .from('bookmarks')
    .select('*, folders (id, name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookmarks:', error);
    return [];
  }
  return bookmarks;
};

// フォルダ内のブックマークを取得
export const getBookmarksByFolder = async (folderId: string) => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: bookmarks, error } = await supabase
    .from('bookmarks')
    .select('*, folders (id, name)')
    .eq('folder_id', folderId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookmarks by folder:', error);
    return [];
  }
  return bookmarks;
};

// 未分類のブックマークを取得
export const getUnclassifiedBookmarks = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: bookmarks, error } = await supabase
    .from('bookmarks')
    .select('*, folders (id, name)')
    .is('folder_id', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching unclassified bookmarks:', error);
    return [];
  }
  return bookmarks;
};