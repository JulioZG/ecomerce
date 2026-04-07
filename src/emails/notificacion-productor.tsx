import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Text,
} from "@react-email/components"

interface Props {
  customOrder: {
    id: string
    nombreEquipo: string
    colorPrimario: string
    colorSecundario: string
    logoUrl?: string | null
    disenoGeneradoUrl?: string | null
    cantidades: Record<string, number>
    notasAdicionales?: string | null
    user: { name?: string | null; email: string }
  }
}

export default function NotificacionProductor({ customOrder }: Props) {
  const orderNum = customOrder.id.slice(-8).toUpperCase()
  const totalUnidades = Object.values(customOrder.cantidades).reduce(
    (sum, qty) => sum + qty,
    0
  )

  return (
    <Html>
      <Head />
      <Preview>Nuevo pedido de uniforme — {customOrder.nombreEquipo}</Preview>
      <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f4f4f4" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
          <Heading style={{ color: "#1a56db" }}>
            Nuevo pedido de uniforme personalizado
          </Heading>
          <Text>
            <strong>Pedido #:</strong> {orderNum}
          </Text>
          <Text>
            <strong>Equipo:</strong> {customOrder.nombreEquipo}
          </Text>
          <Text>
            <strong>Color primario:</strong>{" "}
            <span
              style={{
                display: "inline-block",
                width: "16px",
                height: "16px",
                backgroundColor: customOrder.colorPrimario,
                verticalAlign: "middle",
                marginRight: "4px",
                border: "1px solid #ccc",
              }}
            />
            {customOrder.colorPrimario}
          </Text>
          <Text>
            <strong>Color secundario:</strong>{" "}
            <span
              style={{
                display: "inline-block",
                width: "16px",
                height: "16px",
                backgroundColor: customOrder.colorSecundario,
                verticalAlign: "middle",
                marginRight: "4px",
                border: "1px solid #ccc",
              }}
            />
            {customOrder.colorSecundario}
          </Text>
          <Hr />
          <Text>
            <strong>Cantidades por talla:</strong>
          </Text>
          {Object.entries(customOrder.cantidades)
            .filter(([, qty]) => qty > 0)
            .map(([talla, qty]) => (
              <Text key={talla} style={{ margin: "2px 0" }}>
                • {talla}: {qty} unidades
              </Text>
            ))}
          <Text>
            <strong>Total unidades:</strong> {totalUnidades}
          </Text>
          <Hr />
          {customOrder.disenoGeneradoUrl && (
            <>
              <Text>
                <strong>Diseño generado por IA:</strong>
              </Text>
              <Img
                src={customOrder.disenoGeneradoUrl}
                alt="Diseño del uniforme"
                width="400"
                style={{ borderRadius: "8px", marginBottom: "16px" }}
              />
            </>
          )}
          {customOrder.logoUrl && (
            <>
              <Text>
                <strong>Logo del equipo:</strong>
              </Text>
              <Img
                src={customOrder.logoUrl}
                alt="Logo"
                width="200"
                style={{ marginBottom: "16px" }}
              />
            </>
          )}
          {customOrder.notasAdicionales && (
            <>
              <Text>
                <strong>Notas adicionales:</strong>
              </Text>
              <Text>{customOrder.notasAdicionales}</Text>
            </>
          )}
          <Hr />
          <Text>
            <strong>Cliente:</strong> {customOrder.user.name ?? ""} ({customOrder.user.email})
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
