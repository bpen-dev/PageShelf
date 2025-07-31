import { getBookmarkDetail } from '@/libs/microcms';

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
      <p>編集するブックマークのID: {id}</p>
      
      {/* 取得したデータを表示してみる */}
      <h2>{bookmark.title}</h2>
      <p>{bookmark.url}</p>
      <p>{bookmark.description}</p>
      
      {/* ここに、データが入力済みの編集フォームを後で置きます */}
    </div>
  );
}