import Link from 'next/link';
import styles from './index.module.css';

// 表示するブックマークデータの型を仮で定義しておきます
type Bookmark = {
  id: string;
  url: string;
  title: string;
  description: string;
  tags: { id: string; name: string }[];
};

type Props = {
  bookmark: Bookmark;
};

export default function BookmarkCard({ bookmark }: Props) {
  return (
    <article className={styles.card}>
      <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
        <h2 className={styles.title}>{bookmark.title}</h2>
        <p className={styles.url}>{bookmark.url}</p>
        <p className={styles.description}>{bookmark.description}</p>
        <div className={styles.tags}>
          {bookmark.tags.map((tag) => (
            <span key={tag.id} className={styles.tag}>
              #{tag.name}
            </span>
          ))}
        </div>
      </a>
    </article>
  );
}