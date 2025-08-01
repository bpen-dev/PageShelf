import { useState, useEffect } from 'react';

// value: 監視対象の値, delay: 遅延させる時間 (ミリ秒)
export function useDebounce<T>(value: T, delay: number): T {
  // デバウンスされた値を保持するためのstate
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // valueが変更された後、delayで指定された時間だけ待ってからstateを更新
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 次のeffectが実行される前に、前のタイマーをクリアする
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}