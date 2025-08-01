import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URLが指定されていません' }, { status: 400 });
  }

  try {
    // タイムアウトと、リダイレクトを追跡する設定を追加
    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000), // 5秒でタイムアウト
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      // サーバーがエラーを返した場合 (404 Not Foundなど)
      return NextResponse.json({ error: 'サイトの情報を取得できませんでした' }, { status: response.status });
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
    
    let favicon = $('link[rel="shortcut icon"]').attr('href') || $('link[rel="icon"]').attr('href');
    if (favicon && !favicon.startsWith('http')) {
      const pageUrl = new URL(url);
      favicon = new URL(favicon, pageUrl.origin).href;
    }

    return NextResponse.json({ 
      title: title.trim(),
      favicon: favicon || `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(url)}`
    });

  } catch (error) {
    // fetch自体が失敗した場合 (無効なURL, CORS, タイムアウトなど)
    console.error('OGP Fetch Error:', error);
    return NextResponse.json({ error: '無効なURLか、サイトにアクセスできませんでした' }, { status: 500 });
  }
}