'use client';

import { type Bookmark, type Folder } from '@/libs/microcms';
import { useClickOutside } from '@/hooks/useClickOutside';
import EditBookmarkForm from '../EditBookmarkForm';
import styles from './index.module.css';
import { FiX } from 'react-icons/fi';

type Props = {
  bookmark: Bookmark;
  allFolders: Folder[];
  onClose: () => void; // モーダルを閉じるための関数
};

export default function EditModal({ bookmark, allFolders, onClose }: Props) {
  // モーダルの外側をクリックしたら閉じる
  const modalRef = useClickOutside<HTMLDivElement>(onClose);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        <div className={styles.header}>
          <h2 className={styles.title}>ブックマークを編集</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <FiX />
          </button>
        </div>
        <div className={styles.content}>
          {/* 編集フォームをモーダルの中に配置 */}
          <EditBookmarkForm 
            bookmark={bookmark} 
            allFolders={allFolders}
            onClose={onClose} // フォーム側にも閉じる関数を渡す
          />
        </div>
      </div>
    </div>
  );
}