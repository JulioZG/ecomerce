import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect"
import { Badge } from "@/components/ui/badge"
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
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] font-mono text-amber-400 tracking-widest uppercase mb-1">
          Gestión
        </p>
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Pedidos</h1>
      </div>

      {/* Orders table */}
      <div className="mb-8">
        <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest mb-3">
          Pedidos de productos
        </p>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          {orders.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  {["Pedido", "Cliente", "Fecha", "Items", "Total", "Estado"].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-amber-400">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-zinc-200 text-sm">{order.user.name}</p>
                      <p className="text-zinc-600 text-xs mt-0.5">{order.user.email}</p>
                    </td>
                    <td className="px-5 py-4 text-zinc-500 text-xs font-mono">
                      {new Date(order.createdAt).toLocaleDateString("es-AR")}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-zinc-400">
                        {order.items.reduce((s, i) => s + i.cantidad, 0)} uds.
                      </span>
                    </td>
                    <td
                      className="px-5 py-4 font-bold text-zinc-100"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
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
              <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-zinc-600" />
              </div>
              <p className="text-sm text-zinc-500">Sin pedidos todavía</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom orders */}
      <div>
        <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest mb-3">
          Uniformes personalizados
        </p>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          {customOrders.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  {["Equipo", "Cliente", "Fecha", "Unidades", "Estado"].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {customOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="px-5 py-4 font-medium text-zinc-200">{order.nombreEquipo}</td>
                    <td className="px-5 py-4">
                      <p className="text-zinc-200 text-sm">{order.user.name}</p>
                      <p className="text-zinc-600 text-xs mt-0.5">{order.user.email}</p>
                    </td>
                    <td className="px-5 py-4 text-zinc-500 text-xs font-mono">
                      {new Date(order.createdAt).toLocaleDateString("es-AR")}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-zinc-400">
                        {Object.values(order.cantidades as Record<string, number>).reduce((a, b) => a + b, 0)} uds.
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono px-2 py-1 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                        {order.estado.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <p className="text-sm text-zinc-500">Sin uniformes personalizados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
