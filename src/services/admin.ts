import { prisma } from "@/lib/prisma"

export async function getDashboardStats() {
  const [
    totalOrders,
    paidOrders,
    pendingOrders,
    totalCustomOrders,
    totalUsers,
    revenueResult,
    totalProducts,
  ] = await Promise.all([
    prisma.order.count().catch(() => 0),
    prisma.order.count({ where: { estado: "PAGADO" } }).catch(() => 0),
    prisma.order.count({ where: { estado: "PENDIENTE" } }).catch(() => 0),
    prisma.customUniformOrder.count().catch(() => 0),
    prisma.user.count().catch(() => 0),
    prisma.order
      .aggregate({ where: { estado: "PAGADO" }, _sum: { total: true } })
      .catch(() => ({ _sum: { total: 0 } })),
    prisma.product.count().catch(() => 0),
  ])

  return {
    totalOrders,
    paidOrders,
    pendingOrders,
    totalCustomOrders,
    totalUsers,
    revenue: Number(revenueResult._sum.total ?? 0),
    totalProducts,
  }
}

export async function getAllUsers() {
  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
    })
  } catch {
    return []
  }
}

export async function getTemplates() {
  try {
    return await prisma.uniformTemplate.findMany({
      include: { sport: { select: { nombre: true, icono: true } } },
      orderBy: { sportId: "asc" },
    })
  } catch {
    return []
  }
}

export async function getAdminProducts() {
  try {
    return await prisma.product.findMany({
      include: {
        sport: { select: { nombre: true } },
        category: { select: { nombre: true } },
        variants: { select: { stock: true } },
      },
      orderBy: { createdAt: "desc" },
    })
  } catch {
    return []
  }
}
