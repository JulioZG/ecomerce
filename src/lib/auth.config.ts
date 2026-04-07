import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

// Edge-compatible config (no Prisma) — used by middleware
export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      // authorize is intentionally omitted here — only used server-side in auth.ts
      authorize: () => null,
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdmin = (auth?.user as { role?: string })?.role === "ADMIN"
      const { pathname } = nextUrl

      if (pathname.startsWith("/admin") && !isAdmin) return false
      if (
        (pathname.startsWith("/mis-pedidos") ||
          pathname.startsWith("/checkout")) &&
        !isLoggedIn
      )
        return false

      return true
    },
  },
  pages: {
    signIn: "/iniciar-sesion",
    error: "/iniciar-sesion",
  },
}
