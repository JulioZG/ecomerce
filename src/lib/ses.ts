import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import { render } from "@react-email/render"

export const sesClient = new SESClient({
  region: process.env.AWS_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[]
  subject: string
  html: string
}) {
  const toAddresses = Array.isArray(to) ? to : [to]

  await sesClient.send(
    new SendEmailCommand({
      Source: process.env.EMAIL_FROM!,
      Destination: { ToAddresses: toAddresses },
      Message: {
        Subject: { Data: subject },
        Body: { Html: { Data: html } },
      },
    })
  )
}

export async function sendOrderConfirmationEmail(order: {
  id: string
  user: { email: string; name?: string | null }
  total: number | string
  items: Array<{
    cantidad: number
    precio: number | string
    product: { nombre: string }
    variant: { talla: string; color: string }
  }>
}) {
  // Dynamic import to avoid issues during build
  const { default: ConfirmacionPedido } = await import(
    "@/emails/confirmacion-pedido"
  )
  const html = await render(ConfirmacionPedido({ order }))

  await sendEmail({
    to: order.user.email,
    subject: `Confirmación de pedido #${order.id.slice(-8).toUpperCase()}`,
    html,
  })
}

export async function sendCustomOrderToProducer(customOrder: {
  id: string
  nombreEquipo: string
  colorPrimario: string
  colorSecundario: string
  logoUrl?: string | null
  disenoGeneradoUrl?: string | null
  cantidades: Record<string, number>
  notasAdicionales?: string | null
  user: { email: string; name?: string | null }
}) {
  const { default: NotificacionProductor } = await import(
    "@/emails/notificacion-productor"
  )
  const html = await render(NotificacionProductor({ customOrder }))

  await sendEmail({
    to: process.env.PRODUCER_EMAIL!,
    subject: `Nuevo uniforme personalizado - ${customOrder.nombreEquipo}`,
    html,
  })
}

export async function sendOrderStatusEmail(order: {
  id: string
  estado: string
  user: { email: string; name?: string | null }
}) {
  const { default: ActualizacionEstado } = await import(
    "@/emails/actualizacion-estado"
  )
  const html = await render(ActualizacionEstado({ order }))

  await sendEmail({
    to: order.user.email,
    subject: `Tu pedido #${order.id.slice(-8).toUpperCase()} fue actualizado`,
    html,
  })
}
