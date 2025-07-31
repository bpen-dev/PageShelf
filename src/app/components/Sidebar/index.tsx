'use client'; // 👈 Client Componentに変更

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { type Folder } from '@/libs/microcms';
import styles from './index.module.css';

type Props = {
  allFolders: Folder[];
};

export default function Sidebar({ allFolders }: Props) {
  const [newFolderName, setNewFolderName] = useState('');
  const router = useRouter();

  // 新しいフォルダを作成
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    await fetch('/api/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newFolderName }),
    });
    setNewFolderName('');
    router.refresh(); // 画面を更新して新しいフォルダをリストに表示
  };

  // フォルダ名を編集
  const handleEditFolder = async (id: string) => {
    const newName = window.prompt('新しいフォルダ名を入力してください');
    if (!newName || !newName.trim()) return;
    await fetch(`/api/folders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });
    router.refresh();
  };
  
  // フォルダを削除
  const handleDeleteFolder = async (id: string, name: string) => {
    if (!window.confirm(`「${name}」フォルダを削除しますか？中のブックマークは「未分類」に移動します。`)) return;
    await fetch(`/api/folders/${id}`, {
      method: 'DELETE',
    });
    router.refresh();
  };

  return (
    <aside className={styles.sidebar}>
      <nav>
        {/* ... (すべてのブックマーク, 未分類のリンクは変更なし) ... */}
        <ul className={styles.list}>
          <li><Link href="/" className={styles.link}>すべてのブックマーク</Link></li>
          <li><Link href="/folders/unclassified" className={styles.link}>未分類</Link></li>
        </ul>
        <hr className={styles.divider} />
        <ul className={styles.list}>
          {allFolders.map((folder) => (
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