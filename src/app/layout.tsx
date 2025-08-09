'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import MobileHeader from "./components/MobileHeader";
import { FiLoader } from "react-icons/fi";
import { useRouter } from "next/navigation";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { Suspense } from "react";
import { DataProvider, useData } from "@/context/DataContext"; // 👈 Contextをインポート

const inter = Inter({ subsets: ["latin"] });

// ログイン状態に応じてUIを管理するコンポーネント
function AppContent({ children }: { children: React.ReactNode }) {
  const { setAllFolders, setBookmarks } = useData(); // 👈 Contextから更新関数を取得
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    
    // データを取得する関数
    const fetchData = async () => {
      const { data: foldersData } = await supabase.from('folders').select('*').order('created_at', { ascending: true });
      const { data: bookmarksData } = await supabase.from('bookmarks').select('*, folders(id, name)').order('created_at', { ascending: false });
      setAllFolders(foldersData || []);
      setBookmarks(bookmarksData || []);
    };

    // ログイン状態を確認する関数
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userIsLoggedIn = !!session;
      setIsLoggedIn(userIsLoggedIn);

      if (userIsLoggedIn) {
        await fetchData();
      }
      setIsLoading(false);
    };

    checkSession();

    // ログイン状態の変化を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const userIsLoggedIn = !!session;
      setIsLoggedIn(userIsLoggedIn);
      
      if (userIsLoggedIn) {
        fetchData(); // ログインしたらデータを取得
      } else {
        setAllFolders([]); // ログアウトしたらデータをクリア
        setBookmarks([]);
        router.push('/'); // ランディングページに戻る
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, setAllFolders, setBookmarks]);

  if (isLoading) {
    return (
      <div className="loadingScreen">
        <FiLoader className="loadingIcon" />
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="container">
        <aside className="sidebar">
          <Sidebar />
        </aside>
        {isMobileMenuOpen && (
          <div 
            className="mobileSidebarOverlay" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        <div className={`mobileSidebar ${isMobileMenuOpen ? 'isOpen' : ''}`}>
          <Sidebar />
        </div>
        <main className="mainContent">
          <MobileHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
          {children}
        </main>
      </div>
    );
  }

  return <>{children}</>;
}

// アプリケーション全体のエントリーポイント
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Suspense>
          <GoogleAnalytics />
        </Suspense>
        <Toaster position="top-center" reverseOrder={false} />
        {/* DataProviderで全体をラップ */}
        <DataProvider>
          <AppContent>{children}</AppContent>
        </DataProvider>
      </body>
    </html>
  );
}