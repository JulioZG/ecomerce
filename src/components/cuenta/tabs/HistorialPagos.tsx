import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { ShoppingBag } from "lucide-react"
import { StatusBadge } from "@/components/shared/StatusBadge"

type Order = {
  id: string
  estado: string
  total: number | { toNumber: () => number } | string
  createdAt: Date | string
  items: {
    product: { nombre: string; images: string[] }
  }[]
}

interface Props {
  orders: Order[]
}

export function HistorialPagos({ orders }: Props) {
  const paid = orders.filter((o) => o.estado === "PAGADO" || o.estado === "EN_PREPARACION" || o.estado === "ENVIADO" || o.estado === "ENTREGADO")

  if (paid.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-[#e5e5e5]">
        <ShoppingBag className="h-8 w-8 text-[#ccc] mx-auto mb-3" strokeWidth={1.5} />
        <p className="text-[14px] text-[#666]">Aún no tienes pagos registrados</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-3">
      {paid.map((order) => {
        const total = typeof order.total === "object" && "toNumber" in order.total
          ? order.total.toNumber()
          : Number(order.total)

        return (
          <Link
            key={order.id}
            href={`/mis-pedidos/${order.id}`}
            className="block border border-[#e5e5e5] p-4 hover:border-[#1a1a1a] transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#1a1a1a]">
                  Pedido #{order.id.slice(-8).toUpperCase()}
                </p>
                <p className="text-[12px] text-[#999] mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString("es-MX", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
                <p className="text-[12px] text-[#666] mt-1.5 line-clamp-1">
                  {order.items.map((i) => i.product.nombre).join(", ")}
                </p>
              </div>
              <div className="text-right shrink-0">
                <StatusBadge estado={order.estado} />
                <p className="text-[15px] font-bold text-[#1a1a1a] mt-1.5">
                  {formatPrice(total)}
                </p>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
