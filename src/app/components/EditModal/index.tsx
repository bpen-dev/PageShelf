'use client';

import { type Bookmark } from '@/utils/supabase/queries';
import { useClickOutside } from '@/hooks/useClickOutside';
import EditBookmarkForm from '../EditBookmarkForm';
import styles from './index.module.css';
import { FiX } from 'react-icons/fi';

// 修正点: allFoldersを受け取らない
type Props = {
  bookmark: Bookmark;
  onClose: () => void;
};

export default function EditModal({ bookmark, onClose }: Props) {
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
          {/* 修正点: 不要なpropsを渡さない */}
          <EditBookmarkForm 
            bookmark={bookmark} 
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}