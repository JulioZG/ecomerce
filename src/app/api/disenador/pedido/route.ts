import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { sendCustomOrderToProducer } from "@/lib/ses"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const body = await req.json()

  const customOrder = await prisma.customUniformOrder.create({
    data: {
      userId: session.user.id,
      templateId: body.templateId,
      nombreEquipo: body.nombreEquipo,
      colorPrimario: body.colorPrimario,
      colorSecundario: body.colorSecundario,
      logoUrl: body.logoUrl ?? null,
      disenoGeneradoUrl: body.disenoGeneradoUrl ?? null,
      promptUsado: body.promptUsado ?? null,
      cantidades: body.cantidades,
      notasAdicionales: body.notasAdicionales ?? null,
      precioEstimado: body.precioEstimado ?? null,
      addressId: body.addressId ?? null,
      estado: "PENDIENTE_PAGO",
    },
    include: {
      user: { select: { email: true, name: true } },
      template: { select: { nombre: true } },
    },
  })

  // Notify local producer via AWS SES
  await sendCustomOrderToProducer({
    id: customOrder.id,
    nombreEquipo: customOrder.nombreEquipo,
    colorPrimario: customOrder.colorPrimario,
    colorSecundario: customOrder.colorSecundario,
    logoUrl: customOrder.logoUrl,
    disenoGeneradoUrl: customOrder.disenoGeneradoUrl,
    cantidades: customOrder.cantidades as Record<string, number>,
    notasAdicionales: customOrder.notasAdicionales,
    user: customOrder.user,
  })

  return NextResponse.json(customOrder, { status: 201 })
}
