import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import { getFolders } from "@/libs/microcms";
import AuthProvider from "./components/AuthProvider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";

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
  const session = await getServerSession(authOptions); // 👈 セッションを取得
  const allFolders = await getFolders(session); // 👈 取得したセッションを渡す

  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>
          <div style={{ display: 'flex' }}>
            <Sidebar allFolders={allFolders} />
            <main style={{ flex: 1, padding: '2rem' }}>
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}