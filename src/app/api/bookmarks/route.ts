import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/libs/microcms';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
  }

  try {
    const json = await request.json();
    const { url, title, description, folder } = json;

    const contentToCreate = {
      url,
      title,
      description,
      folder: folder || null,
      userId: session.user.email, // 👈 ユーザーIDを記録
    };

    const data = await client.create({
      endpoint: 'bookmarks',
      content: contentToCreate,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to create bookmark' }, { status: 500 });
  }
}