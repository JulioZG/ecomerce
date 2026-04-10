"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { ShoppingCart, Menu, User, LogOut, Settings, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
          <Link href="/carrito">
            <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-slate-100">
              <ShoppingCart className="h-5 w-5 text-slate-600" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Button>
          </Link>

          {/* Auth */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 hover:ring-2 hover:ring-blue-200 transition-all">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={session.user.image ?? ""} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-sm">
                      {session.user.name?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-xl shadow-lg border-slate-100">
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-slate-900 truncate">{session.user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="rounded-lg">
                  <Link href="/mis-pedidos" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Mis pedidos
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild className="rounded-lg">
                    <Link href="/admin" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Administración
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="rounded-lg text-red-500 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              <Link href="/iniciar-sesion">Ingresar</Link>
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-full hover:bg-slate-100">
                <Menu className="h-5 w-5 text-slate-600" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex items-center gap-2 mb-8 mt-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white fill-white" />
                </div>
                <span className="font-extrabold text-lg">
                  Deportes<span className="text-blue-600">Store</span>
                </span>
              </div>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              {!session && (
                <div className="mt-6">
                  <Button asChild className="w-full rounded-full">
                    <Link href="/iniciar-sesion">Ingresar</Link>
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
