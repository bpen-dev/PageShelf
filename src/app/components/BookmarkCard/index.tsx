'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './index.module.css';
import { type Bookmark, type Folder } from '@/utils/supabase/queries';
import { FiEdit2, FiCopy, FiTrash2, FiFolder as FolderIcon } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useClickOutside } from '@/hooks/useClickOutside';
import EditModal from '../EditModal';
import { useData } from '@/context/DataContext';

type Props = {
  bookmark: Bookmark;
};

export default function BookmarkCard({ bookmark }: Props) {
  const { allFolders, bookmarks, setBookmarks } = useData();
  const [folderMenuOpen, setFolderMenuOpen] = useState(false);
  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const folderMenuRef = useClickOutside<HTMLDivElement>(() => setFolderMenuOpen(false));
  const colorMenuRef = useClickOutside<HTMLDivElement>(() => setColorMenuOpen(false));

  const handleFolderChange = async (newFolder: Folder | null) => {
    const originalBookmarks = bookmarks;
    setBookmarks(prev => prev.map(b => b.id === bookmark.id ? { ...b, folder_id: newFolder?.id ?? null, folders: newFolder } : b));
    setFolderMenuOpen(false);

    const res = await fetch(`/api/bookmarks/${bookmark.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder_id: newFolder ? newFolder.id : null }),
    });
    
    if (res.ok) {
      toast.success(`「${newFolder ? newFolder.name : '未分類'}」に移動しました`);
    } else {
      toast.error('移動に失敗しました');
      setBookmarks(originalBookmarks);
    }
  };

  const handleColorChange = async (newColor: string | null) => {
    const originalBookmarks = bookmarks;
    setBookmarks(prev => prev.map(b => b.id === bookmark.id ? { ...b, color: newColor } : b));
    setColorMenuOpen(false);

    const res = await fetch(`/api/bookmarks/${bookmark.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ color: newColor }),
    });
    
    if (res.ok) {
      toast.success('カラーを変更しました');
    } else {
      toast.error('カラーの変更に失敗しました');
      setBookmarks(originalBookmarks);
    }
  };
  
  const handleCopyUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(bookmark.url);
    toast.success('URLをコピーしました');
  };

  const handleDelete = async (e: React.MouseEvent) => {
    if (!window.confirm(`「${bookmark.title}」を削除しますか？`)) {
      return;
    }
    
    const originalBookmarks = bookmarks;
    setBookmarks(prev => prev.filter(b => b.id !== bookmark.id));

    const res = await fetch(`/api/bookmarks/${bookmark.id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      toast.success('削除しました');
    } else {
      toast.error('削除に失敗しました');
      setBookmarks(originalBookmarks);
    }
  };

  const openEditModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };
  
  const colors = ['red', 'blue', 'green', 'yellow', 'gray'];
  const isAnyMenuOpen = folderMenuOpen || colorMenuOpen;

  return (
    <>
      <article className={`${styles.card} ${styles[bookmark.color || 'default']} ${isAnyMenuOpen ? styles.activeCard : ''}`}>
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
        </a>
        <div className={styles.cardFooter}>
          <div className={styles.metaContent}>
            {bookmark.folders && (
              <div className={styles.folder} title={`「${bookmark.folders.name}」フォルダを見る`}>
                <FolderIcon size={14} /> 
                <span>{bookmark.folders.name}</span>
              </div>
            )}
          </div>
          <div className={styles.actions}>
            <button onClick={handleCopyUrl} className={styles.actionButton} title="URLをコピー">
              <FiCopy />
            </button>
            <button onClick={openEditModal} className={styles.actionButton} title="編集">
              <FiEdit2 />
            </button>
            <div className={styles.menuWrapper} ref={colorMenuRef}>
              <button onClick={(e) => { e.stopPropagation(); setColorMenuOpen(!colorMenuOpen); }} className={styles.actionButton} title="カラーを変更">
                <div className={`${styles.colorIndicator} ${styles[bookmark.color || 'noColor']}`}></div>
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
                <FolderIcon />
              </button>
              {folderMenuOpen && (
                <div className={styles.dropdown} onClick={(e) => e.stopPropagation()}>
                  <ul>
                    <li onClick={() => handleFolderChange(null)} className={styles.dropdownItem}>
                      未分類にする
                    </li>
                    {(allFolders || []).map((folder) => (
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
              <FiTrash2 />
            </button>
          </div>
        </div>
      </article>
      {isEditModalOpen && (
        // 修正点: 不要なpropsを渡さない
        <EditModal 
          bookmark={bookmark} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}
    </>
  );
}