import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'; // 👈 [重要] server.tsからインポートする

export async function POST(request: NextRequest) {
  const supabase = createClient(); // サーバー用のクライアントを作成
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
  }

  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('folders')
      .insert({ name, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
  }
}