'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './index.module.css';
import { type Bookmark, type Folder } from '@/libs/microcms';
import { FiExternalLink, FiEdit2, FiMove, FiFolder as FolderIcon } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useClickOutside } from '@/hooks/useClickOutside';

type Props = {
  bookmark: Bookmark;
  allFolders: Folder[];
};

export default function BookmarkCard({ bookmark, allFolders }: Props) {
  const router = useRouter();
  const [folderMenuOpen, setFolderMenuOpen] = useState(false);
  const [colorMenuOpen, setColorMenuOpen] = useState(false);

  const folderMenuRef = useClickOutside<HTMLDivElement>(() => setFolderMenuOpen(false));
  const colorMenuRef = useClickOutside<HTMLDivElement>(() => setColorMenuOpen(false));

  const handleFolderChange = async (newFolder: Folder | null) => {
    await fetch(`/api/bookmarks/${bookmark.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder: newFolder ? newFolder.id : null }),
    });
    setFolderMenuOpen(false);
    toast.success(`「${newFolder ? newFolder.name : '未分類'}」に移動しました`);
    router.refresh();
  };

  const handleColorChange = async (newColor: string | null) => {
    await fetch(`/api/bookmarks/${bookmark.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ color: newColor }),
    });
    setColorMenuOpen(false);
    toast.success('カラーを変更しました');
    router.refresh();
  };

  const colors = ['red', 'blue', 'green', 'yellow', 'gray'];

  // 👇 [修正点1] どちらかのメニューが開いていれば true になる変数を定義
  const isAnyMenuOpen = folderMenuOpen || colorMenuOpen;

  return (
    // 👇 [修正点2] メニューが開いていれば .activeCard クラスを追加
    <article className={`${styles.card} ${styles[bookmark.color || 'default']} ${isAnyMenuOpen ? styles.activeCard : ''}`}>
      <div className={styles.faviconContainer}>
        <Image 
          src={`https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(bookmark.url)}`}
          width={24}
          height={24}
          alt=""
          className={styles.favicon}
        />
      </div>

      <div className={styles.mainContent}>
        <h2 className={styles.title}>{bookmark.title}</h2>
        <p className={styles.url}>{bookmark.url}</p>
        {bookmark.description && <p className={styles.description}>{bookmark.description}</p>}
      </div>

      <div className={styles.metaContent}>
        {bookmark.folder && (
          <Link href={`/folders/${bookmark.folder.id}`} className={styles.folder}>
            <FolderIcon size={14} /> {bookmark.folder.name}
          </Link>
        )}
      </div>

      <div className={styles.actions}>
        <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className={styles.actionButton} title="サイトへ">
          <FiExternalLink />
        </a>
        <Link href={`/bookmarks/${bookmark.id}/edit`} className={styles.actionButton} title="編集">
          <FiEdit2 />
        </Link>
        
        <div className={styles.menuWrapper} ref={colorMenuRef}>
          <button onClick={() => setColorMenuOpen(!colorMenuOpen)} className={styles.actionButton} title="カラーを変更">
            <div className={`${styles.colorIndicator} ${styles[bookmark.color || 'noColor']}`}></div>
          </button>
          {colorMenuOpen && (
            <div className={styles.dropdown}>
              <ul>
                {colors.map(c => (
                  <li key={c} onClick={() => handleColorChange(c)} className={styles.dropdownItem}>
                    <div className={`${styles.colorSwatch} ${styles[c]}`}></div> {c}
                  </li>
                ))}
                <li onClick={() => handleColorChange(null)} className={styles.dropdownItem}>
                  <div className={`${styles.colorSwatch} ${styles.noColor}`}></div>
                  色なし
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className={styles.menuWrapper} ref={folderMenuRef}>
          <button onClick={() => setFolderMenuOpen(!folderMenuOpen)} className={styles.actionButton} title="フォルダを移動">
            <FiMove />
          </button>
          {folderMenuOpen && (
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