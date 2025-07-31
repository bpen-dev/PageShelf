import { getBookmarkDetail, getFolders } from '@/libs/microcms';
import EditBookmarkForm from '@/app/components/EditBookmarkForm';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPage({ params: paramsPromise }: Props) {
  const params = await paramsPromise;
  const { id } = params;
  const bookmark = await getBookmarkDetail(id);
  const allFolders = await getFolders();

  if (!bookmark) {
    return <div>ブックマークが見つかりません。</div>;
  }

  return (
    <div>
      <h1>ブックマーク編集</h1>
      
      <EditBookmarkForm bookmark={bookmark} allFolders={allFolders} />
    </div>
  );
}