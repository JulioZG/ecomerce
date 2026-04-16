import { auth } from "@/lib/auth"
import { getOrdersByUser, getCustomOrdersByUser } from "@/services/orders"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { Package, Palette } from "lucide-react"
import { Breadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { EmptyState } from "@/components/shared/EmptyState"

export default async function MisPedidosPage() {
  const session = await auth()
  if (!session) return null

  const [orders, customOrders] = await Promise.all([
    getOrdersByUser(session.user.id),
    getCustomOrdersByUser(session.user.id),
  ])

  return (
    <div className="bg-white min-h-screen">
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Mis pedidos" }]} />

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#1a1a1a] uppercase tracking-tight mb-8">
          Mis pedidos
        </h1>

        {orders.length === 0 && customOrders.length === 0 && (
          <EmptyState
            emoji="📦"
            title="Aún no tienes pedidos"
            description="Explora nuestro catálogo para encontrar lo que necesitas."
            action={{ label: "Ver catálogo", href: "/catalogo" }}
          />
        )}

        {orders.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <Package className="h-4 w-4 text-[#666]" strokeWidth={1.5} />
              <h2 className="text-[12px] font-bold tracking-[0.12em] uppercase text-[#1a1a1a]">
                Pedidos de productos
              </h2>
            </div>
            <div className="space-y-3">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/mis-pedidos/${order.id}`}
                  className="block border border-[#e5e5e5] p-5 hover:border-[#1a1a1a] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[14px] font-semibold text-[#1a1a1a]">
                        Pedido #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-[12px] text-[#999] mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("es-MX", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-[13px] text-[#666] mt-2 line-clamp-1">
                        {order.items.map((i) => i.product.nombre).join(", ")}
                        {order.items.length > 2 ? " y más..." : ""}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <StatusBadge estado={order.estado} />
                      <p className="text-[16px] font-bold text-[#1a1a1a] mt-2">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {customOrders.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Palette className="h-4 w-4 text-[#666]" strokeWidth={1.5} />
              <h2 className="text-[12px] font-bold tracking-[0.12em] uppercase text-[#1a1a1a]">
                Uniformes personalizados
              </h2>
            </div>
            <div className="space-y-3">
              {customOrders.map((order) => (
                <div key={order.id} className="border border-[#e5e5e5] p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[14px] font-semibold text-[#1a1a1a]">
                        {order.nombreEquipo}
                      </p>
                      <p className="text-[12px] text-[#999] mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("es-MX", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="w-4 h-4 border border-[#e5e5e5]" style={{ backgroundColor: order.colorPrimario }} />
                        <span className="w-4 h-4 border border-[#e5e5e5]" style={{ backgroundColor: order.colorSecundario }} />
                        <span className="text-[12px] text-[#666]">
                          {Object.values(order.cantidades as Record<string, number>).reduce((a, b) => a + b, 0)} unidades
                        </span>
                      </div>
                    </div>
                    <StatusBadge estado={order.estado} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
