import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Only add Google provider if credentials are available
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        phone: { label: 'Phone', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email && !credentials?.phone) {
          throw new Error('Email or phone is required');
        }

        let user;
        if (credentials.email) {
          user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
        } else if (credentials.phone) {
          user = await prisma.user.findUnique({
            where: { phone: credentials.phone },
          });
        }

        if (!user) {
          // Only create new user if it's the admin email
          if (credentials.email === 'admin@margaretcafe.com') {
            user = await prisma.user.create({
              data: {
                email: credentials.email,
                phone: credentials.phone,
                name: 'Admin User',
                role: 'ADMIN',
              },
            });
          } else {
            return null; // Don't create random users
          }
        }

        // For admin users, accept any password
        if (user.role === 'ADMIN') {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        }

        return null; // Only allow admin users for now
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token as any;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.sub!;
        (session.user as any).role = (token as any).role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};
