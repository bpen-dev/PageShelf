import { getBookmarksByFolder, getUnclassifiedBookmarks, getFolders } from '@/libs/microcms';
import BookmarkCard from '@/app/components/BookmarkCard';
import styles from '@/app/page.module.css';
import { type Bookmark, type Folder } from '@/libs/microcms';
import BookmarkForm from '@/app/components/BookmarkForm';
import { FiInbox } from 'react-icons/fi'; // 👈 アイコンをインポート
import emptyStateStyles from '@/app/empty.module.css'; // 👈 新しいCSSをインポート

type Props = {
  params: Promise<{
    folderId: string;
  }>;
};

export default async function FolderPage({ params: paramsPromise }: Props) {
  const params = await paramsPromise;
  const { folderId } = params;
  // You need to obtain or pass the session object here
  // For example, if you have access to a session variable:
  // const session = ...;
  // const allFolders = await getFolders(session);

  // Placeholder: Replace 'session' with your actual session object
  const session = null; // TODO: Replace with actual session retrieval
  const allFolders = await getFolders(session);

  const bookmarks =
    folderId === 'unclassified'
      ? await getUnclassifiedBookmarks(session)
      : await getBookmarksByFolder(folderId, session);

  const currentFolder = allFolders.find(folder => folder.id === folderId);
  const title = 
    folderId === 'unclassified'
      ? '未分類のブックマーク'
      : currentFolder
      ? `${currentFolder.name} のブックマーク`
      : 'フォルダ内のブックマーク';

  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      
      {/* 👇 Empty Stateのデザインを適用 */}
      {bookmarks.length === 0 ? (
        <div className={emptyStateStyles.emptyState}>
          <FiInbox size={48} className={emptyStateStyles.icon} />
          <h2 className={emptyStateStyles.title}>まだブックマークがありません</h2>
          <p className={emptyStateStyles.text}>下のフォームから最初のブックマークを追加してみましょう！</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {bookmarks.map((bookmark: Bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} allFolders={allFolders} />
          ))}
        </div>
      )}

      <div className={styles.formContainer}>
        <BookmarkForm
          allFolders={allFolders}
          currentFolderId={folderId !== 'unclassified' ? folderId : undefined}
        />
      </div>
    </>
  );
}