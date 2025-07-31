'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { type Folder } from '@/libs/microcms';
import styles from './index.module.css';

type Props = {
  allFolders: Folder[];
  // 👇 現在表示しているフォルダのIDを受け取れるようにする（任意）
  currentFolderId?: string;
};

export default function BookmarkForm({ allFolders, currentFolderId }: Props) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // 👇 currentFolderIdがあれば、それを初期値にする
  const [selectedFolder, setSelectedFolder] = useState(currentFolderId || '');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // OGP取得機能は一旦コメントアウトして、後で復活させましょう
  // const [isFetchingOgp, setIsFetchingOgp] = useState(false);
  // const handleUrlBlur = async () => { ... };

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
    // フォルダページの場合は、選択を維持する
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
          // 👇 フォルダページの場合は選択を無効化する
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