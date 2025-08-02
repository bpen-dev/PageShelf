import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  // お問い合わせは誰でも送信できるので、ここではサーバークライアントではなく、
  // 匿名キーを使ったクライアントを一時的に作成します。
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: '全ての項目を入力してください' }, { status: 400 });
    }

    const { error } = await supabase.from('contacts').insert({
      name,
      email,
      message,
    });

    if (error) throw error;

    // ここでメール通知などの処理を追加することも可能です

    return NextResponse.json({ message: '送信しました' }, { status: 201 });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'メッセージの送信に失敗しました。' }, { status: 500 });
  }
}