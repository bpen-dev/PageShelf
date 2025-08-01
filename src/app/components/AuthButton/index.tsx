'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import styles from './index.module.css';

export default function AuthButton() {
  const { data: session, status } = useSession();

  // セッション情報を取得中
  if (status === 'loading') {
    return <div className={styles.loading}>Loading...</div>;
  }

  // ログインしている場合
  if (session) {
    return (
      <div className={styles.container}>
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || 'User Avatar'}
            width={32}
            height={32}
            className={styles.avatar}
          />
        )}
        <span className={styles.userName}>{session.user?.name}</span>
        <button onClick={() => signOut()} className={styles.button}>
          ログアウト
        </button>
      </div>
    );
  }

  // ログインしていない場合
  return (
    <div className={styles.container}>
      <button onClick={() => signIn('google')} className={styles.button}>
        Googleでログイン
      </button>
    </div>
  );
}