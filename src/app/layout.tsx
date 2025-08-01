import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import { getFolders } from "@/libs/microcms";
import AuthProvider from "./components/AuthProvider"; // 👈 AuthProviderをインポート

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
  const allFolders = await getFolders();

  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider> {/* 👈 AuthProviderで全体を囲む */}
          <div style={{ display: 'flex' }}>
            <Sidebar allFolders={allFolders} />
            <main style={{ flex: 1, padding: '2rem' }}>
              {children}
            </main>
          </div>
        </AuthProvider> {/* 👈 AuthProviderで全体を囲む */}
      </body>
    </html>
  );
}