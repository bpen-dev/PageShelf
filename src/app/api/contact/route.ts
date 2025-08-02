import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'; // 👈 [重要] server.tsからインポート

export async function POST(request: NextRequest) {
  const supabase = createClient(); // 👈 [修正点] 引数なしで呼び出す

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

    return NextResponse.json({ message: '送信しました' }, { status: 201 });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'メッセージの送信に失敗しました。' }, { status: 500 });
  }
}