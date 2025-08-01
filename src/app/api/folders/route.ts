import { NextRequest, NextResponse } from 'next/server';
import { createFolder } from '@/libs/microcms';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
  }

  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    // 👇 createFolderにユーザーIDを渡す
    const data = await createFolder(name, session.user.email);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
  }
}