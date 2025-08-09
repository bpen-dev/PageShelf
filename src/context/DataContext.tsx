'use client';

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import type { Bookmark, Folder } from '@/utils/supabase/queries';

// Contextで管理するデータの型を定義
type DataContextType = {
  bookmarks: Bookmark[];
  setBookmarks: Dispatch<SetStateAction<Bookmark[]>>;
  allFolders: Folder[];
  setAllFolders: Dispatch<SetStateAction<Folder[]>>;
};

// Contextを作成
const DataContext = createContext<DataContextType | undefined>(undefined);

// アプリ全体をラップして、データを提供するコンポーネント
export function DataProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [allFolders, setAllFolders] = useState<Folder[]>([]);

  const value = { bookmarks, setBookmarks, allFolders, setAllFolders };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// 他のコンポーネントから簡単にContextのデータを使えるようにするためのカスタムフック
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}