import { NextRequest, NextResponse } from "next/server"
import { Preference } from "mercadopago"
import { mpClient } from "@/lib/mercadopago"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { orderId } = await req.json()

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: { select: { nombre: true } },
          variant: { select: { talla: true, color: true } },
        },
      },
    },
  })

  if (!order) return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })
  if (order.userId !== session.user.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const preference = new Preference(mpClient)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  const response = await preference.create({
    body: {
      items: order.items.map((item) => ({
        id: item.variantId,
        title: `${item.product.nombre} - ${item.variant.talla} / ${item.variant.color}`,
        quantity: item.cantidad,
        unit_price: Number(item.precio),
        currency_id: "MXN",
      })),
      back_urls: {
        success: `${appUrl}/checkout/confirmacion?orderId=${orderId}`,
        failure: `${appUrl}/carrito`,
        pending: `${appUrl}/checkout/confirmacion?orderId=${orderId}`,
      },
      auto_return: "approved",
      notification_url: `${appUrl}/api/pagos/webhook`,
      external_reference: orderId,
    },
  })

  await prisma.order.update({
    where: { id: orderId },
    data: { mpPreferenceId: response.id },
  })

  return NextResponse.json({
    preferenceId: response.id,
    initPoint: response.init_point,
  })
}
