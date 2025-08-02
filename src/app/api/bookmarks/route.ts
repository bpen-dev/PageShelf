import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import * as cheerio from 'cheerio';

async function getTitleFromUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    if (!response.ok) return url;
    const html = await response.text();
    const $ = cheerio.load(html);
    const title = $('meta[property="og:title"]').attr('content') || $('title').text();
    return title.trim() || url;
  } catch (error) {
    return url;
  }
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
  }

  try {
    const { url, title: providedTitle, folder: folder_id } = await request.json(); // 👈 folderをfolder_idに変更

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URLが必要です' }, { status: 400 });
    }

    // OGP取得ロジックをPOST APIに統合
    const title = providedTitle || await getTitleFromUrl(url);

    const { error } = await supabase.from('bookmarks').insert({
      url,
      title,
      description: '',
      folder_id, // 👈 ここもfolder_idに
      user_id: user.id,
    });

    if (error) throw error;

    return NextResponse.json({ message: '成功しました' }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'ブックマークの作成に失敗しました。' }, { status: 500 });
  }
}