"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCartStore } from "@/store/cartStore"
import { formatPrice } from "@/lib/utils"

interface AddressForm {
  nombre: string
  apellido: string
  calle: string
  numero: string
  piso: string
  ciudad: string
  provincia: string
  codigoPostal: string
  telefono: string
}

const emptyForm: AddressForm = {
  nombre: "",
  apellido: "",
  calle: "",
  numero: "",
  piso: "",
  ciudad: "",
  provincia: "",
  codigoPostal: "",
  telefono: "",
}

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { items, total, clearCart } = useCartStore()
  const [form, setForm] = useState<AddressForm>(emptyForm)
  const [notas, setNotas] = useState("")
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!session) {
      router.push("/iniciar-sesion?callbackUrl=/checkout")
      return
    }
    if (items.length === 0) return

    setLoading(true)
    try {
      // 1. Create address
      const addrRes = await fetch("/api/direcciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const addr = await addrRes.json()

      // 2. Create order
      const orderRes = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: addr.id,
          notas,
          items: items.map((i) => ({ variantId: i.variantId, cantidad: i.cantidad })),
        }),
      })
      const order = await orderRes.json()

      // 3. Create MercadoPago preference
      const prefRes = await fetch("/api/pagos/crear-preferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      })
      const { initPoint } = await prefRes.json()

      clearCart()
      window.location.href = initPoint
    } catch {
      toast.error("Error al procesar el pedido. Intentá de nuevo.")
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="font-semibold text-lg mb-4">Datos de entrega</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input id="apellido" name="apellido" value={form.apellido} onChange={handleChange} required />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="calle">Calle</Label>
                  <Input id="calle" name="calle" value={form.calle} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="numero">Número</Label>
                  <Input id="numero" name="numero" value={form.numero} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="piso">Piso / Depto (opcional)</Label>
                  <Input id="piso" name="piso" value={form.piso} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input id="ciudad" name="ciudad" value={form.ciudad} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="provincia">Provincia</Label>
                  <Input id="provincia" name="provincia" value={form.provincia} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="codigoPostal">Código Postal</Label>
                  <Input id="codigoPostal" name="codigoPostal" value={form.codigoPostal} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" name="telefono" value={form.telefono} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="notas">Notas del pedido (opcional)</Label>
              <Textarea
                id="notas"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Instrucciones especiales..."
                className="mt-1"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-6 h-fit">
            <h2 className="font-bold text-lg mb-4">Resumen del pedido</h2>
            {items.map((item) => (
              <div key={item.variantId} className="flex justify-between text-sm mb-2">
                <span className="truncate max-w-[140px]">
                  {item.nombre} x{item.cantidad}
                </span>
                <span>{formatPrice(item.precio * item.cantidad)}</span>
              </div>
            ))}
            <div className="border-t mt-4 pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-blue-600">{formatPrice(total())}</span>
            </div>
            <Button type="submit" className="w-full mt-4" size="lg" disabled={loading}>
              {loading ? "Procesando..." : "Pagar con MercadoPago"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
