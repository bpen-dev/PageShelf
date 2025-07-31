'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { type Bookmark, type Tag } from '@/libs/microcms';
import styles from './index.module.css'; // 👈 CSSモジュールをインポート

type Props = {
  bookmark: Bookmark;
  allTags: Tag[];
};

export default function EditBookmarkForm({ bookmark, allTags }: Props) {
  const [url, setUrl] = useState(bookmark.url);
  const [title, setTitle] = useState(bookmark.title);
  const [description, setDescription] = useState(bookmark.description || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(bookmark.tags.map(tag => tag.id));
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleTagChange = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await fetch(`/api/bookmarks/${bookmark.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, title, description, tags: selectedTags }),
    });
    setIsLoading(false);
    router.push('/');
    router.refresh();
  };
  
  const handleDelete = async () => {
    if (!window.confirm('本当にこのブックマークを削除しますか？')) {
      return;
    }
    setIsLoading(true);
    await fetch(`/api/bookmarks/${bookmark.id}`, {
      method: 'DELETE',
    });
    setIsLoading(false);
    router.push('/');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="url" className={styles.label}>URL</label>
        <input type="url" id="url" value={url} onChange={(e) => setUrl(e.target.value)} required className={styles.input} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>タイトル</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className={styles.input} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>メモ</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className={styles.textarea} />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>タグ</label>
        <div className={styles.tagGroup}>
          {allTags.map((tag) => (
            <div key={tag.id} className={styles.tagItem}>
              <input
                type="checkbox"
                id={`edit-${tag.id}`}
                value={tag.id}
                checked={selectedTags.includes(tag.id)}
                onChange={() => handleTagChange(tag.id)}
              />
              <label htmlFor={`edit-${tag.id}`}>{tag.name}</label>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? '更新中...' : '更新'}
        </button>
        <button type="button" onClick={handleDelete} disabled={isLoading} className={`${styles.button} ${styles.deleteButton}`}>
          削除
        </button>
      </div>
    </form>
  );
}