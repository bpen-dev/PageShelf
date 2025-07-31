import { getBookmarks, getFolders } from '@/libs/microcms'; // 👈 getTagsをgetFoldersに変更
import BookmarkCard from './components/BookmarkCard';
import styles from './page.module.css';
import BookmarkForm from './components/BookmarkForm'; 
import { type Bookmark } from '@/libs/microcms';

export default async function Home() {
  const bookmarks = await getBookmarks();
  const allFolders = await getFolders();

  return (
    <>
      <h1 className={styles.title}>すべてのブックマーク</h1>
      <div className={styles.formContainer}>
        <BookmarkForm allFolders={allFolders} /> 
      </div>
      <div className={styles.grid}>
        {bookmarks.map((bookmark: Bookmark) => (
          // 👇 allFoldersをBookmarkCardに渡す
          <BookmarkCard key={bookmark.id} bookmark={bookmark} allFolders={allFolders} />
        ))}
      </div>
    </>
  );
}