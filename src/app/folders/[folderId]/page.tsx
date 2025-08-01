import { getBookmarksByFolder, getUnclassifiedBookmarks, getFolders } from '@/libs/microcms';
import BookmarkCard from '@/app/components/BookmarkCard';
import styles from '@/app/page.module.css';
import { type Bookmark, type Folder } from '@/libs/microcms';
import BookmarkForm from '@/app/components/BookmarkForm';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { FiInbox } from 'react-icons/fi';
import emptyStateStyles from '@/app/empty.module.css';

type Props = {
  params: Promise<{
    folderId: string;
  }>;
};

export default async function FolderPage({ params: paramsPromise }: Props) {
  const session = await getServerSession(authOptions);
  const params = await paramsPromise;
  const { folderId } = params;
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
      <div className="scrollableArea">
        <h1 className={styles.title}>{title}</h1>
        {bookmarks.length === 0 ? (
          <div className={emptyStateStyles.emptyState}>
            <FiInbox size={48} className={emptyStateStyles.icon} />
            <h2 className={emptyStateStyles.title}>まだブックマークがありません</h2>
            <p className={emptyStateStyles.text}>下のフォームから最初のブックマークを追加してみましょう！</p>
          </div>
        ) : (
          <div className={styles.listContainer}>
            {bookmarks.map((bookmark: Bookmark) => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} allFolders={allFolders} />
            ))}
          </div>
        )}
      </div>

      <div className="fixedFormArea">
        <BookmarkForm
          allFolders={allFolders}
          currentFolderId={folderId !== 'unclassified' ? folderId : undefined}
        />
      </div>
    </>
  );
}