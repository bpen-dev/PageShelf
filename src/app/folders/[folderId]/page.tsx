import { getBookmarksByFolder, getUnclassifiedBookmarks, getFolders, type Bookmark } from '@/utils/supabase/queries';
import BookmarkCard from '@/app/components/BookmarkCard';
import styles from '@/app/page.module.css';
import BookmarkForm from '@/app/components/BookmarkForm';
import { FiInbox } from 'react-icons/fi';
import emptyStateStyles from '@/app/empty.module.css';
import { createClient } from '@/utils/supabase/server';

type Props = {
  params: {
    folderId: string;
  };
};

export default async function FolderPage({ params }: Props) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { folderId } = params;
  const allFolders = await getFolders();

  const bookmarks =
    folderId === 'unclassified'
      ? await getUnclassifiedBookmarks()
      : await getBookmarksByFolder(folderId);

  const currentFolder = allFolders.find(folder => folder.id.toString() === folderId);
  const title = 
    folderId === 'unclassified'
      ? '未分類'
      : currentFolder
      ? currentFolder.name
      : 'ブックマーク';
  
  if (!user) {
    // 未ログイン時の表示はトップページに任せるので、ここでは何も表示しないか、リダイレクトが適切
    return null;
  }

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
            {bookmarks.map((bookmark) => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} allFolders={allFolders} />
            ))}
          </div>
        )}
      </div>

      <div className="fixedFormArea">
        <BookmarkForm currentFolderId={folderId !== 'unclassified' ? folderId : undefined} />
      </div>
    </>
  );
}