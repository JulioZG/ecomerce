import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components"

interface OrderItem {
  cantidad: number
  precio: number | string
  product: { nombre: string }
  variant: { talla: string; color: string }
}

interface Props {
  order: {
    id: string
    user: { name?: string | null; email: string }
    total: number | string
    items: OrderItem[]
  }
}

export default function ConfirmacionPedido({ order }: Props) {
  const orderNum = order.id.slice(-8).toUpperCase()

  return (
    <Html>
      <Head />
      <Preview>Tu pedido #{orderNum} fue confirmado</Preview>
      <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f4f4f4" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
          <Heading style={{ color: "#1a56db" }}>
            ¡Tu pedido fue confirmado!
          </Heading>
          <Text>
            Hola {order.user.name ?? "cliente"}, gracias por tu compra.
          </Text>
          <Text>
            <strong>Número de pedido:</strong> #{orderNum}
          </Text>
          <Hr />
          <Section>
            {order.items.map((item, i) => (
              <Row key={i}>
                <Text>
                  {item.cantidad}x {item.product.nombre} — {item.variant.talla} / {item.variant.color}
                  {" "}| ${Number(item.precio).toLocaleString("es-AR")}
                </Text>
              </Row>
            ))}
          </Section>
          <Hr />
          <Text>
            <strong>Total:</strong> ${Number(order.total).toLocaleString("es-AR")}
          </Text>
          <Text style={{ color: "#666", fontSize: "12px" }}>
            Recibirás otro email cuando tu pedido sea enviado.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
