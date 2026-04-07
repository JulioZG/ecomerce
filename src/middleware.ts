import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const userRole = (req.auth?.user as { role?: string })?.role

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn || userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/iniciar-sesion", req.url))
    }
  }

  if (pathname.startsWith("/mis-pedidos") || pathname.startsWith("/checkout")) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(pathname)
      return NextResponse.redirect(
        new URL(`/iniciar-sesion?callbackUrl=${callbackUrl}`, req.url)
      )
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*", "/mis-pedidos/:path*", "/checkout/:path*"],
}
