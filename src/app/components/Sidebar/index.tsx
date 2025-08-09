'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './index.module.css';
import AuthButton from '../AuthButton';
import { FiHome, FiFolder, FiEdit2, FiTrash2, FiPlus, FiShield, FiSend, FiInfo, FiFileText } from 'react-icons/fi'; 
import toast from 'react-hot-toast';
import { useData } from '@/context/DataContext';

// 修正点: Propsを受け取らないように変更
export default function Sidebar() {
  const { allFolders, setAllFolders, setBookmarks } = useData();
  const [newFolderName, setNewFolderName] = useState('');
  const router = useRouter();

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newFolderName.trim();
    if (!trimmedName) return;

    const res = await fetch('/api/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: trimmedName }),
    });
    
    if (res.ok) {
      const newFolder = await res.json();
      setAllFolders(prev => [...prev, newFolder]);
      setNewFolderName('');
      toast.success(`「${trimmedName}」を作成しました`);
    } else {
      toast.error('フォルダの作成に失敗しました');
    }
  };

  const handleEditFolder = async (id: number, currentName: string) => {
    const newName = window.prompt('新しいフォルダ名を入力してください', currentName);
    if (!newName || !newName.trim()) return;

    const res = await fetch(`/api/folders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });
    
    if (res.ok) {
      const updatedFolder = await res.json();
      setAllFolders(prev => prev.map(f => (f.id === id ? updatedFolder : f)));
      toast.success(`「${newName}」に名前を変更しました`);
    } else {
      toast.error('フォルダ名の変更に失敗しました');
    }
  };
  
  const handleDeleteFolder = async (id: number, name: string) => {
    if (name === 'Default') {
      alert('Defaultフォルダは削除できません。');
      return;
    }
    if (!window.confirm(`「${name}」フォルダを削除しますか？中のブックマークは「未分類」となります。（ブックマークは削除されません）`)) return;

    const res = await fetch(`/api/folders/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setAllFolders(prev => prev.filter(f => f.id !== id));
      setBookmarks(prev => prev.map(b => b.folder_id === id ? { ...b, folder_id: null, folders: null } : b));
      toast.success(`「${name}」を削除しました`);
      router.push('/');
    } else {
      toast.error('フォルダの削除に失敗しました');
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.authContainer}><AuthButton /></div>
      <nav className={styles.nav}>
        <ul className={styles.list}>
          <li><Link href="/" className={styles.link}><FiHome />すべてのブックマーク</Link></li>
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
          {(allFolders || []).map((folder) => (
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

      <div className={styles.footerLinks}>
        <Link href="/terms" className={styles.footerLink}>
          <FiFileText size={14} /> 利用規約
        </Link>
        <Link href="/about" className={styles.footerLink}>
          <FiInfo size={14} /> このアプリについて
        </Link>
        <Link href="/privacy-policy" className={styles.footerLink}>
          <FiShield size={14} /> プライバシーポリシー
        </Link>
        
        <Link href="/contact" className={styles.footerLink}>
          <FiSend size={14} /> お問い合わせ
        </Link>
      </div>
    </aside>
  );
}