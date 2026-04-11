import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"

const estadoColors: Record<string, string> = {
  PENDIENTE: "secondary",
  PAGADO: "default",
  EN_PREPARACION: "default",
  ENVIADO: "default",
  ENTREGADO: "default",
  CANCELADO: "destructive",
}

const estadoLabels: Record<string, string> = {
  PENDIENTE: "Pendiente",
  PAGADO: "Pagado",
  EN_PREPARACION: "En preparación",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
}

export default async function MisPedidosPage() {
  const session = await auth()
  if (!session) return null

  const [orders, customOrders] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: { product: { select: { nombre: true, images: true } } },
          take: 2,
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.customUniformOrder.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
  ])

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mis pedidos</h1>

      {orders.length === 0 && customOrders.length === 0 && (
        <div className="text-center py-16">
          <p className="text-5xl mb-3">📦</p>
          <p className="text-muted-foreground mb-4">Todavía no realizaste pedidos</p>
          <Button asChild>
            <Link href="/catalogo">Ver catálogo</Link>
          </Button>
        </div>
      )}

      {orders.length > 0 && (
        <div className="space-y-4 mb-8">
          <h2 className="font-semibold text-lg">Pedidos de productos</h2>
          {orders.map((order) => (
            <Link key={order.id} href={`/mis-pedidos/${order.id}`} className="block border rounded-lg p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">
                    Pedido #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("es-AR")}
                  </p>
                  <p className="text-sm mt-1">
                    {order.items.map((i) => i.product.nombre).join(", ")}
                    {order.items.length > 2 ? " y más..." : ""}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={estadoColors[order.estado] as "default" | "secondary" | "destructive" | "outline"}>
                    {estadoLabels[order.estado]}
                  </Badge>
                  <p className="font-bold text-blue-600 mt-1">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {customOrders.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Uniformes personalizados</h2>
          {customOrders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{order.nombreEquipo}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("es-AR")}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-sm">
                    <span
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: order.colorPrimario }}
                    />
                    <span
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: order.colorSecundario }}
                    />
                    <span className="text-muted-foreground">
                      {Object.values(order.cantidades as Record<string, number>).reduce((a, b) => a + b, 0)} unidades
                    </span>
                  </div>
                </div>
                <Badge variant="secondary">
                  {order.estado.replace("_", " ")}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
