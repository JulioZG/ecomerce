import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components"

const estadoLabels: Record<string, string> = {
  PENDIENTE: "Pendiente de pago",
  PAGADO: "Pago confirmado",
  EN_PREPARACION: "En preparación",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
}

interface Props {
  order: {
    id: string
    estado: string
    user: { name?: string | null; email: string }
  }
}

export default function ActualizacionEstado({ order }: Props) {
  const orderNum = order.id.slice(-8).toUpperCase()
  const estadoLabel = estadoLabels[order.estado] ?? order.estado

  return (
    <Html>
      <Head />
      <Preview>Tu pedido #{orderNum} fue actualizado: {estadoLabel}</Preview>
      <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f4f4f4" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
          <Heading style={{ color: "#1a56db" }}>
            Actualización de tu pedido
          </Heading>
          <Text>
            Hola {order.user.name ?? "cliente"}, el estado de tu pedido #{orderNum} cambió a:
          </Text>
          <Text
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#1a56db",
              padding: "12px",
              backgroundColor: "#eff6ff",
              borderRadius: "8px",
              textAlign: "center" as const,
            }}
          >
            {estadoLabel}
          </Text>
          <Text style={{ color: "#666", fontSize: "12px" }}>
            Si tenés alguna consulta, respondé a este email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
