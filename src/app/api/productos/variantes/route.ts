import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { productId, talla, color, stock, sku } = await req.json()

  const variant = await prisma.productVariant.create({
    data: { productId, talla, color, stock: Number(stock), sku },
  })

  return NextResponse.json(variant, { status: 201 })
}
