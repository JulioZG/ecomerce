"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingBag, Users, Home, Palette, Zap } from "lucide-react"

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/plantillas", label: "Plantillas IA", icon: Palette },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 bg-zinc-900 border-r border-zinc-800 shrink-0 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-zinc-800">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-amber-400 rounded-md flex items-center justify-center">
            <Zap className="w-4 h-4 text-zinc-950 fill-zinc-950" />
          </div>
          <div>
            <p className="text-sm font-bold text-zinc-100 leading-none">DeportesStore</p>
            <p className="text-[10px] font-mono text-amber-400 tracking-widest uppercase mt-0.5">
              Admin Panel
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest px-3 mb-3">
          Navegación
        </p>
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group ${
                active
                  ? "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 border border-transparent"
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-colors ${
                  active ? "text-amber-400" : "text-zinc-500 group-hover:text-zinc-300"
                }`}
              />
              <span className="font-medium">{label}</span>
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-zinc-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-all duration-150 group border border-transparent"
        >
          <Home className="h-4 w-4 group-hover:text-zinc-300 transition-colors" />
          <span>Ver tienda</span>
        </Link>
      </div>
    </aside>
  )
}
