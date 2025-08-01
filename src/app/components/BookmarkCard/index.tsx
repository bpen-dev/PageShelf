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
import EditModal from '../EditModal'; 

type Props = {
  bookmark: Bookmark;
  allFolders: Folder[];
};

export default function BookmarkCard({ bookmark, allFolders }: Props) {
  const router = useRouter();
  const [folderMenuOpen, setFolderMenuOpen] = useState(false);
  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 

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

  return (
    <>
      <article className={`${styles.card} ${styles[bookmark.color?.[0] || 'default']}`}>
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
          {/* 👇 Linkをbuttonに変更 */}
          <button onClick={() => setIsEditModalOpen(true)} className={styles.actionButton} title="編集">
            <FiEdit2 />
          </button>
          
          {/* ... (カラーピッカーとフォルダ移動メニューは変更なし) ... */}
        </div>
      </article>

      {/* 👇 モーダルを開閉stateに応じて表示 */}
      {isEditModalOpen && (
        <EditModal 
          bookmark={bookmark} 
          allFolders={allFolders} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}
    </>
  );
}