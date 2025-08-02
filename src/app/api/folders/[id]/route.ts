import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// フォルダの所有者かを確認するヘルパー関数
async function checkFolderOwnership(folderId: string, userEmail: string) {
  const supabase = createClient();
  const { data: folder, error } = await supabase
    .from('folders')
    .select('user_id')
    .eq('id', folderId)
    .single();
    
  if (error || !folder) return false;
  
  const { data: { user } } = await supabase.auth.getUser();
  return user ? folder.user_id === user.id : false;
}

// フォルダ名を更新 (PATCH)
export async function PATCH(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> } // 👈 await対応済み
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
  }

  const params = await paramsPromise; // 👈 await済み
  const isOwner = await checkFolderOwnership(params.id, user.email || '');
  if (!isOwner) {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 });
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

// フォルダを削除 (DELETE)
export async function DELETE(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> } // 👈 [修正点1]
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
  }

  const params = await paramsPromise; // 👈 [修正点2] awaitでparamsを取得
  const isOwner = await checkFolderOwnership(params.id, user.email || '');
  if (!isOwner) {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 });
  }
  
  try {
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', params.id); // 👈 ここで使うparamsが正しくなる
      
    if (error) throw error;
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Delete Folder API Error:', error);
    return NextResponse.json({ error: 'フォルダの削除に失敗しました。' }, { status: 500 });
  }
}