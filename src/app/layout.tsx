import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import { getFolders } from "@/libs/microcms";
import AuthProvider from "./components/AuthProvider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Toaster } from "react-hot-toast";

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
  const session = await getServerSession(authOptions);
  const allFolders = await getFolders(session);

  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <div className="container">
            <aside className="sidebar">
              <Sidebar allFolders={allFolders} />
            </aside>
            <main className="mainContent">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}