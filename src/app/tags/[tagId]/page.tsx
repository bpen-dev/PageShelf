import { getBookmarksByTag } from '@/libs/microcms';
import BookmarkCard from '@/app/components/BookmarkCard'; // Cardコンポーネントをインポート
import styles from '@/app/page.module.css'; // トップページのスタイルを再利用

type Props = {
  params: {
    tagId: string;
  };
};

export default async function TagPage({ params }: Props) {
  const { tagId } = params;
  const bookmarks = await getBookmarksByTag(tagId);

  // microCMSからタグ自身の情報も取ってきて表示すると、より親切になります（今回は省略）
  
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>タグによる絞り込み結果</h1>
      <div className={styles.grid}>
        {bookmarks.map((bookmark) => (
          <BookmarkCard key={bookmark.id} bookmark={bookmark} />
        ))}
      </div>
    </main>
  );
}