"use client"

import { useState } from "react"
import { MisDatos }       from "./tabs/MisDatos"
import { MisDirecciones } from "./tabs/MisDirecciones"
import { HistorialPagos } from "./tabs/HistorialPagos"

type Tab = "datos" | "direcciones" | "pagos"

const TABS: { id: Tab; label: string }[] = [
  { id: "datos",       label: "Mis datos" },
  { id: "direcciones", label: "Direcciones" },
  { id: "pagos",       label: "Historial de pagos" },
]

interface Props {
  user: {
    id: string
    name?: string | null
    email: string
    image?: string | null
  }
  addresses: Parameters<typeof MisDirecciones>[0]["initialAddresses"]
  orders:    Parameters<typeof HistorialPagos>[0]["orders"]
}

export function MiCuentaPage({ user, addresses, orders }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("datos")

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#1a1a1a] uppercase tracking-tight mb-8">
        Mi cuenta
      </h1>

      {/* Tab nav */}
      <div className="flex border-b border-[#e5e5e5] mb-8 gap-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-[#1a1a1a] text-[#1a1a1a]"
                : "border-transparent text-[#999] hover:text-[#666]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "datos"       && <MisDatos user={user} />}
      {activeTab === "direcciones" && <MisDirecciones initialAddresses={addresses} />}
      {activeTab === "pagos"       && <HistorialPagos orders={orders} />}
    </div>
  )
}
