const LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente",
  PAGADO: "Pagado",
  EN_PREPARACION: "En preparación",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
}

const STORE_STYLES: Record<string, string> = {
  PENDIENTE:       "bg-[#f5f5f5] text-[#666]",
  PAGADO:          "bg-[#e8f5e9] text-[#2e7d32]",
  EN_PREPARACION:  "bg-[#e3f2fd] text-[#1565c0]",
  ENVIADO:         "bg-[#e3f2fd] text-[#1565c0]",
  ENTREGADO:       "bg-[#e8f5e9] text-[#2e7d32]",
  CANCELADO:       "bg-[#ffebee] text-[#c62828]",
}

const ADMIN_STYLES: Record<string, string> = {
  PENDIENTE:       "bg-slate-100 text-slate-600",
  PAGADO:          "bg-green-50 text-green-700",
  EN_PREPARACION:  "bg-blue-50 text-blue-700",
  ENVIADO:         "bg-blue-50 text-blue-700",
  ENTREGADO:       "bg-green-50 text-green-700",
  CANCELADO:       "bg-red-50 text-red-600",
}

interface StatusBadgeProps {
  estado: string
  /** "store" = square pill (Essence style), "admin" = rounded pill */
  variant?: "store" | "admin"
}

export function StatusBadge({ estado, variant = "store" }: StatusBadgeProps) {
  const styles = variant === "admin" ? ADMIN_STYLES : STORE_STYLES
  const shape  = variant === "admin" ? "rounded-full" : ""
  const cls    = styles[estado] ?? "bg-[#f5f5f5] text-[#666]"

  return (
    <span className={`inline-block text-[11px] font-semibold uppercase tracking-[0.08em] px-2.5 py-1 ${shape} ${cls}`}>
      {LABELS[estado] ?? estado.replace("_", " ")}
    </span>
  )
}
