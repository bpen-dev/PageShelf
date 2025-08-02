'use client'; // フォーム操作のためClient Component

import { useState } from 'react';
import toast from 'react-hot-toast';
import styles from './page.module.css';
import { FiSend } from 'react-icons/fi';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });

    setIsLoading(false);

    if (response.ok) {
      toast.success('お問い合わせありがとうございます！内容を確認の上、返信いたします。');
      setName('');
      setEmail('');
      setMessage('');
    } else {
      const errorData = await response.json();
      toast.error(errorData.error || '送信に失敗しました。時間をおいて再度お試しください。');
    }
  };

  return (
    <>
      <div className="fixedHeader">
        <h1 className={styles.headerTitle}>お問い合わせ</h1>
      </div>
      <div className="scrollableArea">
        <div className={styles.formContainer}>
          <p className={styles.description}>
            サービスに関するご質問、不具合のご報告、その他ご意見などお気軽にお寄せください。
          </p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>お名前</label>
              <input 
                type="text" 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                className={styles.input} 
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>メールアドレス</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className={styles.input} 
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.label}>お問い合わせ内容</label>
              <textarea 
                id="message" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required 
                className={styles.textarea}
                rows={6}
              />
            </div>
            <button type="submit" disabled={isLoading} className={styles.button}>
              {isLoading ? '送信中...' : <>送信する <FiSend /></>}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}