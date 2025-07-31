import Link from 'next/link';
import { type Folder } from '@/libs/microcms';
import styles from './index.module.css';

type Props = {
  allFolders: Folder[];
};

export default function Sidebar({ allFolders }: Props) {
  return (
    <aside className={styles.sidebar}>
      <nav>
        <ul className={styles.list}>
          <li>
            <Link href="/" className={styles.link}>
              すべてのブックマーク
            </Link>
          </li>
          <li>
            <Link href="/folders/unclassified" className={styles.link}>
              未分類
            </Link>
          </li>
        </ul>
        <hr className={styles.divider} />
        <ul className={styles.list}>
          {allFolders.map((folder) => (
            <li key={folder.id}>
              <Link href={`/folders/${folder.id}`} className={styles.link}>
                {folder.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}