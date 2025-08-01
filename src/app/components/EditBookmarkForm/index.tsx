'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { type Bookmark, type Folder } from '@/libs/microcms';
import styles from './index.module.css';

type Props = {
  bookmark: Bookmark;
  allFolders: Folder[];
};

export default function EditBookmarkForm({ bookmark, allFolders }: Props) {
  const [url, setUrl] = useState(bookmark.url);
  const [title, setTitle] = useState(bookmark.title);
  const [description, setDescription] = useState(bookmark.description || '');
  const [selectedFolder, setSelectedFolder] = useState(bookmark.folder?.id || '');
  const [color, setColor] = useState(bookmark.color || ''); // 👈 色用のstateを追加
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await fetch(`/api/bookmarks/${bookmark.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      // 👇 bodyにcolorを追加
      body: JSON.stringify({ url, title, description, folder: selectedFolder || null, color }),
    });
    setIsLoading(false);
    router.push('/');
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
    router.push('/');
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
          <option value="">フォルダを選択...</option>
          {allFolders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
      </div>

      {/* 👇 色選択用のラジオボタンを追加 */}
      <div className={styles.formGroup}>
        <label className={styles.label}>カラー</label>
        <div className={styles.colorGroup}>
          {['red', 'blue', 'green', 'yellow', 'gray'].map((c) => (
            <div key={c} className={styles.colorItem}>
              <input
                type="radio"
                id={`color-${c}`}
                name="color"
                value={c}
                checked={color === c}
                onChange={(e) => setColor(e.target.value)}
              />
              <label htmlFor={`color-${c}`} className={`${styles.colorLabel} ${styles[c]}`}></label>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button type="submit" disabled={isLoading} className={styles.button}>
          更新
        </button>
        <button type="button" onClick={handleDelete} disabled={isLoading} className={`${styles.button} ${styles.deleteButton}`}>
          削除
        </button>
      </div>
    </form>
  );
}