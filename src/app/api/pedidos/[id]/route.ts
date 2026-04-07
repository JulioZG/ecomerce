import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: { select: { nombre: true, slug: true, images: true } },
          variant: { select: { talla: true, color: true } },
        },
      },
      address: true,
      user: { select: { name: true, email: true } },
    },
  })

  if (!order) return NextResponse.json({ error: "No encontrado" }, { status: 404 })

  // Only owner or admin can view
  const isAdmin = (session.user as { role?: string }).role === "ADMIN"
  if (order.userId !== session.user.id && !isAdmin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  return NextResponse.json(order)
}
