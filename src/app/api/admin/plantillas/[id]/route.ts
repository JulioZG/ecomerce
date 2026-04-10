import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { nombre, sportId, imagenBase } = await req.json()
    if (!nombre || !sportId || !imagenBase) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }
    const template = await prisma.uniformTemplate.update({
      where: { id },
      data: { nombre, sportId, imagenBase },
    })
    return NextResponse.json(template)
  } catch {
    return NextResponse.json({ error: "Error al actualizar plantilla" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.uniformTemplate.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Error al eliminar plantilla" }, { status: 500 })
  }
}
