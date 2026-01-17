import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

// Admin credentials - In production, store these in a secure database
const ADMIN_USER = {
  id: '1',
  email: process.env.ADMIN_EMAIL || 'admin@mrmelosanctuary.com',
  password: process.env.ADMIN_PASSWORD_HASH || '', // Hashed password
  role: 'admin',
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Check if email matches admin email
        if (credentials.email !== ADMIN_USER.email) {
          return null;
        }

        // Verify password
        const isValid = await bcrypt.compare(
          credentials.password,
          ADMIN_USER.password
        );

        if (!isValid) {
          return null;
        }

        // Return user object
        return {
          id: ADMIN_USER.id,
          email: ADMIN_USER.email,
          role: ADMIN_USER.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};