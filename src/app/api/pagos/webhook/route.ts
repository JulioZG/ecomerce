import { NextRequest, NextResponse } from "next/server"
import { Payment } from "mercadopago"
import { mpClient } from "@/lib/mercadopago"
import { prisma } from "@/lib/prisma"
import { sendOrderConfirmationEmail } from "@/lib/ses"

const estadoMap: Record<string, string> = {
  approved: "PAGADO",
  rejected: "CANCELADO",
  pending: "PENDIENTE",
  in_process: "PENDIENTE",
  refunded: "CANCELADO",
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.type === "payment") {
      const paymentClient = new Payment(mpClient)
      const payment = await paymentClient.get({ id: body.data.id })

      const orderId = payment.external_reference
      const status = payment.status

      if (!orderId) return NextResponse.json({ ok: true })

      const newEstado = estadoMap[status ?? ""] ?? "PENDIENTE"

      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          estado: newEstado as never,
          mpPaymentId: String(payment.id),
          mpStatus: status,
        },
        include: {
          user: { select: { email: true, name: true } },
          items: {
            include: {
              product: { select: { nombre: true } },
              variant: { select: { talla: true, color: true } },
            },
          },
        },
      })

      if (status === "approved") {
        await sendOrderConfirmationEmail({
          id: order.id,
          user: order.user,
          total: Number(order.total),
          items: order.items.map((item) => ({
            cantidad: item.cantidad,
            precio: Number(item.precio),
            product: item.product,
            variant: item.variant,
          })),
        })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
