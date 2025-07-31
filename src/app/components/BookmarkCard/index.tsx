import Link from 'next/link';
import styles from './index.module.css';
import { type Bookmark } from '@/libs/microcms';

type Props = {
  bookmark: Bookmark;
};

export default function BookmarkCard({ bookmark }: Props) {
  return (
    <article className={styles.card}>
      <div>
        <h2 className={styles.title}>{bookmark.title}</h2>
        <p className={styles.url}>{bookmark.url}</p>
        <p className={styles.description}>{bookmark.description || ''}</p>
        
        {/* 👇 [修正点] タグ表示をフォルダ表示に変更 */}
        <div className={styles.folderWrapper}>
          {bookmark.folder && (
            <span className={styles.folder}>{bookmark.folder.name}</span>
          )}
        </div>
      </div>
      
      <div className={styles.actions}>
        <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className={styles.button}>サイトへ</a>
        <Link href={`/bookmarks/${bookmark.id}/edit`} className={styles.button}>
          編集
        </Link>
      </div>
    </article>
  );
}