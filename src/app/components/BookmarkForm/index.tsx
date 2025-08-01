'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import styles from './index.module.css';
import { FiPlus, FiLoader } from 'react-icons/fi';
import Image from 'next/image';
import { useDebounce } from '@/hooks/useDebounce';
import { type Folder } from '@/libs/microcms'; // 👈 Folderの型をインポート（次のステップで使います）

type OgpData = {
  title: string;
  favicon: string;
};

// 👇 Propsの型定義を修正
type Props = {
  allFolders: Folder[];
  currentFolderId?: string;
};

export default function BookmarkForm({ allFolders, currentFolderId }: Props) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ogpData, setOgpData] = useState<OgpData | null>(null);
  const router = useRouter();
  const debouncedUrl = useDebounce(url, 500);

  useEffect(() => {
    const isValidUrl = debouncedUrl && (debouncedUrl.startsWith('http://') || debouncedUrl.startsWith('https://'));
    
    if (!isValidUrl) {
      setOgpData(null);
      return;
    }

    const fetchOgp = async () => {
      setIsLoading(true);
      setOgpData(null);
      try {
        const response = await fetch(`/api/ogp?url=${encodeURIComponent(debouncedUrl)}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '情報の取得に失敗しました');
        }

        const data: OgpData = await response.json();
        setOgpData(data);
      } catch (error) {
        console.error(error);
        // 👇 [修正点] ここでtoastを使ってエラーメッセージを表示します
        if (error instanceof Error) {
          toast.error(error.message);
        }
        setOgpData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOgp();
  }, [debouncedUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ogpData) {
      toast.error('有効なURLを読み込んでから追加してください。');
      return;
    }

    setIsLoading(true);

    const response = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        url: debouncedUrl, 
        title: ogpData.title,
        description: '',
        folder: currentFolderId || null
      }),
    });

    setIsLoading(false);

    if (response.ok) {
      toast.success('ブックマークを追加しました！');
      setUrl('');
      setOgpData(null);
      router.refresh();
    } else {
      const errorData = await response.json();
      toast.error(errorData.error || '登録に失敗しました。');
    }
  };

  return (
    <div className={styles.container}>
      {ogpData && !isLoading && (
        <div className={styles.previewCard}>
          <Image src={ogpData.favicon} width={24} height={24} alt="" className={styles.previewFavicon} />
          <span className={styles.previewTitle}>{ogpData.title}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputWrapper}>
          <FiPlus className={styles.icon} />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={styles.input}
            placeholder="ブックマークしたいURLをペースト..."
            disabled={isLoading && !ogpData}
          />
          {isLoading && <FiLoader className={`${styles.icon} ${styles.loader}`} />}
          {ogpData && !isLoading && (
            <button type="submit" disabled={isLoading} className={styles.addButton}>
              追加
            </button>
          )}
        </div>
      </form>
    </div>
  );
}