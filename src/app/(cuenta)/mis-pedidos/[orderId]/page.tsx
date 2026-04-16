import { auth } from "@/lib/auth"
import { getOrderById } from "@/services/orders"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import { ChevronLeft, MapPin, Package } from "lucide-react"
import { Breadcrumb } from "@/components/shared/Breadcrumb"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { OrderTimeline } from "@/components/store/OrderTimeline"

// ─── Tracking URLs ────────────────────────────────────────────────────────────

const TRACKING_URLS: Record<string, string> = {
  Estafeta: "https://www.estafeta.com/Estafeta/Rastreo/rastreoInternet.aspx?waybillNumber=",
  FedEx:    "https://www.fedex.com/fedextrack/?trknbr=",
  DHL:      "https://www.dhl.com/mx-es/home/rastreo.html?tracking-id=",
  "J&T":    "https://www.jtexpress.mx/index/query/gzquery.html?bills=",
  Otro:     "",
}

function buildTrackingUrl(paqueteria: string | null, guia: string | null): string | null {
  if (!paqueteria || !guia) return null
  const base = TRACKING_URLS[paqueteria]
  return base !== undefined ? (base ? `${base}${guia}` : null) : null
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const session = await auth()
  if (!session) return null

  const { orderId } = await params
  const order = await getOrderById(orderId)

  if (!order || order.userId !== session.user.id) notFound()

  const trackingUrl = buildTrackingUrl(order.paqueteria, order.numeroGuia)

  return (
    <div className="bg-white min-h-screen">
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Mis pedidos", href: "/mis-pedidos" },
          { label: `#${order.id.slice(-8).toUpperCase()}` },
        ]}
      />

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl space-y-8">

        {/* Back + title */}
        <div>
          <Link
            href="/mis-pedidos"
            className="inline-flex items-center gap-1 text-[12px] font-medium text-[#666] uppercase tracking-wide hover:text-[#1a1a1a] transition-colors mb-4"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Volver a mis pedidos
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#1a1a1a] uppercase tracking-tight">
                Pedido #{order.id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-[13px] text-[#999] mt-1">
                {new Date(order.createdAt).toLocaleDateString("es-MX", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </p>
            </div>
            <StatusBadge estado={order.estado} />
          </div>
        </div>

        {/* Timeline con timestamps */}
        <OrderTimeline
          currentEstado={order.estado}
          pagadoAt={order.pagadoAt}
          preparandoAt={order.preparandoAt}
          enviadoAt={order.enviadoAt}
          entregadoAt={order.entregadoAt}
        />

        {/* Tracking banner */}
        {order.numeroGuia && (
          <div className="border border-[#e5e5e5] p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-[#666] shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-[12px] font-bold tracking-[0.08em] uppercase text-[#1a1a1a]">
                  Número de guía
                </p>
                <p className="font-mono text-[14px] font-semibold text-[#1a1a1a] mt-0.5">
                  {order.numeroGuia}
                </p>
                {order.paqueteria && (
                  <p className="text-[12px] text-[#999]">{order.paqueteria}</p>
                )}
              </div>
            </div>
            {trackingUrl && (
              <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-5 py-2.5 bg-[#1a1a1a] text-white text-[12px] font-semibold uppercase tracking-[0.08em] hover:bg-[#333] transition-colors"
              >
                Rastrear →
              </a>
            )}
          </div>
        )}

        {/* Items */}
        <div className="border border-[#e5e5e5]">
          <div className="bg-[#f5f5f5] px-5 py-3">
            <span className="text-[12px] font-bold tracking-[0.1em] uppercase text-[#1a1a1a]">
              Productos ({order.items.length})
            </span>
          </div>
          <div className="divide-y divide-[#e5e5e5]">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-5">
                <div className="relative w-16 h-20 bg-[#f5f5f5] shrink-0 overflow-hidden">
                  {item.product.images?.[0] ? (
                    <Image src={item.product.images[0]} alt={item.product.nombre} fill className="object-cover" sizes="64px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">👕</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-[#1a1a1a] truncate">{item.product.nombre}</p>
                  {item.variant && (
                    <p className="text-[12px] text-[#999] mt-0.5">
                      {item.variant.talla} · {item.variant.color}
                    </p>
                  )}
                  <p className="text-[12px] text-[#666] mt-0.5">
                    {item.cantidad} × {formatPrice(Number(item.precio))}
                  </p>
                </div>
                <p className="text-[14px] font-semibold text-[#1a1a1a] shrink-0">
                  {formatPrice(Number(item.precio) * item.cantidad)}
                </p>
              </div>
            ))}
          </div>
          <div className="bg-[#f5f5f5] px-5 py-4 flex justify-between items-center">
            <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#1a1a1a]">Total</span>
            <span className="text-[20px] font-bold text-[#1a1a1a]">{formatPrice(Number(order.total))}</span>
          </div>
        </div>

        {/* Address */}
        {order.address && (
          <div className="border border-[#e5e5e5] p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-[#666]" strokeWidth={1.5} />
              <span className="text-[12px] font-bold tracking-[0.1em] uppercase text-[#1a1a1a]">
                Dirección de envío
              </span>
            </div>
            <p className="text-[14px] text-[#666]">
              {order.address.nombre} {order.address.apellido}
            </p>
            <p className="text-[14px] text-[#666]">{order.address.calle} {order.address.numero}</p>
            <p className="text-[14px] text-[#666]">
              {order.address.ciudad}, {order.address.provincia} {order.address.codigoPostal}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
