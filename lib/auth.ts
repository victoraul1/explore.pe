import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Por favor ingrese email y contraseña');
        }

        await dbConnect();
        
        const guide = await Guide.findOne({ email: credentials.email }).select('+password');
        
        if (!guide) {
          throw new Error('Email o contraseña incorrectos');
        }

        const isPasswordCorrect = await bcrypt.compare(credentials.password, guide.password);
        
        if (!isPasswordCorrect) {
          throw new Error('Email o contraseña incorrectos');
        }

        if (!guide.emailVerified) {
          throw new Error('Por favor verifica tu email primero');
        }

        return {
          id: guide._id.toString(),
          email: guide.email,
          name: guide.name,
          role: guide.role,
          userType: guide.userType,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.userType = (user as any).userType;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.userType = token.userType as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};