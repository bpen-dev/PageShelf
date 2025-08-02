import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PATCH(
  request: NextRequest, 
  { params: paramsPromise }: { params: Promise<{ id: string }> } // 👈 [修正点1]
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
  }

  try {
    const params = await paramsPromise; // 👈 [修正点2] awaitでparamsを取得
    const contentToUpdate = await request.json();

    const { error } = await supabase
      .from('bookmarks')
      .update(contentToUpdate)
      .eq('id', params.id); // 👈 ここで使うparamsが正しくなる

    if (error) throw error;

    return NextResponse.json({ message: '更新しました' }, { status: 200 });
  } catch (error) {
    console.error('API Update Error:', error);
    return NextResponse.json({ error: 'ブックマークの更新に失敗しました。' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest, 
  { params: paramsPromise }: { params: Promise<{ id: string }> } // 👈 [修正点1]
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
  }

  try {
    const params = await paramsPromise; // 👈 [修正点2] awaitでparamsを取得
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', params.id); // 👈 ここで使うparamsが正しくなる

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'ブックマークの削除に失敗しました。' }, { status: 500 });
  }
}