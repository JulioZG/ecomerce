import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect"

export default async function AdminPedidosPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: { select: { cantidad: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  }).catch(() => [])

  const customOrders = await prisma.customUniformOrder.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  }).catch(() => [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pedidos</h1>

      <h2 className="font-semibold text-lg mb-3">Pedidos de productos</h2>
      <div className="bg-white rounded-lg border overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3">Pedido</th>
              <th className="text-left p-3">Cliente</th>
              <th className="text-left p-3">Fecha</th>
              <th className="text-left p-3">Items</th>
              <th className="text-left p-3">Total</th>
              <th className="text-left p-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-3 font-mono text-xs">
                  #{order.id.slice(-8).toUpperCase()}
                </td>
                <td className="p-3">
                  <div>{order.user.name}</div>
                  <div className="text-xs text-muted-foreground">{order.user.email}</div>
                </td>
                <td className="p-3 text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("es-AR")}
                </td>
                <td className="p-3">
                  {order.items.reduce((s, i) => s + i.cantidad, 0)} uds.
                </td>
                <td className="p-3 font-semibold">{formatPrice(order.total)}</td>
                <td className="p-3">
                  <OrderStatusSelect
                    orderId={order.id}
                    currentEstado={order.estado}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="font-semibold text-lg mb-3">Uniformes personalizados</h2>
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3">Equipo</th>
              <th className="text-left p-3">Cliente</th>
              <th className="text-left p-3">Fecha</th>
              <th className="text-left p-3">Unidades</th>
              <th className="text-left p-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {customOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-3 font-medium">{order.nombreEquipo}</td>
                <td className="p-3">
                  <div>{order.user.name}</div>
                  <div className="text-xs text-muted-foreground">{order.user.email}</div>
                </td>
                <td className="p-3 text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("es-AR")}
                </td>
                <td className="p-3">
                  {Object.values(order.cantidades as Record<string, number>).reduce((a, b) => a + b, 0)} uds.
                </td>
                <td className="p-3">
                  <Badge variant="secondary">{order.estado.replace("_", " ")}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
