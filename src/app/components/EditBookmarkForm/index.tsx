'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { type Bookmark, type Folder } from '@/utils/supabase/queries';
import styles from './index.module.css';
import toast from 'react-hot-toast';

type Props = {
  bookmark: Bookmark;
  allFolders: Folder[];
  onClose: () => void; // モーダルを閉じる関数を受け取る
};

export default function EditBookmarkForm({ bookmark, allFolders, onClose }: Props) {
  const [url, setUrl] = useState(bookmark.url);
  const [title, setTitle] = useState(bookmark.title);
  const [description, setDescription] = useState(bookmark.description || '');
  const [selectedFolder, setSelectedFolder] = useState(bookmark.folder_id?.toString() || '');
  const [color, setColor] = useState(bookmark.color || '');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await fetch(`/api/bookmarks/${bookmark.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        url, 
        title, 
        description, 
        folder_id: selectedFolder || null, 
        color: color || null 
      }),
    });
    setIsLoading(false);
    toast.success('更新しました');
    onClose(); // ページ遷移の代わりにモーダルを閉じる
    router.refresh();
  };
  
  const handleDelete = async () => {
    if (!window.confirm('本当にこのブックマークを削除しますか？')) {
      return;
    }
    setIsLoading(true);
    await fetch(`/api/bookmarks/${bookmark.id}`, {
      method: 'DELETE',
    });
    setIsLoading(false);
    toast.success('削除しました');
    onClose(); // ページ遷移の代わりにモーダルを閉じる
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="url" className={styles.label}>URL</label>
        <input type="url" id="url" value={url} onChange={(e) => setUrl(e.target.value)} required className={styles.input} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>タイトル</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className={styles.input} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>メモ</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className={styles.textarea} />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="folder" className={styles.label}>フォルダ</label>
        <select
          id="folder"
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
          className={styles.input}
        >
          <option value="">未分類</option>
          {allFolders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>カラー</label>
        <div className={styles.colorGroup}>
          <div className={styles.colorItem}>
            <input
              type="radio"
              id="color-edit-none"
              name="color"
              value=""
              checked={color === ''}
              onChange={(e) => setColor(e.target.value)}
            />
            <label htmlFor="color-edit-none" className={`${styles.colorLabel} ${styles.noColor}`}></label>
          </div>
          {['red', 'blue', 'green', 'yellow', 'gray'].map((c) => (
            <div key={c} className={styles.colorItem}>
              <input
                type="radio"
                id={`color-edit-${c}`}
                name="color"
                value={c}
                checked={color === c}
                onChange={(e) => setColor(e.target.value)}
              />
              <label htmlFor={`color-edit-${c}`} className={`${styles.colorLabel} ${styles[c]}`}></label>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={onClose} className={styles.cancelButton}>
          キャンセル
        </button>
        <button type="button" onClick={handleDelete} disabled={isLoading} className={`${styles.button} ${styles.deleteButton}`}>
          削除
        </button>
        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? '保存中...' : '保存'}
        </button>
      </div>
    </form>
  );
}