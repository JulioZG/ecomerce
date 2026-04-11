"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { ShoppingCart, Menu, User, LogOut, Settings, Zap, Package, LayoutGrid, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCartStore } from "@/store/cartStore"

const navLinks = [
  { href: "/catalogo", label: "Catálogo", icon: LayoutGrid },
  { href: "/disenador", label: "Diseñá tu uniforme", icon: Wand2 },
]

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const count = useCartStore((s) => s.count())
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN"
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const initials = session?.user.name
    ? session.user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U"

  const UserAvatar = () => (
    <div className="h-8 w-8 rounded-full border-2 border-slate-200 overflow-hidden bg-blue-50 flex items-center justify-center shrink-0">
      {session?.user.image ? (
        <img src={session.user.image} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="text-xs font-semibold text-blue-700">{initials}</span>
      )}
    </div>
  )

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      <div className="container mx-auto flex h-14 items-center gap-6 px-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
            <Zap className="h-3.5 w-3.5 text-white fill-white" />
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900">
            Deportes<span className="text-blue-600">Store</span>
          </span>
        </Link>

        {/* Divider */}
        <div className="hidden md:block h-5 w-px bg-slate-200" />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1">
          {navLinks.map((link) => {
            const active = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <link.icon className="h-3.5 w-3.5 shrink-0" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1 ml-auto">
          {/* Cart — desktop */}
          <Link href="/carrito" className="hidden md:block">
            <button className="relative flex items-center justify-center h-8 w-8 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
              <ShoppingCart className="h-4 w-4" />
              {mounted && count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center leading-none">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>
          </Link>

          {/* User dropdown — desktop */}
          {session ? (
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors focus:outline-none">
                    <UserAvatar />
                    <span className="text-xs font-medium text-slate-700 max-w-[80px] truncate">
                      {session.user.name?.split(" ")[0]}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-56 p-0 rounded-xl shadow-lg border border-slate-200 overflow-hidden bg-white"
                >
                  <div className="px-3.5 py-3 border-b border-slate-100 bg-slate-50/60">
                    <p className="text-sm font-semibold text-slate-900 truncate">{session.user.name}</p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{session.user.email}</p>
                    {isAdmin && (
                      <span className="inline-block mt-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 uppercase tracking-wide">
                        Admin
                      </span>
                    )}
                  </div>
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
            <Button asChild size="sm" className="hidden md:flex h-8 px-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm">
              <Link href="/iniciar-sesion">Ingresar</Link>
            </Button>
          )}

          {/* Mobile hamburger */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="md:hidden flex items-center justify-center h-8 w-8 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 flex flex-col p-0">
              {/* Logo */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
                  <Zap className="h-3.5 w-3.5 text-white fill-white" />
                </div>
                <span className="font-bold text-base">
                  Deportes<span className="text-blue-600">Store</span>
                </span>
              </div>

              {/* Nav items */}
              <div className="flex-1 overflow-auto px-3 py-3 space-y-0.5">
                {navLinks.map((link) => {
                  const active = pathname.startsWith(link.href)
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        active ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <link.icon className="h-4 w-4 shrink-0 text-slate-400" />
                      {link.label}
                    </Link>
                  )
                })}

                <div className="h-px bg-slate-100 my-2" />

                <Link
                  href="/carrito"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <ShoppingCart className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>Carrito</span>
                  {mounted && count > 0 && (
                    <span className="ml-auto h-5 px-1.5 min-w-5 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center">
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </Link>

                {session ? (
                  <>
                    <Link href="/mis-pedidos" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                      <Package className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>Mis pedidos</span>
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                        <Settings className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>Administración</span>
                      </Link>
                    )}
                  </>
                ) : (
                  <Link href="/iniciar-sesion" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                    <User className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>Ingresar</span>
                  </Link>
                )}
              </div>

              {/* User block — bottom */}
              {session && (
                <div className="border-t border-slate-100 px-3 py-3 space-y-1">
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50">
                    <div className="h-8 w-8 shrink-0 rounded-full border border-slate-200 overflow-hidden bg-blue-50 flex items-center justify-center">
                      {session.user.image ? (
                        <img src={session.user.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xs font-semibold text-blue-700">{initials}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800 truncate">{session.user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{session.user.email}</p>
                    </div>
                    {isAdmin && (
                      <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-orange-50 text-orange-600 uppercase">
                        Admin
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
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
