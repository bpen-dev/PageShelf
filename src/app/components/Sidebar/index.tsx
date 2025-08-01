'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { type Folder } from '@/libs/microcms';
import styles from './index.module.css';
import AuthButton from '../AuthButton'; // 👈 AuthButtonをインポート

type Props = {
  allFolders: Folder[];
};

export default function Sidebar({ allFolders }: Props) {
  const [folders, setFolders] = useState(allFolders);
  const [newFolderName, setNewFolderName] = useState('');
  const router = useRouter();

  useEffect(() => {
    setFolders(allFolders);
  }, [allFolders]);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const res = await fetch('/api/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newFolderName }),
    });
    const newFolder = await res.json();
    setFolders([...folders, newFolder]);
    setNewFolderName('');
    router.refresh();
  };

  const handleEditFolder = async (id: string) => {
    const newName = window.prompt('新しいフォルダ名を入力してください');
    if (!newName || !newName.trim()) return;
    const res = await fetch(`/api/folders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });
    const updatedFolder = await res.json();
    setFolders(folders.map(f => (f.id === id ? updatedFolder : f)));
    router.refresh();
  };
  
  const handleDeleteFolder = async (id: string, name: string) => {
    if (!window.confirm(`「${name}」フォルダを削除しますか？中のブックマークは「未分類」に移動します。`)) return;
    await fetch(`/api/folders/${id}`, {
      method: 'DELETE',
    });
    setFolders(folders.filter(f => f.id !== id));
    router.refresh();
  };

  return (
    <aside className={styles.sidebar}>
      {/* 👇 認証ボタンを一番上に追加 */}
      <div className={styles.authContainer}>
        <AuthButton />
      </div>

      <nav>
        <ul className={styles.list}>
          <li><Link href="/" className={styles.link}>すべてのブックマーク</Link></li>
          <li><Link href="/folders/unclassified" className={styles.link}>未分類</Link></li>
        </ul>
        <hr className={styles.divider} />
        <ul className={styles.list}>
          {folders.map((folder) => (
            <li key={folder.id} className={styles.folderItem}>
              <Link href={`/folders/${folder.id}`} className={styles.link}>
                {folder.name}
              </Link>
              <div className={styles.folderActions}>
                <button onClick={() => handleEditFolder(folder.id)} className={styles.actionButton}>✏️</button>
                <button onClick={() => handleDeleteFolder(folder.id, folder.name)} className={styles.actionButton}>🗑️</button>
              </div>
            </li>
          ))}
        </ul>
      </nav>
      <form onSubmit={handleCreateFolder} className={styles.addFolderForm}>
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="新しいフォルダを追加"
          className={styles.addFolderInput}
        />
        <button type="submit" className={styles.addFolderButton}>+</button>
      </form>
    </aside>
  );
}