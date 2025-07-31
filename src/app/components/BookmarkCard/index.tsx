'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react'; // 👈 useStateをインポート
import styles from './index.module.css';
import { type Bookmark, type Folder } from '@/libs/microcms';

type Props = {
  bookmark: Bookmark;
  allFolders: Folder[];
};

export default function BookmarkCard({ bookmark, allFolders }: Props) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 👈 ドロップダウンの表示状態を管理

  // フォルダが選択されたときに実行される関数
  const handleFolderChange = async (newFolderId: string | null) => {
    await fetch(`/api/bookmarks/${bookmark.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder: newFolderId }),
    });
    setIsMenuOpen(false); // メニューを閉じる
    router.refresh();
  };

  return (
    <article className={styles.card}>
      <div>
        <h2 className={styles.title}>{bookmark.title}</h2>
        <p className={styles.url}>{bookmark.url}</p>
        <p className={styles.description}>{bookmark.description || ''}</p>
        
        <div className={styles.folderWrapper}>
          {bookmark.folder && (
            <Link href={`/folders/${bookmark.folder.id}`} className={styles.folder}>
              {bookmark.folder.name}
            </Link>
          )}
        </div>
      </div>
      
      <div className={styles.actions}>
        <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className={styles.button}>サイトへ</a>
        <Link href={`/bookmarks/${bookmark.id}/edit`} className={styles.button}>
          編集
        </Link>
        
        {/* 👇 フォルダ変更用のドロップダウンメニュー */}
        <div className={styles.folderMenu}>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={styles.button}>
            フォルダ
          </button>
          {isMenuOpen && (
            <div className={styles.dropdown}>
              <ul>
                {/* 「未分類」に戻すための選択肢 */}
                <li onClick={() => handleFolderChange(null)} className={styles.dropdownItem}>
                  未分類にする
                </li>
                {allFolders.map((folder) => (
                  <li
                    key={folder.id}
                    onClick={() => handleFolderChange(folder.id)}
                    className={styles.dropdownItem}
                  >
                    {folder.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}