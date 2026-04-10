import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { ChevronLeft } from "lucide-react"

const ESTADO_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente de pago",
  PAGADO: "Pagado",
  EN_PREPARACION: "En preparación",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
}

const ESTADO_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDIENTE: "secondary",
  PAGADO: "default",
  EN_PREPARACION: "default",
  ENVIADO: "default",
  ENTREGADO: "default",
  CANCELADO: "destructive",
}

const TIMELINE = ["PENDIENTE", "PAGADO", "EN_PREPARACION", "ENVIADO", "ENTREGADO"]

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const session = await auth()
  if (!session) return null

  const { orderId } = await params

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      address: true,
      items: {
        include: {
          product: { select: { nombre: true, images: true, slug: true } },
          variant: { select: { talla: true, color: true } },
        },
      },
    },
  }).catch(() => null)

  if (!order || order.userId !== session.user.id) notFound()

  const currentStep = TIMELINE.indexOf(order.estado)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/mis-pedidos">
            <ChevronLeft className="w-4 h-4" />
            Mis pedidos
          </Link>
        </Button>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Pedido #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {new Date(order.createdAt).toLocaleDateString("es-AR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <Badge variant={ESTADO_COLORS[order.estado]}>
          {ESTADO_LABELS[order.estado]}
        </Badge>
      </div>

      {/* Timeline */}
      {order.estado !== "CANCELADO" && (
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-4 h-px bg-gray-200 -z-0" />
            {TIMELINE.map((estado, i) => (
              <div key={estado} className="flex flex-col items-center gap-1 z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                    i <= currentStep
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-gray-200 text-gray-400"
                  }`}
                >
                  {i < currentStep ? "✓" : i + 1}
                </div>
                <span className="text-xs text-center text-muted-foreground hidden sm:block max-w-[70px]">
                  {ESTADO_LABELS[estado].split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="border rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 font-semibold text-sm">
          Productos ({order.items.length})
        </div>
        <div className="divide-y">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden border bg-gray-50 shrink-0">
                {item.product.images?.[0] ? (
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.nombre}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    👕
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.product.nombre}</p>
                {item.variant && (
                  <p className="text-sm text-muted-foreground">
                    {item.variant.talla} · {item.variant.color}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {item.cantidad} × {formatPrice(Number(item.precio))}
                </p>
              </div>
              <p className="font-semibold shrink-0">
                {formatPrice(Number(item.precio) * item.cantidad)}
              </p>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
          <span className="font-semibold">Total</span>
          <span className="text-xl font-bold text-blue-600">
            {formatPrice(Number(order.total))}
          </span>
        </div>
      </div>

      {/* Shipping address */}
      {order.address && (
        <div className="border rounded-xl p-4 space-y-1">
          <p className="font-semibold text-sm mb-2">Dirección de envío</p>
          <p className="text-sm text-muted-foreground">{order.address.calle}</p>
          <p className="text-sm text-muted-foreground">
            {order.address.ciudad}, {order.address.provincia}
          </p>
        </div>
      )}
    </div>
  )
}
