import { getBookmarks, getFolders, type Bookmark } from '@/utils/supabase/queries';
import BookmarkCard from './components/BookmarkCard';
import styles from './page.module.css';
import BookmarkForm from './components/BookmarkForm';
import { FiInbox } from 'react-icons/fi';
import emptyStateStyles from '@/app/empty.module.css';
import { createClient } from '@/utils/supabase/server';
import AuthButton from './components/AuthButton';
import landingStyles from './landing.module.css';
import { FiLayers, FiZap, FiBox } from 'react-icons/fi'; // 👈 特徴紹介用のアイコンをインポート

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // --- ログインしていないユーザー向けの表示 (ランディングページ) ---
  if (!user) {
    return (
      <div className={landingStyles.landingPage}>
        <header className={landingStyles.header}>
          <div className={landingStyles.logo}>🚀 Bookmark App</div>
          <AuthButton />
        </header>
        <div className={landingStyles.hero}>
          <h1 className={landingStyles.title}>
            散らばる知識に、<br />最高の「司令塔」を。
          </h1>
          <p className={landingStyles.subtitle}>
            Bookmark Appは、日々のリサーチや学習で出会う情報を、<br />
            迷わず、素早く、美しく整理するためのインテリジェントなブックマーク管理ツールです。
          </p>
          <div className={landingStyles.ctaButton}>
            <AuthButton />
          </div>
        </div>
        <div className={landingStyles.features}>
          <div className={landingStyles.featureCard}>
            <FiLayers size={24} className={landingStyles.featureIcon} />
            <h3 className={landingStyles.featureTitle}>スマートなフォルダ管理</h3>
            <p className={landingStyles.featureText}>直感的なフォルダ分けと色分け機能で、あなたの知識を体系的に整理します。</p>
          </div>
          <div className={landingStyles.featureCard}>
            <FiZap size={24} className={landingStyles.featureIcon} />
            <h3 className={landingStyles.featureTitle}>高速プレビュー＆登録</h3>
            <p className={landingStyles.featureText}>URLをペーストするだけ。タイトルとファビコンを瞬時にプレビューし、ワンクリックで保存完了。</p>
          </div>
          <div className={landingStyles.featureCard}>
            <FiBox size={24} className={landingStyles.featureIcon} />
            <h3 className={landingStyles.featureTitle}>安全なパーソナル空間</h3>
            <p className={landingStyles.featureText}>Supabaseによる堅牢な認証システムで、あなたのデータは安全に、あなただけのものとして管理されます。</p>
          </div>
        </div>
      </div>
    );
  }

  // --- ログインしているユーザー向けの表示 (メインアプリ画面) ---
  const bookmarks = await getBookmarks();
  const allFolders = await getFolders();

  return (
    <>
      <div className="fixedHeader">
        <h1 className={styles.headerTitle}>すべてのブックマーク</h1>
      </div>
      <div className="scrollableArea">
        {bookmarks.length === 0 ? (
          <div className={emptyStateStyles.emptyState}>
            <FiInbox size={48} className={emptyStateStyles.icon} />
            <h2 className={emptyStateStyles.title}>まだブックマークがありません</h2>
            <p className={emptyStateStyles.text}>下のフォームから最初のブックマークを追加してみましょう！</p>
          </div>
        ) : (
          <div className={styles.listContainer}>
            {bookmarks.map((bookmark) => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} allFolders={allFolders} />
            ))}
          </div>
        )}
      </div>
      <div className="fixedFormArea">
        <BookmarkForm /> 
      </div>
    </>
  );
}