import { getBookmarkDetail, getTags } from '@/libs/microcms'; 
import EditBookmarkForm from '@/app/components/EditBookmarkForm';

type Props = {
  params: {
    id: string;
  };
};

export default async function EditPage({ params }: Props) {
  const { id } = params;
  const bookmark = await getBookmarkDetail(id);
  const allTags = await getTags(); 

  if (!bookmark) {
    return <div>ブックマークが見つかりません。</div>;
  }

  return (
    <div>
      <h1>ブックマーク編集</h1>
      <EditBookmarkForm bookmark={bookmark} allTags={allTags} />
    </div>
  );
}