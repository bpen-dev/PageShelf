import { getBookmarks, getFolders } from '@/libs/microcms'; // 👈 getTagsをgetFoldersに変更
import BookmarkCard from './components/BookmarkCard';
import styles from './page.module.css';
import BookmarkForm from './components/BookmarkForm'; 
import { type Bookmark } from '@/libs/microcms';

export default async function Home() {
  const bookmarks = await getBookmarks();
  const allFolders = await getFolders(); // 👈 allTagsをallFoldersに変更

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>My Bookmarks</h1>
      
      <div className={styles.formContainer}>
        {/* フォームに全フォルダのデータを渡す */}
        <BookmarkForm allFolders={allFolders} /> 
      </div>

      <div className={styles.grid}>
        {bookmarks.map((bookmark: Bookmark) => (
          <BookmarkCard key={bookmark.id} bookmark={bookmark} />
        ))}
      </div>
    </main>
  );
}