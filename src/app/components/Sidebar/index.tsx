'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { type Folder } from '@/libs/microcms';
import styles from './index.module.css';
import AuthButton from '../AuthButton';
import { FiHome, FiArchive, FiFolder, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

type Props = {
  allFolders: Folder[];
};

export default function Sidebar({ allFolders }: Props) {
  // 親から受け取ったデータを、このコンポー-ネントが管理する「状態」としてコピーします
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
    toast.success(`「${newFolder.name}」を作成しました`);
    router.refresh(); // 念のためサーバーとも同期
  };

  // フォルダ名を編集
  const handleEditFolder = async (id: string, currentName: string) => {
    const newName = window.prompt('新しいフォルダ名を入力してください', currentName);
    if (!newName || !newName.trim()) return;

    const res = await fetch(`/api/folders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });
    const updatedFolder = await res.json();

    // 👇 UIの状態を「手動で」更新します
    setFolders(folders.map(f => (f.id === id ? updatedFolder : f)));
    toast.success(`「${newName}」に名前を変更しました`);
    router.refresh();
  };
  
  // フォルダを削除
  const handleDeleteFolder = async (id: string, name: string) => {
    if (name === 'Default') {
      alert('Defaultフォルダは削除できません。');
      return;
    }
    if (!window.confirm(`「${name}」フォルダを削除しますか？中のブックマークは「Default」フォルダに移動します。`)) return;

    const res = await fetch(`/api/folders/${id}`, {
      method: 'DELETE',
    });

    // 👇 成功した場合のみUIを更新
    if (res.ok) {
      setFolders(folders.filter(f => f.id !== id));
      toast.success(`「${name}」を削除しました`);
      router.push('/');
      router.refresh();
    } else {
      toast.error('フォルダの削除に失敗しました。');
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.authContainer}><AuthButton /></div>
      <nav className={styles.nav}>
        <ul className={styles.list}>
          <li><Link href="/" className={styles.link}><FiHome />すべてのブックマーク</Link></li>
          {/* <li><Link href="/folders/unclassified" className={styles.link}><FiArchive />未分類</Link></li> */}
        </ul>
        <hr className={styles.divider} />
        <form onSubmit={handleCreateFolder} className={styles.addFolderForm}>
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="新しいフォルダを追加..."
            className={styles.addFolderInput}
          />
          <button type="submit" className={styles.addFolderButton} title="追加"><FiPlus /></button>
        </form>
        <ul className={`${styles.list} ${styles.folderList}`}>
          {/* 親から渡されたallFoldersではなく、このコンポーネントが管理する`folders`を使います */}
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
    </aside>
  );
}