import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'; // 👈 [重要] server.tsからインポート

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
  }
  
  try {
    const { name } = await request.json();

    const { data, error } = await supabase
      .from('folders')
      .update({ name })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'フォルダの更新に失敗しました。' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
  }

  try {
    // フォルダ削除時のブックマークの移動は、DBのトリガーで自動化されているので、
    // ここではフォルダを削除するだけでOK
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Delete Folder API Error:', error);
    return NextResponse.json({ error: 'フォルダの削除に失敗しました。' }, { status: 500 });
  }
}