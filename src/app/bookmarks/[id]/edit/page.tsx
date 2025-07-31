import { getBookmarkDetail } from '@/libs/microcms';
import EditBookmarkForm from '@/app/components/EditBookmarkForm';

type Props = {
  params: {
    id: string;
  };
};

// paramsからブックマークのIDを受け取ります
export default async function EditPage({ params }: Props) {
  const { id } = params;
  const bookmark = await getBookmarkDetail(id);

  // ここで、受け取ったIDを使ってmicroCMSから
  // 1件だけブックマークのデータを取得する処理を後で書きます。

  return (
    <div>
      <h1>ブックマーク編集</h1>
      
      {/* 編集フォームに取得したデータを渡す */}
      <EditBookmarkForm bookmark={bookmark} />

      {/* ここに、データが入力済みの編集フォームを後で置きます */}
    </div>
  );
}