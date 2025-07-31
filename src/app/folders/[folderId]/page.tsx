import { getBookmarksByFolder, getUnclassifiedBookmarks, getFolders } from '@/libs/microcms';
import BookmarkCard from '@/app/components/BookmarkCard';
import styles from '@/app/page.module.css';
import { type Bookmark, type Folder } from '@/libs/microcms';
import BookmarkForm from '@/app/components/BookmarkForm'; // 👈 BookmarkFormをインポート

type Props = {
  params: {
    folderId: string;
  };
};

export default async function FolderPage({ params }: Props) {
  const { folderId } = params;
  const allFolders = await getFolders();

  const bookmarks =
    folderId === 'unclassified'
      ? await getUnclassifiedBookmarks()
      : await getBookmarksByFolder(folderId);

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
      <div className={styles.grid}>
        {bookmarks.length === 0 ? (
          <p>このフォルダにはブックマークがありません。</p>
        ) : (
          bookmarks.map((bookmark: Bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} allFolders={allFolders} />
          ))
        )}
      </div>

      {/* 👇 フォルダ別ページにもフォームを追加 */}
      <div className={styles.formContainer}>
        {/* unclassified（未分類）の場合はcurrentFolderIdを渡さない */}
        <BookmarkForm
          allFolders={allFolders}
          currentFolderId={folderId !== 'unclassified' ? folderId : undefined}
        />
      </div>
    </>
  );
}