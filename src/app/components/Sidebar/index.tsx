'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react'; // 👈 useEffectを追加
import { type Folder } from '@/libs/microcms';
import styles from './index.module.css';

type Props = {
  allFolders: Folder[];
};

export default function Sidebar({ allFolders }: Props) {
  // 親から受け取ったデータを、このコンポーネントが管理する「状態」としてコピーします
  const [folders, setFolders] = useState(allFolders);
  const [newFolderName, setNewFolderName] = useState('');
  const router = useRouter();

  // 親から渡されるallFoldersが変わったときに、内部の状態も同期させます
  useEffect(() => {
    setFolders(allFolders);
  }, [allFolders]);

  // 新しいフォルダを作成
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const res = await fetch('/api/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newFolderName }),
    });
    const newFolder = await res.json();

    // 👇 UIの状態を「手動で」更新します
    setFolders([...folders, newFolder]);
    setNewFolderName('');
    router.refresh(); // 念のためサーバーとも同期
  };

  // フォルダ名を編集
  const handleEditFolder = async (id: string) => {
    const newName = window.prompt('新しいフォルダ名を入力してください');
    if (!newName || !newName.trim()) return;

    const res = await fetch(`/api/folders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });
    const updatedFolder = await res.json();

    // 👇 UIの状態を「手動で」更新します
    setFolders(folders.map(f => (f.id === id ? updatedFolder : f)));
    router.refresh();
  };
  
  // フォルダを削除
  const handleDeleteFolder = async (id: string, name: string) => {
    if (!window.confirm(`「${name}」フォルダを削除しますか？中のブックマークは「未分類」に移動します。`)) return;

    await fetch(`/api/folders/${id}`, {
      method: 'DELETE',
    });

    // 👇 UIの状態を「手動で」更新します
    setFolders(folders.filter(f => f.id !== id));
    router.refresh();
  };

  return (
    <aside className={styles.sidebar}>
      <nav>
        <ul className={styles.list}>
          <li><Link href="/" className={styles.link}>すべてのブックマーク</Link></li>
          <li><Link href="/folders/unclassified" className={styles.link}>未分類</Link></li>
        </ul>
        <hr className={styles.divider} />
        <ul className={styles.list}>
          {/* 親から渡されたallFoldersではなく、このコンポーネントが管理する`folders`を使います */}
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