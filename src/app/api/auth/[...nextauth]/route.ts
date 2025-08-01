import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  // 利用する認証プロバイダー（今回はGoogle）
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  // 認証情報をセッションに保存するための秘密鍵
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };