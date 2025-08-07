'use client';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// GA_IDが設定されていない場合は、何も描画しない
export const existsGaId = GA_ID !== '';

// PVを測定する
export const pageview = (path: string) => {
  window.gtag('config', GA_ID, {
    page_path: path,
  });
};

const GoogleAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (existsGaId) {
      const url = pathname + searchParams.toString();
      pageview(url);
    }
  }, [pathname, searchParams]);

  return (
    <>
      {existsGaId && (
        <>
          <Script
            defer
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga" defer strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());    
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}
    </>
  );
};

export default GoogleAnalytics;