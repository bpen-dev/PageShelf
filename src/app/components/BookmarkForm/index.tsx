'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { type Tag } from '@/libs/microcms';

type Props = {
  allTags: Tag[]; // トップページから全タグのリストを受け取る
};

export default function BookmarkForm({ allTags }: Props) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // 選択されたタグIDを配列で管理
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // タグのチェックボックスが変更されたときの処理
  const handleTagChange = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // 送信するデータにtagsを追加
      body: JSON.stringify({ url, title, description, tags: selectedTags }),
    });

    setIsLoading(false);
    // フォームをクリア
    setUrl('');
    setTitle('');
    setDescription('');
    setSelectedTags([]);
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

      {/* タグ選択のUI */}
      <div>
        <label>タグ</label>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {allTags.map((tag) => (
            <div key={tag.id}>
              <input
                type="checkbox"
                id={tag.id}
                value={tag.id}
                checked={selectedTags.includes(tag.id)}
                onChange={() => handleTagChange(tag.id)}
              />
              <label htmlFor={tag.id}>{tag.name}</label>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" disabled={isLoading} style={{ marginTop: '1rem' }}>
        {isLoading ? '登録中...' : '登録'}
      </button>
    </form>
  );
}