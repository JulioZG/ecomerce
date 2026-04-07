export type OrderStatusType =
  | "PENDIENTE"
  | "PAGADO"
  | "EN_PREPARACION"
  | "ENVIADO"
  | "ENTREGADO"
  | "CANCELADO"

export type CustomOrderStatusType =
  | "BORRADOR"
  | "PENDIENTE_PAGO"
  | "PAGADO"
  | "EN_PRODUCCION"
  | "ENVIADO"
  | "ENTREGADO"
  | "CANCELADO"

export type RoleType = "CUSTOMER" | "ADMIN"

export interface CartItemLocal {
  variantId: string
  productId: string
  nombre: string
  slug: string
  image: string
  talla: string
  color: string
  precio: number
  cantidad: number
  stock: number
}
