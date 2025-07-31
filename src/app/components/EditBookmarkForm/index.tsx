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

    // 更新用のAPIを叩く
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
  
  const handleDelete = async () => {
    // 確認ダイアログを表示
    if (!window.confirm('本当にこのブックマークを削除しますか？')) {
      return; // キャンセルされたら何もしない
    }

    setIsLoading(true);

    await fetch(`/api/bookmarks/${bookmark.id}`, {
      method: 'DELETE',
    });

    setIsLoading(false);
    // 削除が終わったら、トップページに戻る
    router.push('/');
    router.refresh();
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

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button type="submit" disabled={isLoading}>
          {isLoading ? '更新中...' : '更新'}
        </button>
        <button type="button" onClick={handleDelete} disabled={isLoading} style={{ backgroundColor: '#e53e3e', color: 'white' }}>
          削除
        </button>
      </div>
    </form>
  );
}