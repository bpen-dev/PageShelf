'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BookmarkForm() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, title, description }),
    });

    setIsLoading(false);
    // フォームをクリア
    setUrl('');
    setTitle('');
    setDescription('');
    // ページをリフレッシュして新しいブックマークを一覧に表示
    router.refresh(); 
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ...フォームの見た目は変更なし... */}
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
        {isLoading ? '登録中...' : '登録'}
      </button>
    </form>
  );
}