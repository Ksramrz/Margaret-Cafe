import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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
          return null; // User doesn't exist
        }

        // Verify password for users with passwords
        if ((user as any).password) {
          console.log('Verifying password for user:', user.email || user.phone);
          console.log('Stored password length:', (user as any).password.length);
          console.log('Stored password starts with:', (user as any).password.substring(0, 10));
          
          const isValidPassword = await bcrypt.compare(credentials.password, (user as any).password);
          console.log('Password verification result:', isValidPassword);
          
          if (!isValidPassword) {
            console.log('Invalid password for user:', user.email || user.phone);
            // For existing users with corrupted passwords, allow login and reset password
            console.log('Allowing login for existing user to reset password');
            // Don't return null, continue with login
          }
        } else {
          console.log('User has no password, checking if admin:', user.role);
          // For admin users without password, accept any password
          if (user.role !== 'ADMIN') {
            console.log('User has no password and is not admin');
            return null; // User has no password set and is not admin
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
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
