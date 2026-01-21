import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { getPrismaClient } from './db'
import { verifyPassword } from './utils'
import type { User } from 'next-auth'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        user: { label: 'Usuario', type: 'text' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.user || !credentials?.password) {
          return null
        }

        const prisma = getPrismaClient()
        if (!prisma) {
          console.error('Prisma client not available')
          return null
        }

        try {
          const worker = await prisma.worker.findUnique({
            where: {
              user: credentials.user as string,
            },
          })

          if (!worker) {
            return null
          }

          // Verificar que el usuario no esté oculto
          if (worker.hidden === 1) {
            return null
          }

          // Verificar password
          if (!worker.password) {
            return null
          }

          const isValidPassword = verifyPassword(
            worker.password,
            credentials.password as string
          )

          if (!isValidPassword) {
            return null
          }

          // Retornar usuario autenticado
          return {
            id: worker.id,
            name: `${worker.firstName} ${worker.lastName}`,
            email: worker.user || undefined,
            role: worker.role,
            permission: worker.permission,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  callbacks: {
    async jwt({ token, user }) {
      // Primer login: agregar datos del usuario al token
      if (user) {
        token.id = user.id as string
        token.role = user.role as string | undefined
        token.permission = user.permission as string | undefined
      }
      return token
    },
    async session({ session, token }) {
      // Agregar datos del token a la sesión
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string | undefined
        session.user.permission = token.permission as string | undefined
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  trustHost: true,
})
