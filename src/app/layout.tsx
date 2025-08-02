'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Folder } from "@/utils/supabase/queries";
import MobileHeader from "./components/MobileHeader";
import { FiLoader } from "react-icons/fi";
import { useRouter } from "next/navigation"; // 👈 useRouterをインポート
import GoogleAnalytics from "./components/GoogleAnalytics"; // 👈 GAをインポート
import { Suspense } from "react"; // 👈 Suspenseをインポート

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [allFolders, setAllFolders] = useState<Folder[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    
    // 最初に一度だけ、現在のセッションを確認する
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userIsLoggedIn = !!session;
      setIsLoggedIn(userIsLoggedIn);

      if (userIsLoggedIn) {
        const { data: folders } = await supabase.from('folders').select('*');
        setAllFolders(folders || []);
      }
      setIsLoading(false); // 確認が終わったらローディングを解除
    };

    checkInitialSession();

    // ログイン状態の変化を監視する
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const userIsLoggedIn = !!session;
      setIsLoggedIn(userIsLoggedIn);
      
      if (!userIsLoggedIn) {
        setAllFolders([]);
      }
      // ログイン状態が変化したら、サーバー側の情報と同期するためにリフレッシュ
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]); // 依存配列をrouterに変更

  if (isLoading) {
    return (
      <html lang="ja">
        <body className={inter.className}>
          <div className="loadingScreen">
            <FiLoader className="loadingIcon" />
          </div>
        </body>
      </html>
    );
  }

  if (isLoggedIn) {
    // --- ログインしているユーザー向けのレイアウト ---
    return (
      <html lang="ja">
        <body className={inter.className}>
          <Suspense>
          <GoogleAnalytics />
          </Suspense>
          <Toaster position="top-center" reverseOrder={false} />
          <div className="container">
            <aside className="sidebar">
              <Sidebar allFolders={allFolders} />
            </aside>
            {isMobileMenuOpen && (
              <div 
                className="mobileSidebarOverlay" 
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}
            <div className={`mobileSidebar ${isMobileMenuOpen ? 'isOpen' : ''}`}>
              <Sidebar allFolders={allFolders} />
            </div>
            <main className="mainContent">
              <MobileHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
              {children}
            </main>
          </div>
        </body>
      </html>
    );
  }

  // --- ログインしていないユーザー向けのレイアウト ---
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Toaster position="top-center" reverseOrder={false} />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}