import { getBookmarks, getFolders, type Bookmark } from '@/libs/microcms';
import BookmarkCard from './components/BookmarkCard';
import styles from './page.module.css';
import BookmarkForm from './components/BookmarkForm'; 

export default async function Home() {
  const bookmarks = await getBookmarks();
  const allFolders = await getFolders();

  return (
    <>
      <h1 className={styles.title}>すべてのブックマーク</h1>
      
      <div className={styles.grid}>
        {bookmarks.map((bookmark: Bookmark) => (
          <BookmarkCard key={bookmark.id} bookmark={bookmark} allFolders={allFolders} />
        ))}
      </div>

      {/* 👇 フォームの位置を一覧の下に移動 */}
      <div className={styles.formContainer}>
        <BookmarkForm allFolders={allFolders} /> 
      </div>
    </>
  );
}