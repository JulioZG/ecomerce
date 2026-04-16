"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { useCartStore } from "@/store/cartStore"
import { formatPrice } from "@/lib/utils"
import { Lock, MapPin, Plus } from "lucide-react"
import { Breadcrumb } from "@/components/shared/Breadcrumb"
import { FormField } from "@/components/shared/FormField"
import { AuthGateModal } from "@/components/store/AuthGateModal"

// ─── Types ────────────────────────────────────────────────────────────────────

interface AddressForm {
  nombre: string; apellido: string; calle: string; numero: string
  piso: string; ciudad: string; provincia: string; codigoPostal: string; telefono: string
}

interface SavedAddress extends AddressForm {
  id: string; esPrincipal: boolean
}

const EMPTY_FORM: AddressForm = {
  nombre: "", apellido: "", calle: "", numero: "",
  piso: "", ciudad: "", provincia: "", codigoPostal: "", telefono: "",
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router   = useRouter()
  const { items, total, clearCart } = useCartStore()

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [showNewForm, setShowNewForm]   = useState(false)
  const [form, setForm]                 = useState<AddressForm>(EMPTY_FORM)
  const [notas, setNotas]               = useState("")
  const [loading, setLoading]           = useState(false)

  // Load saved addresses when authenticated
  useEffect(() => {
    if (status !== "authenticated") return
    fetch("/api/direcciones")
      .then((r) => r.json())
      .then((data: SavedAddress[]) => {
        if (!Array.isArray(data)) return
        setSavedAddresses(data)
        const principal = data.find((a) => a.esPrincipal) ?? data[0]
        if (principal) {
          setSelectedAddressId(principal.id)
          setShowNewForm(false)
        } else {
          setShowNewForm(true)
        }
      })
      .catch(() => setShowNewForm(true))
  }, [status])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!session) return
    if (items.length === 0) { toast.error("Tu carrito está vacío"); return }

    setLoading(true)
    try {
      // Resolve address
      let addressId: string

      if (selectedAddressId && !showNewForm) {
        addressId = selectedAddressId
      } else {
        const addrRes = await fetch("/api/direcciones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        const addr = await addrRes.json()
        addressId = addr.id
      }

      // Create order
      const orderRes = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId,
          notas,
          items: items.map((i) => ({ variantId: i.variantId, cantidad: i.cantidad })),
        }),
      })
      const order = await orderRes.json()

      // Create MP preference
      const prefRes = await fetch("/api/pagos/crear-preferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      })
      const { initPoint } = await prefRes.json()

      clearCart()
      window.location.href = initPoint
    } catch {
      toast.error("Error al procesar el pedido. Intenta de nuevo.")
      setLoading(false)
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="bg-white min-h-screen">
      {/* Auth gate — show modal if not authenticated */}
      {status === "unauthenticated" && <AuthGateModal />}

      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Carrito", href: "/carrito" },
          { label: "Checkout" },
        ]}
      />

      <div className="border-b border-[#e5e5e5]">
        <div className="container mx-auto px-4 py-8 md:py-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#1a1a1a] uppercase tracking-tight text-center">
            Checkout
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-10">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-10">

            {/* ── Form ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Saved addresses */}
              {savedAddresses.length > 0 && (
                <div>
                  <h2 className="text-[12px] font-bold tracking-[0.12em] uppercase text-[#1a1a1a] mb-4">
                    Dirección de envío
                  </h2>
                  <div className="space-y-2">
                    {savedAddresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                          selectedAddressId === addr.id && !showNewForm
                            ? "border-[#1a1a1a]"
                            : "border-[#e5e5e5] hover:border-[#ccc]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="addressSelect"
                          value={addr.id}
                          checked={selectedAddressId === addr.id && !showNewForm}
                          onChange={() => { setSelectedAddressId(addr.id); setShowNewForm(false) }}
                          className="mt-0.5 accent-[#1a1a1a]"
                        />
                        <div>
                          <p className="text-[14px] font-medium text-[#1a1a1a]">
                            {addr.nombre} {addr.apellido}
                            {addr.esPrincipal && (
                              <span className="ml-2 text-[10px] font-bold uppercase tracking-wide bg-[#f5f5f5] text-[#666] px-1.5 py-0.5">
                                Principal
                              </span>
                            )}
                          </p>
                          <p className="text-[13px] text-[#666]">
                            {addr.calle} {addr.numero}{addr.piso ? `, ${addr.piso}` : ""}
                          </p>
                          <p className="text-[13px] text-[#666]">
                            {addr.ciudad}, {addr.provincia} {addr.codigoPostal}
                          </p>
                        </div>
                      </label>
                    ))}

                    {/* New address option */}
                    <label
                      className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
                        showNewForm ? "border-[#1a1a1a]" : "border-[#e5e5e5] hover:border-[#ccc]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="addressSelect"
                        checked={showNewForm}
                        onChange={() => { setShowNewForm(true); setSelectedAddressId(null) }}
                        className="accent-[#1a1a1a]"
                      />
                      <div className="flex items-center gap-2 text-[14px] font-medium text-[#1a1a1a]">
                        <Plus className="h-3.5 w-3.5" />
                        Usar otra dirección
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* New address form */}
              {(showNewForm || savedAddresses.length === 0) && (
                <div>
                  <h2 className="text-[12px] font-bold tracking-[0.12em] uppercase text-[#1a1a1a] mb-5 flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    {savedAddresses.length > 0 ? "Nueva dirección" : "Datos de entrega"}
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField id="nombre"       name="nombre"       label="Nombre"        value={form.nombre}       onChange={handleChange} required />
                    <FormField id="apellido"      name="apellido"     label="Apellido"      value={form.apellido}     onChange={handleChange} required />
                    <div className="col-span-2">
                      <FormField id="calle"       name="calle"        label="Calle"         value={form.calle}        onChange={handleChange} required />
                    </div>
                    <FormField id="numero"        name="numero"       label="Número"        value={form.numero}       onChange={handleChange} required />
                    <FormField id="piso"          name="piso"         label="Piso / Depto"  value={form.piso}         onChange={handleChange} optional />
                    <FormField id="ciudad"        name="ciudad"       label="Ciudad"        value={form.ciudad}       onChange={handleChange} required />
                    <FormField id="provincia"     name="provincia"    label="Estado"        value={form.provincia}    onChange={handleChange} required />
                    <FormField id="codigoPostal"  name="codigoPostal" label="Código Postal" value={form.codigoPostal} onChange={handleChange} required />
                    <FormField id="telefono"      name="telefono"     label="Teléfono"      value={form.telefono}     onChange={handleChange} required />
                  </div>
                </div>
              )}

              {/* Notas */}
              <div>
                <label htmlFor="notas" className="block text-[12px] font-medium text-[#666] uppercase tracking-wide mb-1.5">
                  Notas del pedido
                  <span className="normal-case tracking-normal font-normal text-[#999] ml-1">(opcional)</span>
                </label>
                <textarea
                  id="notas"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Instrucciones especiales..."
                  rows={3}
                  className="w-full px-4 py-3 border border-[#e5e5e5] text-[14px] text-[#1a1a1a] placeholder:text-[#999] focus:outline-none focus:border-[#1a1a1a] transition-colors resize-none"
                />
              </div>
            </div>

            {/* ── Summary ── */}
            <div>
              <div className="bg-[#f5f5f5] p-6">
                <h2 className="text-[12px] font-bold tracking-[0.12em] uppercase text-[#1a1a1a] mb-5">
                  Resumen del pedido
                </h2>
                <div className="space-y-2 mb-5">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex justify-between text-[13px]">
                      <span className="truncate max-w-[150px] text-[#666]">{item.nombre} x{item.cantidad}</span>
                      <span className="text-[#1a1a1a] font-medium">{formatPrice(item.precio * item.cantidad)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#e5e5e5] pt-4 flex justify-between items-center">
                  <span className="text-[14px] font-bold text-[#1a1a1a] uppercase tracking-wide">Total</span>
                  <span className="text-[20px] font-bold text-[#1a1a1a]">{formatPrice(total())}</span>
                </div>
                <button
                  type="submit"
                  disabled={loading || status !== "authenticated"}
                  className="flex items-center justify-center gap-2 w-full h-12 mt-5 bg-[#1a1a1a] text-white text-[12px] font-semibold uppercase tracking-[0.1em] hover:bg-[#333] transition-colors disabled:bg-[#ccc]"
                >
                  <Lock className="h-3.5 w-3.5" />
                  {loading ? "Procesando..." : "Pagar con MercadoPago"}
                </button>
                <p className="text-[11px] text-[#999] text-center mt-3">
                  Serás redirigido a MercadoPago para completar el pago de forma segura.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
