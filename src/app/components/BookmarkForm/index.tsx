'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { type Folder } from '@/libs/microcms';
import styles from './index.module.css';

type Props = {
  allFolders: Folder[];
  currentFolderId?: string;
};

export default function BookmarkForm({ allFolders, currentFolderId }: Props) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(currentFolderId || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingOgp, setIsFetchingOgp] = useState(false); // 👈 OGP取得中フラグを復活
  const router = useRouter();

  // 👇 OGP取得関数を復活
  const handleUrlBlur = async () => {
    if (!url || title) return; // URLが空、または既にタイトルがある場合は何もしない
    try {
      setIsFetchingOgp(true);
      const response = await fetch(`/api/ogp?url=${encodeURIComponent(url)}`);
      if (!response.ok) return;

      const data = await response.json();
      if (data.title) {
        setTitle(data.title);
      }
    } catch (error) {
      console.error('Failed to fetch OGP:', error);
    } finally {
      setIsFetchingOgp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, title, description, folder: selectedFolder || null }),
    });

    setIsLoading(false);
    setUrl('');
    setTitle('');
    setDescription('');
    if (!currentFolderId) {
      setSelectedFolder('');
    }
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.formTitle}>ブックマークを追加</h2>
      <div className={styles.formGroup}>
        <label htmlFor="url" className={styles.label}>URL</label>
        {/* onBlurイベントハンドラを復活 */}
        <input type="url" id="url" value={url} onChange={(e) => setUrl(e.target.value)} onBlur={handleUrlBlur} required className={styles.input} />
      </div>
      <div className={styles.formGroup}>
        {/* OGP取得中の表示を復活 */}
        <label htmlFor="title" className={styles.label}>タイトル {isFetchingOgp && '(自動取得中...)'}</label>
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
          disabled={!!currentFolderId}
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
      
      <button type="submit" disabled={isLoading} className={styles.button}>
        登録
      </button>
    </form>
  );
}