import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: { select: { nombre: true, slug: true, images: true } },
          variant: { select: { talla: true, color: true } },
        },
      },
      address: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { addressId, items, notas } = await req.json()

  // Validate stock and calculate total
  const variantIds = items.map((i: { variantId: string }) => i.variantId)
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: { product: { select: { precio: true, nombre: true } } },
  })

  let total = 0
  const orderItems = items.map((item: { variantId: string; cantidad: number }) => {
    const variant = variants.find((v) => v.id === item.variantId)
    if (!variant) throw new Error(`Variante ${item.variantId} no encontrada`)
    if (variant.stock < item.cantidad)
      throw new Error(`Stock insuficiente para ${variant.product.nombre}`)
    const precio = Number(variant.product.precio)
    total += precio * item.cantidad
    return {
      variantId: item.variantId,
      productId: variant.productId,
      cantidad: item.cantidad,
      precio,
    }
  })

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      addressId,
      total,
      notas,
      items: { create: orderItems },
    },
    include: {
      items: {
        include: {
          product: { select: { nombre: true } },
          variant: { select: { talla: true, color: true } },
        },
      },
      address: true,
    },
  })

  // Decrement stock
  await Promise.all(
    items.map((item: { variantId: string; cantidad: number }) =>
      prisma.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.cantidad } },
      })
    )
  )

  return NextResponse.json(order, { status: 201 })
}
