import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  // Verify ownership
  const address = await prisma.address.findUnique({ where: { id } })
  if (!address || address.userId !== session.user.id) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  }

  // If marking as principal, clear flag from all others first
  if (body.esPrincipal === true) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { esPrincipal: false },
    })
  }

  const updated = await prisma.address.update({
    where: { id },
    data: {
      ...(body.esPrincipal !== undefined && { esPrincipal: body.esPrincipal }),
      ...(body.nombre      !== undefined && { nombre: body.nombre }),
      ...(body.apellido    !== undefined && { apellido: body.apellido }),
      ...(body.calle       !== undefined && { calle: body.calle }),
      ...(body.numero      !== undefined && { numero: body.numero }),
      ...(body.piso        !== undefined && { piso: body.piso }),
      ...(body.ciudad      !== undefined && { ciudad: body.ciudad }),
      ...(body.provincia   !== undefined && { provincia: body.provincia }),
      ...(body.codigoPostal !== undefined && { codigoPostal: body.codigoPostal }),
      ...(body.telefono    !== undefined && { telefono: body.telefono }),
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { id } = await params

  const address = await prisma.address.findUnique({ where: { id } })
  if (!address || address.userId !== session.user.id) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  }

  // Cannot delete address linked to an order
  const hasOrders = await prisma.order.count({ where: { addressId: id } })
  if (hasOrders > 0) {
    return NextResponse.json(
      { error: "No puedes eliminar una dirección asociada a un pedido" },
      { status: 409 }
    )
  }

  await prisma.address.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
