import { NextRequest, NextResponse } from "next/server"

const protectedRoutes = ["/admin", "/mis-pedidos", "/checkout"]

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))

  if (!isProtected) return NextResponse.next()

  // Check for a session cookie (NextAuth sets authjs.session-token or similar)
  const sessionToken =
    request.cookies.get("authjs.session-token") ??
    request.cookies.get("__Secure-authjs.session-token") ??
    request.cookies.get("next-auth.session-token") ??
    request.cookies.get("__Secure-next-auth.session-token")

  if (!sessionToken) {
    const loginUrl = new URL("/iniciar-sesion", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/mis-pedidos/:path*", "/checkout/:path*"],
}
