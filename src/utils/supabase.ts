import { createBrowserClient } from '@supabase/ssr';
import { User } from '@supabase/supabase-js';

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
  description?: string | null; // 👈 nullを許容
  color?: string | null;       // 👈 nullを許容
  is_favorite?: boolean;
  user_id: string;
  folder_id?: number | null;   // 👈 nullを許容するように変更
  folders?: Folder | null;     // 👈 nullを許容するように変更
};


// --- ブラウザ用クライアント ---
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createBrowserClient(supabaseUrl, supabaseKey);
}

// --- データ取得関数 ---
const supabase = createClient();

// フォルダ一覧を取得
export const getFolders = async () => {
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
  const { data: bookmarks, error } = await supabase
    .from('bookmarks')
    .select('*, folders (id, name)') // フォルダ情報も一緒に取得
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching bookmarks:', error);
    return [];
  }
  return bookmarks;
};

// フォルダ内のブックマークを取得
export const getBookmarksByFolder = async (folderId: number) => {
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

// 現在のユーザーを取得する
export const getUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}