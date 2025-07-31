import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar"; // 👈 Sidebarをインポート
import { getFolders } from "@/libs/microcms"; // 👈 getFoldersをインポート

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bookmark App",
  description: "A simple bookmark management app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const allFolders = await getFolders(); // 👈 全てのフォルダを取得

  return (
    <html lang="ja">
      <body className={inter.className}>
        <div style={{ display: 'flex' }}>
          <Sidebar allFolders={allFolders} /> {/* 👈 Sidebarを配置 */}
          <main style={{ flex: 1, padding: '2rem' }}>
            {children} {/* 👈 ここに各ページの内容が表示される */}
          </main>
        </div>
      </body>
    </html>
  );
}