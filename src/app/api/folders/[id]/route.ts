import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

async function checkFolderOwnership(folderId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: folder } = await supabase
    .from('folders')
    .select('user_id')
    .eq('id', folderId)
    .single();
    
  if (!folder) return false;
  return folder.user_id === user.id;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });

  const isOwner = await checkFolderOwnership(params.id);
  if (!isOwner) return NextResponse.json({ error: '権限がありません' }, { status: 403 });
  
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
  } catch (err) {
    return NextResponse.json({ error: 'フォルダの更新に失敗しました。' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });

  const isOwner = await checkFolderOwnership(params.id);
  if (!isOwner) return NextResponse.json({ error: '権限がありません' }, { status: 403 });
  
  try {
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', params.id);
    if (error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('Delete Folder API Error:', err);
    return NextResponse.json({ error: 'フォルダの削除に失敗しました。' }, { status: 500 });
  }
}