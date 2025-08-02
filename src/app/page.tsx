import { getBookmarks, getFolders, type Bookmark } from '@/utils/supabase/queries';
import BookmarkCard from './components/BookmarkCard';
import styles from './page.module.css';
import BookmarkForm from './components/BookmarkForm';
import { FiInbox } from 'react-icons/fi';
import emptyStateStyles from '@/app/empty.module.css';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const bookmarks = await getBookmarks();
  const allFolders = await getFolders();

  if (!user) {
    return (
      <div className="scrollableArea">
        <div className="fixedHeader">
          <h1 className={styles.headerTitle}>ようこそ！</h1>
        </div>
        <div style={{ padding: '2rem' }}>
          <p>ログインすると、ブックマークの管理ができます。</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixedHeader">
        <h1 className={styles.headerTitle}>すべてのブックマーク</h1>
      </div>
      <div className="scrollableArea">
        {bookmarks.length === 0 ? (
          <div className={emptyStateStyles.emptyState}>
            <FiInbox size={48} className={emptyStateStyles.icon} />
            <h2 className={emptyStateStyles.title}>まだブックマークがありません</h2>
            <p className={emptyStateStyles.text}>下のフォームから最初のブックマークを追加してみましょう！</p>
          </div>
        ) : (
          <div className={styles.listContainer}>
            {bookmarks.map((bookmark) => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} allFolders={allFolders} />
            ))}
          </div>
        )}
      </div>
      <div className="fixedFormArea">
        <BookmarkForm allFolders={allFolders} /> 
      </div>
    </>
  );
}