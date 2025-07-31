import { getBookmarksByFolder, getUnclassifiedBookmarks } from '@/libs/microcms';
import BookmarkCard from '@/app/components/BookmarkCard';
import styles from '@/app/page.module.css'; // トップページのスタイルを再利用
import { type Bookmark } from '@/libs/microcms';

type Props = {
  params: {
    folderId: string;
  };
};

export default async function FolderPage({ params }: Props) {
  const { folderId } = params;

  // URLに応じて取得するデータを変える
  const bookmarks =
    folderId === 'unclassified'
      ? await getUnclassifiedBookmarks()
      : await getBookmarksByFolder(folderId);

  // microCMSからフォルダ名を取得して表示すると、より親切になります（今回は省略）
  const title =
    folderId === 'unclassified'
      ? '未分類のブックマーク'
      : 'フォルダ内のブックマーク';

  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.grid}>
        {bookmarks.length === 0 ? (
          <p>このフォルダにはブックマークがありません。</p>
        ) : (
          bookmarks.map((bookmark: Bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))
        )}
      </div>
    </>
  );
}