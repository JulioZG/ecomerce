import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, Users, DollarSign, Palette } from "lucide-react"

export default async function AdminDashboard() {
  const [totalOrders, paidOrders, pendingOrders, totalCustomOrders, totalUsers, revenueResult] =
    await Promise.all([
      prisma.order.count().catch(() => 0),
      prisma.order.count({ where: { estado: "PAGADO" } }).catch(() => 0),
      prisma.order.count({ where: { estado: "PENDIENTE" } }).catch(() => 0),
      prisma.customUniformOrder.count().catch(() => 0),
      prisma.user.count().catch(() => 0),
      prisma.order.aggregate({ where: { estado: "PAGADO" }, _sum: { total: true } }).catch(() => ({ _sum: { total: 0 } })),
    ])

  const stats = [
    {
      title: "Ingresos totales",
      value: formatPrice(Number(revenueResult._sum.total ?? 0)),
      sub: `${paidOrders} pedidos pagados`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Pedidos totales",
      value: totalOrders,
      sub: `${pendingOrders} pendientes`,
      icon: ShoppingBag,
      color: "text-blue-600",
    },
    {
      title: "Uniformes custom",
      value: totalCustomOrders,
      sub: "Pedidos personalizados",
      icon: Palette,
      color: "text-purple-600",
    },
    {
      title: "Usuarios",
      value: totalUsers,
      sub: "Registrados",
      icon: Users,
      color: "text-orange-600",
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
