'use client';

import { useMemo } from 'react';
import { useData } from '@/context/DataContext';
import BookmarkCard from '@/app/components/BookmarkCard';
import styles from '@/app/page.module.css';
import BookmarkForm from '@/app/components/BookmarkForm';
import { FiInbox } from 'react-icons/fi';
import emptyStateStyles from '@/app/empty.module.css';

type Props = {
  params: {
    folderId: string;
  };
};

export default function FolderPage({ params }: Props) {
  const { folderId } = params;
  const { allFolders, bookmarks: allBookmarks } = useData(); 

  const bookmarks = useMemo(() => {
    if (!allBookmarks) return [];
    if (folderId === 'unclassified') {
      return allBookmarks.filter(b => !b.folder_id);
    }
    return allBookmarks.filter(b => b.folder_id?.toString() === folderId);
  }, [folderId, allBookmarks]);

  const currentFolder = (allFolders || []).find(folder => folder.id.toString() === folderId);
  const title = 
    folderId === 'unclassified'
      ? '未分類'
      : currentFolder
      ? currentFolder.name
      : 'ブックマーク';

  return (
    <>
      <div className="fixedHeader">
        <h1 className={styles.headerTitle}>{title}</h1>
      </div>

      <div className="scrollableArea">
        {bookmarks.length === 0 ? (
          <div className={emptyStateStyles.emptyState}>
            <FiInbox size={48} className={emptyStateStyles.icon} />
            <h2 className={emptyStateStyles.title}>まだブックマークがありません</h2>
            <p className={emptyStateStyles.text}>下のフォームから最初のブックマークを追加してみましょう！</p>
          </div>
        ) : (
          <div className={styles.listContainer}>
            {/* 修正点: 不要なpropsを渡さない */}
            {bookmarks.map((bookmark) => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} />
            ))}
          </div>
        )}
      </div>

      <div className="fixedFormArea">
        {/* 修正点: 正しいフォームコンポーネントを呼び出す */}
        <BookmarkForm />
      </div>
    </>
  );
}