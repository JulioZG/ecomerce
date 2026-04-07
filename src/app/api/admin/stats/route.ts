import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const [
    totalOrders,
    paidOrders,
    pendingOrders,
    totalCustomOrders,
    totalUsers,
    revenueResult,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { estado: "PAGADO" } }),
    prisma.order.count({ where: { estado: "PENDIENTE" } }),
    prisma.customUniformOrder.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      where: { estado: "PAGADO" },
      _sum: { total: true },
    }),
  ])

  return NextResponse.json({
    totalOrders,
    paidOrders,
    pendingOrders,
    totalCustomOrders,
    totalUsers,
    revenue: revenueResult._sum.total ?? 0,
  })
}
