import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"
import { ShoppingBag, Users, TrendingUp, Palette, ArrowUpRight, Package } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const [totalOrders, paidOrders, pendingOrders, totalCustomOrders, totalUsers, revenueResult, totalProducts] =
    await Promise.all([
      prisma.order.count().catch(() => 0),
      prisma.order.count({ where: { estado: "PAGADO" } }).catch(() => 0),
      prisma.order.count({ where: { estado: "PENDIENTE" } }).catch(() => 0),
      prisma.customUniformOrder.count().catch(() => 0),
      prisma.user.count().catch(() => 0),
      prisma.order.aggregate({ where: { estado: "PAGADO" }, _sum: { total: true } }).catch(() => ({ _sum: { total: 0 } })),
      prisma.product.count().catch(() => 0),
    ])

  const revenue = Number(revenueResult._sum.total ?? 0)

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <p className="text-[11px] font-mono text-amber-400 tracking-widest uppercase mb-1">
          Panel de control
        </p>
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Dashboard</h1>
      </div>

      {/* Primary stat — Revenue */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7 mb-5 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 50% -20%, #f59e0b, transparent)",
          }}
        />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/15 border border-amber-400/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-sm text-zinc-400">Ingresos totales</span>
            </div>
            <span className="text-xs font-mono text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
              {paidOrders} pagados
            </span>
          </div>
          <p
            className="text-5xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-mono)", color: "#fbbf24" }}
          >
            {formatPrice(revenue)}
          </p>
        </div>
      </div>

      {/* Secondary stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {[
          {
            label: "Pedidos totales",
            value: totalOrders,
            sub: `${pendingOrders} pendientes`,
            icon: ShoppingBag,
            href: "/admin/pedidos",
          },
          {
            label: "Uniformes custom",
            value: totalCustomOrders,
            sub: "Pedidos personalizados",
            icon: Palette,
            href: "/admin/pedidos",
          },
          {
            label: "Productos",
            value: totalProducts,
            sub: "En catálogo",
            icon: Package,
            href: "/admin/productos",
          },
          {
            label: "Usuarios",
            value: totalUsers,
            sub: "Registrados",
            icon: Users,
            href: "/admin/usuarios",
          },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <stat.icon className="w-4 h-4 text-zinc-500" />
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
            </div>
            <p
              className="text-3xl font-bold text-zinc-100 mb-1"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {stat.value}
            </p>
            <p className="text-xs text-zinc-500">{stat.label}</p>
            <p className="text-xs text-zinc-600 mt-0.5">{stat.sub}</p>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-900/50">
          <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
            Accesos rápidos
          </p>
        </div>
        <div className="divide-y divide-zinc-800">
          {[
            { label: "Agregar nuevo producto", href: "/admin/productos/nuevo", desc: "Crear producto con variantes" },
            { label: "Ver pedidos recientes", href: "/admin/pedidos", desc: "Gestionar y actualizar estados" },
            { label: "Gestionar plantillas IA", href: "/admin/plantillas", desc: "Plantillas para el diseñador" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between px-5 py-4 hover:bg-zinc-800/40 transition-colors group"
            >
              <div>
                <p className="text-sm font-medium text-zinc-200 group-hover:text-white">{item.label}</p>
                <p className="text-xs text-zinc-600 mt-0.5">{item.desc}</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
