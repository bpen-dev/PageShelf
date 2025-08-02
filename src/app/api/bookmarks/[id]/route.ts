import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'; // 👈 [重要] server.tsからインポート

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
  }

  try {
    const contentToUpdate = await request.json();

    // RLSポリシーが所有者チェックを自動で行うため、API側でのチェックは不要
    const { error } = await supabase
      .from('bookmarks')
      .update(contentToUpdate)
      .eq('id', params.id); // 指定したIDの行を更新

    if (error) throw error;

    return NextResponse.json({ message: '更新しました' }, { status: 200 });
  } catch (error) {
    console.error('API Update Error:', error);
    return NextResponse.json({ error: 'ブックマークの更新に失敗しました。' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
  }

  try {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', params.id); // 指定したIDの行を削除

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'ブックマークの削除に失敗しました。' }, { status: 500 });
  }
}