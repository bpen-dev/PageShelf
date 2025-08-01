import { getBookmarks, getFolders, type Bookmark } from '@/libs/microcms';
import BookmarkCard from './components/BookmarkCard';
import styles from './page.module.css';
import BookmarkForm from './components/BookmarkForm';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]/route';
import { FiInbox } from 'react-icons/fi';
import emptyStateStyles from '@/app/empty.module.css';

export default async function Home() {
  const session = await getServerSession(authOptions);
  const bookmarks = await getBookmarks(session);
  const allFolders = await getFolders(session);

  if (!session) {
    return (
      <div className="scrollableArea">
        <h1 className={styles.headerTitle}>ようこそ！</h1>
        <p>ログインすると、ブックマークの管理ができます。</p>
      </div>
    );
  }

  return (
    <>
      {/* --- 画面上部に固定されるヘッダーエリア --- */}
      <div className="fixedHeader">
        <h1 className={styles.headerTitle}>すべてのブックマーク</h1>
      </div>

      {/* --- スクロールするエリア --- */}
      <div className="scrollableArea">
        {bookmarks.length === 0 ? (
          <div className={emptyStateStyles.emptyState}>
            <FiInbox size={48} className={emptyStateStyles.icon} />
            <h2 className={emptyStateStyles.title}>まだブックマークがありません</h2>
            <p className={emptyStateStyles.text}>下のフォームから最初のブックマークを追加してみましょう！</p>
          </div>
        ) : (
          <div className={styles.listContainer}>
            {bookmarks.map((bookmark: Bookmark) => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} allFolders={allFolders} />
            ))}
          </div>
        )}
      </div>

      {/* --- 画面下に固定されるエリア --- */}
      <div className="fixedFormArea">
        <BookmarkForm allFolders={allFolders} /> 
      </div>
    </>
  );
}