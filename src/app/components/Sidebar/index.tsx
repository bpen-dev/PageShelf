'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { type Folder } from '@/libs/microcms';
import styles from './index.module.css';
import AuthButton from '../AuthButton';
import { FiHome, FiArchive, FiFolder, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast'; // 👈 toastをインポート

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
    toast.success(`「${newFolder.name}」を作成しました`); // 👈 通知を追加
    router.refresh();
  };

  const handleEditFolder = async (id: string, currentName: string) => {
    const newName = window.prompt('新しいフォルダ名を入力してください', currentName);
    if (!newName || !newName.trim()) return;
    const res = await fetch(`/api/folders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });
    const updatedFolder = await res.json();
    setFolders(folders.map(f => (f.id === id ? updatedFolder : f)));
    toast.success(`「${newName}」に名前を変更しました`); // 👈 通知を追加
    router.refresh();
  };
  
  const handleDeleteFolder = async (id: string, name: string) => {
    if (!window.confirm(`「${name}」フォルダを削除しますか？中のブックマークは「未分類」に移動します。`)) return;
    await fetch(`/api/folders/${id}`, {
      method: 'DELETE',
    });
    setFolders(folders.filter(f => f.id !== id));
    toast.success(`「${name}」を削除しました`); // 👈 通知を追加
    router.refresh();
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.authContainer}><AuthButton /></div>
      <nav>
        <ul className={styles.list}>
          <li><Link href="/" className={styles.link}><FiHome />すべてのブックマーク</Link></li>
          <li><Link href="/folders/unclassified" className={styles.link}><FiArchive />未分類</Link></li>
        </ul>
        <hr className={styles.divider} />
        <ul className={styles.list}>
          {folders.map((folder) => (
            <li key={folder.id} className={styles.folderItem}>
              <Link href={`/folders/${folder.id}`} className={styles.link}>
                <FiFolder />{folder.name}
              </Link>
              <div className={styles.folderActions}>
                <button onClick={() => handleEditFolder(folder.id, folder.name)} className={styles.actionButton} title="名前を変更"><FiEdit2 /></button>
                <button onClick={() => handleDeleteFolder(folder.id, folder.name)} className={styles.actionButton} title="削除"><FiTrash2 /></button>
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
        <button type="submit" className={styles.addFolderButton} title="追加"><FiPlus /></button>
      </form>
    </aside>
  );
}