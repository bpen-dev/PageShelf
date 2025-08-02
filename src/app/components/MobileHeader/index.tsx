'use client';

import { FiMenu } from 'react-icons/fi';
import styles from './index.module.css';

type Props = {
  onMenuClick: () => void; // メニューボタンがクリックされたことを親に伝える
};

export default function MobileHeader({ onMenuClick }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>🚀 PageShelf</div>
      <button onClick={onMenuClick} className={styles.menuButton}>
        <FiMenu size={24} />
      </button>
    </header>
  );
}