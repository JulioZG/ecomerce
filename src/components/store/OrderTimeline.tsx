const TIMELINE = ["PENDIENTE", "PAGADO", "EN_PREPARACION", "ENVIADO", "ENTREGADO"]

const LABELS: Record<string, string> = {
  PENDIENTE:      "Pendiente",
  PAGADO:         "Pagado",
  EN_PREPARACION: "En preparación",
  ENVIADO:        "Enviado",
  ENTREGADO:      "Entregado",
}

// Maps each estado to its timestamp prop
const TIMESTAMP_KEY: Record<string, keyof OrderTimelineProps> = {
  PAGADO:         "pagadoAt",
  EN_PREPARACION: "preparandoAt",
  ENVIADO:        "enviadoAt",
  ENTREGADO:      "entregadoAt",
}

function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date)
  let added = 0
  while (added < days) {
    result.setDate(result.getDate() + 1)
    const day = result.getDay()
    if (day !== 0 && day !== 6) added++
  }
  return result
}

function fmtDate(d: Date | string | null | undefined): string | null {
  if (!d) return null
  return new Date(d).toLocaleDateString("es-MX", {
    day: "numeric", month: "short", year: "numeric",
  })
}

interface OrderTimelineProps {
  currentEstado: string
  pagadoAt?:     Date | string | null
  preparandoAt?: Date | string | null
  enviadoAt?:    Date | string | null
  entregadoAt?:  Date | string | null
}

export function OrderTimeline({
  currentEstado,
  pagadoAt,
  preparandoAt,
  enviadoAt,
  entregadoAt,
}: OrderTimelineProps) {
  if (currentEstado === "CANCELADO") return null

  const currentStep = TIMELINE.indexOf(currentEstado)

  const timestamps: Record<string, Date | string | null | undefined> = {
    pagadoAt, preparandoAt, enviadoAt, entregadoAt,
  }

  // Estimated delivery: enviadoAt + 5 business days
  const estimatedDelivery = enviadoAt && !entregadoAt
    ? fmtDate(addBusinessDays(new Date(enviadoAt), 5))
    : null

  return (
    <div className="bg-[#f5f5f5] p-5">
      {/* Steps */}
      <div className="flex items-start justify-between relative">
        <div className="absolute left-0 right-0 top-4 h-px bg-[#e5e5e5]" />
        {TIMELINE.map((estado, i) => {
          const tsKey = TIMESTAMP_KEY[estado]
          const ts = tsKey ? timestamps[tsKey] : null
          const done = i < currentStep
          const active = i === currentStep

          return (
            <div key={estado} className="flex flex-col items-center gap-1.5 z-10 flex-1">
              <div
                className={`w-8 h-8 flex items-center justify-center text-[11px] font-bold shrink-0 ${
                  done || active
                    ? "bg-[#1a1a1a] text-white"
                    : "bg-white border border-[#e5e5e5] text-[#ccc]"
                }`}
              >
                {done ? "✓" : i + 1}
              </div>
              <span className="text-[10px] text-center text-[#666] hidden sm:block max-w-[70px] uppercase tracking-wide font-medium leading-tight">
                {LABELS[estado]?.split(" ")[0]}
              </span>
              {ts && (
                <span className="text-[9px] text-center text-[#999] hidden sm:block max-w-[70px] leading-tight">
                  {fmtDate(ts)}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Estimated delivery */}
      {estimatedDelivery && (
        <p className="text-[12px] text-[#666] text-center mt-4">
          Entrega estimada: <span className="font-semibold text-[#1a1a1a]">{estimatedDelivery}</span>
        </p>
      )}
    </div>
  )
}
