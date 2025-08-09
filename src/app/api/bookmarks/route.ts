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
    const { url, title: providedTitle, folder: folder_id } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URLが必要です' }, { status: 400 });
    }

    const title = providedTitle || await getTitleFromUrl(url);

    // 修正点: 作成したブックマークの完全なデータを返すように .select() を追加
    const { data, error } = await supabase.from('bookmarks').insert({
      url,
      title,
      description: '',
      folder_id,
      user_id: user.id,
    }).select('*, folders (id, name)').single(); // 👈 .single() を使って単一のオブジェクトとして受け取る

    if (error) throw error;

    return NextResponse.json(data, { status: 201 }); // 👈 作成したデータを返す
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'ブックマークの作成に失敗しました。' }, { status: 500 });
  }
}