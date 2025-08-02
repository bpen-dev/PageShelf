import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import { Toaster } from "react-hot-toast";
import { getFolders } from "@/utils/supabase/queries"; // 👈 新しい関数をインポート

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
        <Toaster position="top-center" reverseOrder={false} />
        <div className="container">
          <aside className="sidebar">
            <Sidebar allFolders={allFolders} />
          </aside>
          <main className="mainContent">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}