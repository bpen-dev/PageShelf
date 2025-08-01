'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './index.module.css';
import { type Bookmark, type Folder } from '@/libs/microcms';
import { FiExternalLink, FiEdit2, FiCopy, FiTrash2, FiFolder as FolderIcon } from 'react-icons/fi';
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

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.stopPropagation(); // リンクへの遷移を防ぐ
    navigator.clipboard.writeText(bookmark.url);
    toast.success('URLをコピーしました');
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // リンクへの遷移を防ぐ
    if (!window.confirm(`「${bookmark.title}」を削除しますか？`)) {
      return;
    }
    await fetch(`/api/bookmarks/${bookmark.id}`, {
      method: 'DELETE',
    });
    toast.success('削除しました');
    router.refresh();
  };
  
  const openEditModal = (e: React.MouseEvent) => {
    e.stopPropagation(); // リンクへの遷移を防ぐ
    setIsEditModalOpen(true);
  };

  const colors = ['red', 'blue', 'green', 'yellow', 'gray'];
  const isAnyMenuOpen = folderMenuOpen || colorMenuOpen;

  return (
    <>
      <article className={`${styles.card} ${styles[bookmark.color?.[0] || 'default']} ${isAnyMenuOpen ? styles.activeCard : ''}`}>
        {/* 👇 [修正点1] ファビコンからフォルダ名までを全て a タグで囲む */}
        <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className={styles.mainLink}>
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
              <Link
                href={`/folders/${bookmark.folder.id}`}
                className={styles.folder}
                title={`「${bookmark.folder.name}」フォルダを見る`}
                onClick={(e) => e.stopPropagation()} // リンクへの遷移を防ぐ
              >
                <FolderIcon size={16} /> 
                <span>{bookmark.folder.name}</span>
              </Link>
            )}
          </div>
        </a>

        {/* 👇 [修正点2] actionsのボタンは a タグの外側に配置 */}
        <div className={styles.actions}>
          <button onClick={handleCopyUrl} className={styles.actionButton} title="URLをコピー">
            <FiCopy size={18} />
          </button>
          <button onClick={openEditModal} className={styles.actionButton} title="編集">
            <FiEdit2 size={18}/>
          </button>
          
          <div className={styles.menuWrapper} ref={colorMenuRef}>
            <button onClick={(e) => { e.stopPropagation(); setColorMenuOpen(!colorMenuOpen); }} className={styles.actionButton} title="カラーを変更">
              <div className={`${styles.colorIndicator} ${styles[bookmark.color?.[0] || 'noColor']}`}></div>
            </button>
            {colorMenuOpen && (
              <div className={styles.dropdown} onClick={(e) => e.stopPropagation()}>
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
            <button onClick={(e) => { e.stopPropagation(); setFolderMenuOpen(!folderMenuOpen); }} className={styles.actionButton} title="フォルダを移動">
              <FolderIcon size={18}/>
            </button>
            {folderMenuOpen && (
              <div className={styles.dropdown} onClick={(e) => e.stopPropagation()}>
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
          
          <button onClick={handleDelete} className={styles.actionButton} title="削除">
            <FiTrash2 size={18}/>
          </button>
        </div>
      </article>

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