import { prisma } from "@/lib/prisma"

export async function getAddressesByUser(userId: string) {
  try {
    return await prisma.address.findMany({
      where: { userId },
      orderBy: [{ esPrincipal: "desc" }, { createdAt: "desc" }],
    })
  } catch {
    return []
  }
}

export async function getOrdersByUser(userId: string) {
  try {
    return await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: { select: { nombre: true, images: true } } },
          take: 2,
        },
      },
      orderBy: { createdAt: "desc" },
    })
  } catch {
    return []
  }
}

export async function getCustomOrdersByUser(userId: string) {
  try {
    return await prisma.customUniformOrder.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })
  } catch {
    return []
  }
}

export async function getOrderById(orderId: string) {
  try {
    return await prisma.order.findUnique({
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
      // includes new tracking fields: numeroGuia, paqueteria, pagadoAt, etc.
    })
  } catch {
    return null
  }
}

export async function getAdminOrders(take = 50) {
  try {
    return await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: { select: { cantidad: true } },
      },
      orderBy: { createdAt: "desc" },
      take,
    })
  } catch {
    return []
  }
}

export async function getAdminCustomOrders(take = 20) {
  try {
    return await prisma.customUniformOrder.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take,
    })
  } catch {
    return []
  }
}
