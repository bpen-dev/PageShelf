'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase';
import type { User } from '@supabase/supabase-js';
import Image from 'next/image';
import styles from './index.module.css';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      router.refresh(); // ログイン状態が変わったらページをリフレッシュ
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, router]);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: location.origin, // ログイン後にこのページに戻ってくる
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };
  
  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (user) {
    return (
      <div className={styles.container}>
        {user.user_metadata.avatar_url && (
          <Image
            src={user.user_metadata.avatar_url}
            alt={user.user_metadata.full_name || 'User Avatar'}
            width={32}
            height={32}
            className={styles.avatar}
          />
        )}
        <span className={styles.userName}>{user.user_metadata.full_name}</span>
        <button onClick={handleSignOut} className={styles.button}>
          ログアウト
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={handleSignIn} className={styles.button}>
        Googleでログイン
      </button>
    </div>
  );
}