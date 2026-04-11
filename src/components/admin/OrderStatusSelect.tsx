"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

const ESTADOS = [
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "PAGADO", label: "Pagado" },
  { value: "EN_PREPARACION", label: "En preparación" },
  { value: "ENVIADO", label: "Enviado" },
  { value: "ENTREGADO", label: "Entregado" },
  { value: "CANCELADO", label: "Cancelado" },
]

export function OrderStatusSelect({
  orderId,
  currentEstado,
}: {
  orderId: string
  currentEstado: string
}) {
  const [estado, setEstado] = useState(currentEstado)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleChange(newEstado: string) {
    setEstado(newEstado)
    startTransition(async () => {
      await fetch(`/api/pedidos/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: newEstado }),
      })
      router.refresh()
    })
  }

  return (
    <select
      value={estado}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isPending}
      className="text-xs border rounded px-2 py-1 bg-white disabled:opacity-50"
    >
      {ESTADOS.map((e) => (
        <option key={e.value} value={e.value}>
          {e.label}
        </option>
      ))}
    </select>
  )
}
