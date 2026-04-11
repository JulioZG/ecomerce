import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect"
import { ShoppingBag } from "lucide-react"

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Pedidos</h1>
        <p className="text-sm text-slate-500 mt-1">Gestión de pedidos y uniformes personalizados</p>
      </div>

      {/* Products orders */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Pedidos de productos</h2>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {orders.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  {["Pedido", "Cliente", "Fecha", "Items", "Total", "Estado"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-blue-600">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">{order.user.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{order.user.email}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("es-AR")}
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-sm">
                      {order.items.reduce((s, i) => s + i.cantidad, 0)} uds.
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-5 py-4">
                      <OrderStatusSelect orderId={order.id} currentEstado={order.estado} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500">Sin pedidos todavía</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom orders */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Uniformes personalizados</h2>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {customOrders.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  {["Equipo", "Cliente", "Fecha", "Unidades", "Estado"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-slate-900">{order.nombreEquipo}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">{order.user.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{order.user.email}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("es-AR")}
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-sm">
                      {Object.values(order.cantidades as Record<string, number>).reduce((a, b) => a + b, 0)} uds.
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                        {order.estado.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <p className="text-sm text-slate-400">Sin uniformes personalizados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
