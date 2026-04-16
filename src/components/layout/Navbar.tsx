"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import {
  ShoppingCart,
  Menu,
  User,
  LogOut,
  Settings,
  Package,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCartStore } from "@/store/cartStore"

const announcements = [
  "ENVÍO GRATIS EN COMPRAS MAYORES A $2,500",
  "DEVOLUCIONES FÁCILES — 30 DÍAS",
  "DISEÑA TU UNIFORME CON IA",
]

const navLinks = [
  { href: "/catalogo", label: "CATÁLOGO", hasMega: true },
  { href: "/disenador", label: "DISEÑADOR", hasMega: false },
  { href: "/nosotros", label: "NOSOTROS", hasMega: false },
  { href: "/faq", label: "FAQ", hasMega: false },
  { href: "/contacto", label: "CONTACTO", hasMega: false },
]

const megaMenu = {
  columns: [
    {
      title: "DEPORTES",
      links: [
        { label: "Fútbol", href: "/catalogo?deporte=futbol" },
        { label: "Básquet", href: "/catalogo?deporte=basquet" },
        { label: "Running", href: "/catalogo?deporte=running" },
        { label: "Vóley", href: "/catalogo?deporte=voley" },
      ],
    },
    {
      title: "PLAYERAS",
      links: [
        { label: "Playeras", href: "/catalogo?categoria=camisetas" },
        { label: "Remeras", href: "/catalogo?categoria=remeras" },
        { label: "Uniformes IA", href: "/disenador" },
      ],
    },
    {
      title: "SHORTS Y CALZADO",
      links: [
        { label: "Shorts", href: "/catalogo?categoria=shorts" },
        { label: "Calzado", href: "/catalogo?categoria=calzado" },
        { label: "Calzas", href: "/catalogo?categoria=calzas" },
      ],
    },
    {
      title: "ACCESORIOS",
      links: [
        { label: "Medias", href: "/catalogo?categoria=medias" },
        { label: "Ver todo", href: "/catalogo" },
      ],
    },
  ],
  images: [
    {
      src: "https://essence-theme-bold.myshopify.com/cdn/shop/products/AdobeStock_496639065_f725d272-b313-453f-a3f0-b8bd6987f7cd.jpg?v=1693912820&width=600",
      label: "PLAYERAS",
      href: "/catalogo?categoria=camisetas",
    },
    {
      src: "https://essence-theme-bold.myshopify.com/cdn/shop/products/AdobeStock_521714581_e357b363-ae89-400f-99b8-884dbbcdd242.jpg?v=1693912800&width=600",
      label: "CALZADO",
      href: "/catalogo?categoria=calzado",
    },
  ],
}

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const count = useCartStore((s) => s.count())
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN"
  const [mounted, setMounted] = useState(false)
  const [announcementIndex, setAnnouncementIndex] = useState(0)
  const [megaOpen, setMegaOpen] = useState(false)
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [mobileSubmenu, setMobileSubmenu] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((i) => (i + 1) % announcements.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // Close mega on route change
  useEffect(() => {
    setMegaOpen(false)
  }, [pathname])

  const initials = session?.user.name
    ? session.user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U"

  function handleMegaEnter() {
    if (megaTimeout.current) clearTimeout(megaTimeout.current)
    setMegaOpen(true)
  }

  function handleMegaLeave() {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 200)
  }

  return (
    <>
      {/* ── Announcement Bar ─────────────────────────────── */}
      <div className="bg-white border-b border-[#e5e5e5] py-2.5 relative">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <button
            onClick={() => setAnnouncementIndex((i) => (i - 1 + announcements.length) % announcements.length)}
            className="absolute left-4 text-[#666] hover:text-[#1a1a1a] transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <p className="text-[11px] tracking-[0.15em] uppercase text-[#1a1a1a] font-medium text-center">
            {announcements[announcementIndex]}
          </p>
          <button
            onClick={() => setAnnouncementIndex((i) => (i + 1) % announcements.length)}
            className="absolute right-4 text-[#666] hover:text-[#1a1a1a] transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ── Main Header ──────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#e5e5e5]">
        <div className="container mx-auto px-4 flex items-center h-16 relative">

          {/* Left nav — desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.label}
                onMouseEnter={link.hasMega ? handleMegaEnter : undefined}
                onMouseLeave={link.hasMega ? handleMegaLeave : undefined}
              >
                <Link
                  href={link.href}
                  className={`flex items-center gap-0.5 px-3 py-2 text-[12px] font-medium tracking-[0.08em] uppercase transition-colors ${
                    pathname.startsWith(link.href) && link.href !== "#"
                      ? "text-[#1a1a1a]"
                      : "text-[#1a1a1a] hover:text-[#007AFF]"
                  }`}
                >
                  {link.label}
                  {link.hasMega && (
                    <ChevronDown
                      className={`h-3 w-3 ml-0.5 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`}
                    />
                  )}
                </Link>
              </div>
            ))}
          </nav>

          {/* Center logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 font-heading text-[28px] font-bold tracking-[0.06em] text-[#1a1a1a] uppercase"
          >
            ATLÉTICA
          </Link>

          {/* Right icons */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Currency — desktop */}
            <span className="hidden lg:flex items-center gap-1 text-[11px] tracking-wide text-[#666] uppercase">
              🇲🇽 MXN $
            </span>

            {/* Search */}
            <button className="hidden lg:flex items-center justify-center h-9 w-9 text-[#1a1a1a] hover:text-[#007AFF] transition-colors">
              <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>

            {/* Account */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden lg:flex items-center justify-center h-9 w-9 text-[#1a1a1a] hover:text-[#007AFF] transition-colors">
                    <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-52 p-0 rounded-none border border-[#e5e5e5] shadow-md bg-white"
                >
                  <div className="px-4 py-3 border-b border-[#e5e5e5]">
                    <p className="text-[13px] font-semibold text-[#1a1a1a] truncate">{session.user.name}</p>
                    <p className="text-[11px] text-[#666] truncate mt-0.5">{session.user.email}</p>
                  </div>
                  <div className="py-1">
                    <DropdownMenuItem asChild className="rounded-none px-4 py-2.5 cursor-pointer text-[13px] text-[#1a1a1a] hover:bg-[#f5f5f5] focus:bg-[#f5f5f5]">
                      <Link href="/mis-pedidos" className="flex items-center gap-2.5">
                        <Package className="h-4 w-4 text-[#666]" />
                        Mis pedidos
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild className="rounded-none px-4 py-2.5 cursor-pointer text-[13px] text-[#1a1a1a] hover:bg-[#f5f5f5] focus:bg-[#f5f5f5]">
                        <Link href="/admin" className="flex items-center gap-2.5">
                          <Settings className="h-4 w-4 text-[#666]" />
                          Administración
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="rounded-none px-4 py-2.5 cursor-pointer text-[13px] text-red-600 hover:bg-red-50 focus:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2.5" />
                      Cerrar sesión
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/iniciar-sesion"
                className="hidden lg:flex items-center justify-center h-9 w-9 text-[#1a1a1a] hover:text-[#007AFF] transition-colors"
              >
                <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/carrito"
              className="relative flex items-center justify-center h-9 w-9 text-[#1a1a1a] hover:text-[#007AFF] transition-colors"
            >
              <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={1.5} />
              {mounted && count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-[18px] min-w-[18px] px-1 rounded-full bg-[#1a1a1a] text-[10px] font-bold text-white flex items-center justify-center leading-none">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="lg:hidden flex items-center justify-center h-9 w-9 text-[#1a1a1a]">
                  <Menu className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 flex flex-col p-0 bg-white">
                {/* Mobile header */}
                <div className="px-5 py-4 border-b border-[#e5e5e5] flex items-center justify-between">
                  <span className="font-heading text-xl font-bold tracking-[0.06em] uppercase">
                    ATLÉTICA
                  </span>
                </div>

                {/* Mobile nav */}
                <div className="flex-1 overflow-auto py-4">
                  {/* CATÁLOGO with expandable submenu */}
                  <button
                    onClick={() => setMobileSubmenu(!mobileSubmenu)}
                    className="w-full flex items-center justify-between px-6 py-3.5 text-[13px] font-medium tracking-[0.08em] uppercase text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors"
                  >
                    CATÁLOGO
                    <ChevronDown className={`h-3.5 w-3.5 text-[#999] transition-transform duration-200 ${mobileSubmenu ? "rotate-180" : ""}`} />
                  </button>

                  {mobileSubmenu && (
                    <div className="bg-[#fafafa] border-y border-[#e5e5e5]">
                      {megaMenu.columns.map((col) => (
                        <div key={col.title} className="px-6 py-3">
                          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#999] mb-2">
                            {col.title}
                          </p>
                          {col.links.map((link) => (
                            <Link
                              key={link.label}
                              href={link.href}
                              className="block py-1.5 text-[13px] text-[#1a1a1a] hover:text-[#007AFF] transition-colors"
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Other nav links */}
                  {navLinks.filter((l) => !l.hasMega).map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="flex items-center justify-between px-6 py-3.5 text-[13px] font-medium tracking-[0.08em] uppercase text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}

                  <div className="h-px bg-[#e5e5e5] my-3 mx-6" />

                  <Link
                    href="/carrito"
                    className="flex items-center justify-between px-6 py-3.5 text-[13px] font-medium tracking-[0.08em] uppercase text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <ShoppingCart className="h-4 w-4" strokeWidth={1.5} />
                      CARRITO
                    </span>
                    {mounted && count > 0 && (
                      <span className="h-5 min-w-5 px-1.5 rounded-full bg-[#1a1a1a] text-[10px] font-bold text-white flex items-center justify-center">
                        {count}
                      </span>
                    )}
                  </Link>

                  {session ? (
                    <>
                      <Link
                        href="/mis-pedidos"
                        className="flex items-center gap-2.5 px-6 py-3.5 text-[13px] font-medium tracking-[0.08em] uppercase text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors"
                      >
                        <Package className="h-4 w-4" strokeWidth={1.5} />
                        MIS PEDIDOS
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2.5 px-6 py-3.5 text-[13px] font-medium tracking-[0.08em] uppercase text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors"
                        >
                          <Settings className="h-4 w-4" strokeWidth={1.5} />
                          ADMIN
                        </Link>
                      )}
                    </>
                  ) : (
                    <Link
                      href="/iniciar-sesion"
                      className="flex items-center gap-2.5 px-6 py-3.5 text-[13px] font-medium tracking-[0.08em] uppercase text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors"
                    >
                      <User className="h-4 w-4" strokeWidth={1.5} />
                      INGRESAR
                    </Link>
                  )}
                </div>

                {/* Mobile footer */}
                {session && (
                  <div className="border-t border-[#e5e5e5] px-6 py-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-9 w-9 rounded-full bg-[#f5f5f5] flex items-center justify-center shrink-0">
                        {session.user.image ? (
                          <img src={session.user.image} alt="" className="h-full w-full rounded-full object-cover" />
                        ) : (
                          <span className="text-xs font-semibold text-[#1a1a1a]">{initials}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-[#1a1a1a] truncate">{session.user.name}</p>
                        <p className="text-[11px] text-[#666] truncate">{session.user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center gap-2 text-[12px] font-medium tracking-[0.08em] uppercase text-red-600 hover:text-red-700"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      CERRAR SESIÓN
                    </button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* ── Mega Dropdown ─────────────────────────────────── */}
        {megaOpen && (
          <div
            className="hidden lg:block absolute left-0 w-full bg-white border-b border-[#e5e5e5] shadow-sm z-40"
            onMouseEnter={handleMegaEnter}
            onMouseLeave={handleMegaLeave}
          >
            <div className="container mx-auto px-4 py-10 flex gap-12">
              {/* Category columns */}
              <div className="flex gap-14 flex-1">
                {megaMenu.columns.map((col) => (
                  <div key={col.title}>
                    <p className="text-[12px] font-bold tracking-[0.12em] uppercase text-[#1a1a1a] mb-4">
                      {col.title}
                    </p>
                    <ul className="space-y-2.5">
                      {col.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="text-[14px] text-[#666] hover:text-[#1a1a1a] transition-colors"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Feature images */}
              <div className="flex gap-5 shrink-0">
                {megaMenu.images.map((img) => (
                  <Link key={img.label} href={img.href} className="group relative block w-52">
                    <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#f0f0f0]">
                      <Image
                        src={img.src}
                        alt={img.label}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="208px"
                      />
                    </div>
                    <p className="mt-3 text-center text-[12px] font-bold tracking-[0.1em] uppercase text-[#1a1a1a]">
                      {img.label}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
