import { getBookmarks, getFolders, type Bookmark } from '@/libs/microcms';
import BookmarkCard from './components/BookmarkCard';
import styles from './page.module.css';
import BookmarkForm from './components/BookmarkForm';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function Home() {
  const session = await getServerSession(authOptions); // 👈 セッションを取得
  const bookmarks = await getBookmarks(session); // 👈 sessionを渡す
  const allFolders = await getFolders(session); // 👈 sessionを渡す

  if (!session) {
    return (
      <div>
        <h1 className={styles.title}>ようこそ！</h1>
        <p>ログインすると、ブックマークの管理ができます。</p>
      </div>
    );
  }

  return (
    <>
      <h1 className={styles.title}>すべてのブックマーク</h1>
      <div className={styles.grid}>
        {bookmarks.map((bookmark: Bookmark) => (
          <BookmarkCard key={bookmark.id} bookmark={bookmark} allFolders={allFolders} />
        ))}
      </div>
      <div className={styles.formContainer}>
        <BookmarkForm allFolders={allFolders} /> 
      </div>
    </>
  );
}