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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Resumen general de la tienda</p>
      </div>

      {/* Revenue hero card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 mb-5 text-white shadow-lg shadow-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-blue-100">Ingresos totales</span>
          </div>
          <span className="text-xs bg-white/20 text-blue-100 px-2.5 py-1 rounded-full">
            {paidOrders} pedidos pagados
          </span>
        </div>
        <p className="text-4xl font-bold tracking-tight">{formatPrice(revenue)}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Pedidos totales",
            value: totalOrders,
            sub: `${pendingOrders} pendientes`,
            icon: ShoppingBag,
            color: "text-blue-600",
            bg: "bg-blue-50",
            href: "/admin/pedidos",
          },
          {
            label: "Uniformes custom",
            value: totalCustomOrders,
            sub: "Personalizados",
            icon: Palette,
            color: "text-orange-500",
            bg: "bg-orange-50",
            href: "/admin/pedidos",
          },
          {
            label: "Productos",
            value: totalProducts,
            sub: "En catálogo",
            icon: Package,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            href: "/admin/productos",
          },
          {
            label: "Usuarios",
            value: totalUsers,
            sub: "Registrados",
            icon: Users,
            color: "text-violet-600",
            bg: "bg-violet-50",
            href: "/admin/usuarios",
          },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all group card-hover"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-0.5">{stat.value}</p>
            <p className="text-xs font-medium text-slate-500">{stat.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{stat.sub}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100">
          <p className="text-sm font-semibold text-slate-700">Accesos rápidos</p>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { label: "Agregar nuevo producto", href: "/admin/productos/nuevo", desc: "Crear producto con variantes de talla y color" },
            { label: "Ver pedidos recientes", href: "/admin/pedidos", desc: "Gestionar y actualizar estados de pedidos" },
            { label: "Gestionar plantillas IA", href: "/admin/plantillas", desc: "Plantillas base para el diseñador de uniformes" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors group"
            >
              <div>
                <p className="text-sm font-medium text-slate-800 group-hover:text-blue-700 transition-colors">{item.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors shrink-0 ml-4" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
