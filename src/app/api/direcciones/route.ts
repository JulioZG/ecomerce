import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const body = await req.json()

  const address = await prisma.address.create({
    data: {
      userId: session.user.id,
      nombre: body.nombre,
      apellido: body.apellido,
      calle: body.calle,
      numero: body.numero,
      piso: body.piso ?? null,
      ciudad: body.ciudad,
      provincia: body.provincia,
      codigoPostal: body.codigoPostal,
      telefono: body.telefono,
    },
  })

  return NextResponse.json(address, { status: 201 })
}
