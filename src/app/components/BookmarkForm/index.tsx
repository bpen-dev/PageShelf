'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { type Folder } from '@/libs/microcms'; // 👈 TagをFolderに変更
import styles from './index.module.css';

type Props = {
  allFolders: Folder[]; // 👈 allTagsをallFoldersに変更
};

export default function BookmarkForm({ allFolders }: Props) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(''); // 👈 selectedTagsをselectedFolderに変更
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // 👇 送信するデータをfolderに変更
      body: JSON.stringify({ url, title, description, folder: selectedFolder || null }),
    });

    setIsLoading(false);
    setUrl('');
    setTitle('');
    setDescription('');
    setSelectedFolder(''); // 👈 クリアするstateを変更
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
      
      {/* 👇 タグ選択をフォルダ選択のプルダウンに変更 */}
      <div className={styles.formGroup}>
        <label htmlFor="folder" className={styles.label}>フォルダ</label>
        <select
          id="folder"
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
          className={styles.input} // inputと同じスタイルを適用
        >
          <option value="">未分類</option>
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