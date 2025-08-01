'use client';

import Link from 'next/link';
import Image from 'next/image'; // 👈 Imageをインポート
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './index.module.css';
import { type Bookmark, type Folder } from '@/libs/microcms';
import { FiExternalLink, FiEdit2, FiMove, FiFolder as FolderIcon } from 'react-icons/fi';
import toast from 'react-hot-toast'; // 👈 toastをインポート

type Props = {
  bookmark: Bookmark;
  allFolders: Folder[];
};

export default function BookmarkCard({ bookmark, allFolders }: Props) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleFolderChange = async (newFolder: Folder | null) => {
    await fetch(`/api/bookmarks/${bookmark.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder: newFolder ? newFolder.id : null }),
    });
    setIsMenuOpen(false);
    toast.success(`「${newFolder ? newFolder.name : '未分類'}」に移動しました`); // 👈 通知を追加
    router.refresh();
  };

  return (
    <article className={styles.card}>
      <div>
        <div className={styles.titleContainer}>
          {/* 👇 ファビコン表示を追加 */}
          <Image 
            src={`https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(bookmark.url)}`}
            width={16}
            height={16}
            alt=""
            className={styles.favicon}
          />
          <h2 className={styles.title}>{bookmark.title}</h2>
        </div>
        <p className={styles.url}>{bookmark.url}</p>
        <p className={styles.description}>{bookmark.description || ''}</p>
        
        <div className={styles.folderWrapper}>
          {bookmark.folder && (
            <Link href={`/folders/${bookmark.folder.id}`} className={styles.folder}>
              <FolderIcon size={14} /> {bookmark.folder.name}
            </Link>
          )}
        </div>
      </div>
      
      <div className={styles.actions}>
        <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className={styles.button}>
          <FiExternalLink size={14} />サイトへ
        </a>
        <Link href={`/bookmarks/${bookmark.id}/edit`} className={styles.button}>
          <FiEdit2 size={14} />編集
        </Link>
        
        <div className={styles.folderMenu}>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={styles.button} title="フォルダを移動">
            <FiMove size={14} />移動
          </button>
          {isMenuOpen && (
            <div className={styles.dropdown}>
              <ul>
                <li onClick={() => handleFolderChange(null)} className={styles.dropdownItem}>
                  未分類にする
                </li>
                {allFolders.map((folder) => (
                  <li
                    key={folder.id}
                    onClick={() => handleFolderChange(folder)}
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