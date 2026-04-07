import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    // Spread providers from config but override Credentials with full authorize
    ...authConfig.providers.filter((p) => p.id !== "credentials"),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password) return null

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        return valid ? user : null
      },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (user) {
        session.user.id = user.id
        ;(session.user as { role?: string }).role = (
          user as { role?: string }
        ).role
      }
      return session
    },
  },
  session: {
    strategy: "database",
  },
})
