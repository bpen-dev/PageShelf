import styles from './page.module.css';
import { FiBox, FiFeather, FiLayers, FiZap } from 'react-icons/fi';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      <div className="fixedHeader">
        <h1 className={styles.headerTitle}>このアプリについて</h1>
      </div>
      <div className="scrollableArea">
        <div className={styles.container}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Bookmark Appへようこそ！</h2>
            <p className={styles.text}>
              Bookmark Appは、日々の情報収集や学習をより効率的で、楽しいものにするために開発された、<br></br>あなた専用のパーソナル・ブックマーク管理ツールです。<br />
              溢れる情報の中から「あとで読みたい」「これは重要だ」と感じたものを、<br></br>瞬時に、そして美しく整理することができます。
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>主な機能</h2>
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <FiLayers size={24} className={styles.featureIcon} />
                <h3 className={styles.featureTitle}>スマートなフォルダ管理</h3>
                <p className={styles.featureText}>ドラッグ＆ドロップのような直感的な操作で、ブックマークを自由にフォルダ分け。サイドバーからいつでも作成・編集・削除が可能です。</p>
              </div>
              <div className={styles.featureCard}>
                <FiZap size={24} className={styles.featureIcon} />
                <h3 className={styles.featureTitle}>高速 OGPプレビュー</h3>
                <p className={styles.featureText}>URLをペーストするだけで、サイトのタイトルとファビコンを瞬時にプレビュー。保存する前に、どんなサイトかを確認できます。</p>
              </div>
              <div className={styles.featureCard}>
                <FiFeather size={24} className={styles.featureIcon} />
                <h3 className={styles.featureTitle}>直感的なUI/UX</h3>
                <p className={styles.featureText}>カード形式の見やすいデザインと、色分け機能。ポップアップでの編集機能など、操作の流れを止めないスムーズな使い心地を追求しました。</p>
              </div>
              <div className={styles.featureCard}>
                <FiBox size={24} className={styles.featureIcon} />
                <h3 className={styles.featureTitle}>Supabaseによる堅牢なバックエンド</h3>
                <p className={styles.featureText}>データは全てクラウドデータベースSupabaseに安全に保存。Googleアカウントでのログインにより、あなただけのプライベートな空間を確保します。</p>
              </div>
            </div>
          </div>
          
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>運営者について</h2>
            <p className={styles.text}>
              このアプリは、Web開発を学ぶ一環として、ぼちペンが企画、設計、開発、デザインの全てを行いました。<br />
              開発の過程で学んだことや、実装した技術の詳細は、運営しているブログにまとめています。
            </p>
            <div className={styles.linkContainer}>
              <Link href="https://bochi-it-note.com/" target="_blank" rel="noopener noreferrer" className={styles.button}>
                ブログを見る
              </Link>
              <Link href="/contact" className={styles.buttonSecondary}>
                お問い合わせ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}