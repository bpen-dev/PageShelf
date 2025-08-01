import NextAuth, { NextAuthOptions } from 'next-auth'; // 👈 NextAuthOptionsを追加
import GoogleProvider from 'next-auth/providers/google';

// 👇 設定をexportできるように定数に切り出す
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };