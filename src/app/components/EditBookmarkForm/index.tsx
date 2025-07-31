'use client'; // フォームなのでClient Component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { type Bookmark } from '@/libs/microcms';

type Props = {
  bookmark: Bookmark; // 編集対象のブックマークデータをPropsで受け取る
};

export default function EditBookmarkForm({ bookmark }: Props) {
  // Propsで受け取ったデータで、各フォームの状態を初期化
  const [url, setUrl] = useState(bookmark.url);
  const [title, setTitle] = useState(bookmark.title);
  const [description, setDescription] = useState(bookmark.description);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 更新用のAPIを叩く（後で作成します）
    await fetch(`/api/bookmarks/${bookmark.id}`, {
      method: 'PATCH', // 部分的な更新なのでPATCHメソッドを使用
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, title, description }),
    });

    setIsLoading(false);
    // 更新が終わったら、トップページに戻る
    router.push('/');
    router.refresh(); // サーバーのデータを再取得させる
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="url">URL</label>
        <input type="url" id="url" value={url} onChange={(e) => setUrl(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="title">タイトル</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="description">メモ</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? '更新中...' : '更新'}
      </button>
    </form>
  );
}