"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { ShoppingCart, Menu, User, LogOut, Settings, Zap, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCartStore } from "@/store/cartStore"

const navLinks = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/disenador", label: "Diseñá tu uniforme" },
]

export function Navbar() {
  const { data: session } = useSession()
  const count = useCartStore((s) => s.count())
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN"
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const initials = session?.user.name
    ? session.user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U"

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md group-hover:bg-blue-700 transition-colors">
            <Zap className="h-4 w-4 text-white fill-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-slate-900">
            Deportes<span className="text-blue-600">Store</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {/* Cart */}
          <Link href="/carrito" className="hidden md:block">
            <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-slate-100">
              <ShoppingCart className="h-5 w-5 text-slate-600" />
              {mounted && count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Button>
          </Link>

          {/* Auth — desktop only */}
          {session ? (
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center h-9 w-9 rounded-full border-2 border-slate-200 hover:border-blue-400 transition-colors overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 bg-white">
                    {session.user.image ? (
                      <img src={session.user.image} alt={session.user.name ?? ""} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 w-full h-full flex items-center justify-center tracking-wide">
                        {initials}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-60 p-0 rounded-xl shadow-lg border border-slate-200 overflow-hidden bg-white"
                >
                  {/* Header */}
                  <div className="px-4 py-3.5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 shrink-0 rounded-full border border-slate-200 overflow-hidden bg-blue-50 flex items-center justify-center">
                        {session.user.image ? (
                          <img src={session.user.image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-sm font-semibold text-blue-700">{initials}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900 truncate leading-tight">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {session.user.email}
                        </p>
                      </div>
                      {isAdmin && (
                        <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-orange-50 text-orange-600 uppercase tracking-wide">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="p-1.5">
                    <DropdownMenuItem asChild className="rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-50 focus:bg-slate-50">
                      <Link href="/mis-pedidos" className="flex items-center gap-2.5">
                        <Package className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="text-sm text-slate-700">Mis pedidos</span>
                      </Link>
                    </DropdownMenuItem>

                    {isAdmin && (
                      <DropdownMenuItem asChild className="rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-50 focus:bg-slate-50">
                        <Link href="/admin" className="flex items-center gap-2.5">
                          <Settings className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="text-sm text-slate-700">Administración</span>
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <div className="my-1 h-px bg-slate-100" />

                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="rounded-lg px-3 py-2 cursor-pointer hover:bg-red-50 focus:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 text-red-400 shrink-0 mr-2.5" />
                      <span className="text-sm text-red-500">Cerrar sesión</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button asChild size="sm" className="hidden md:flex rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              <Link href="/iniciar-sesion">Ingresar</Link>
            </Button>
          )}

          {/* Mobile hamburger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-full hover:bg-slate-100">
                <Menu className="h-5 w-5 text-slate-600" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 flex flex-col p-0">
              {/* Sheet header */}
              <div className="px-5 py-5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white fill-white" />
                  </div>
                  <span className="font-extrabold text-lg">
                    Deportes<span className="text-blue-600">Store</span>
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-auto px-3 py-4 space-y-1">
                {/* User profile block (if logged in) */}
                {session && (
                  <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="h-10 w-10 shrink-0 rounded-full border-2 border-white shadow-sm overflow-hidden bg-blue-50 flex items-center justify-center">
                      {session.user.image ? (
                        <img src={session.user.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-sm font-semibold text-blue-700">{initials}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{session.user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{session.user.email}</p>
                    </div>
                  </div>
                )}

                {/* Nav links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="h-px bg-slate-100 my-2" />

                {/* Cart */}
                <Link
                  href="/carrito"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  <ShoppingCart className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>Carrito</span>
                  {mounted && count > 0 && (
                    <span className="ml-auto h-5 w-5 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center">
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </Link>

                {/* Auth links */}
                {session ? (
                  <>
                    <Link
                      href="/mis-pedidos"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                    >
                      <Package className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>Mis pedidos</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                      >
                        <Settings className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>Administración</span>
                      </Link>
                    )}
                  </>
                ) : (
                  <Link
                    href="/iniciar-sesion"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    <User className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>Ingresar</span>
                  </Link>
                )}
              </div>

              {/* Sign out at bottom */}
              {session && (
                <div className="px-3 py-4 border-t border-slate-100">
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
