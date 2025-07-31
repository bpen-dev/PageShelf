import { getBookmarks, getTags, type Bookmark } from '@/libs/microcms';
import BookmarkCard from './components/BookmarkCard';
import styles from './page.module.css';
import BookmarkForm from './components/BookmarkForm'; 

export default async function Home() {
  const bookmarks = await getBookmarks();
  const allTags = await getTags();

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>My Bookmarks</h1>
      
      <div className={styles.formContainer}>
        <BookmarkForm allTags={allTags} />
      </div>

      <div className={styles.grid}>
        {bookmarks.map((bookmark: Bookmark) => (
          <BookmarkCard key={bookmark.id} bookmark={bookmark} />
        ))}
      </div>
    </main>
  );
}