import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: NextRequest) {
  // URLのパラメータから対象のURLを取得
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // 指定されたURLのHTMLを取得
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // OGPのタイトル、または通常のタイトルタグを取得
    const title = $('meta[property="og:title"]').attr('content') || $('title').text();

    return NextResponse.json({ title: title || '' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch OGP data' }, { status: 500 });
  }
}