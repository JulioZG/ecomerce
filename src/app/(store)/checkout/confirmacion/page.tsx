import Link from "next/link"
import { CheckCircle, Clock, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"

export default async function ConfirmacionPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; status?: string }>
}) {
  const { orderId, status } = await searchParams

  let order = null
  if (orderId) {
    order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, estado: true, total: true },
    })
  }

  const mpStatus = status ?? order?.estado ?? "pending"
  const orderNum = orderId?.slice(-8).toUpperCase()

  const isApproved = mpStatus === "approved" || order?.estado === "PAGADO"
  const isPending = mpStatus === "pending" || mpStatus === "in_process"
  const isFailed = mpStatus === "failure" || order?.estado === "CANCELADO"

  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-lg">
      {isApproved && (
        <>
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">¡Pago confirmado!</h1>
          <p className="text-muted-foreground mb-2">
            Tu pedido #{orderNum} fue procesado exitosamente.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Recibirás un email de confirmación con los detalles.
          </p>
        </>
      )}
      {isPending && (
        <>
          <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Pago pendiente</h1>
          <p className="text-muted-foreground mb-8">
            Tu pago está siendo procesado. Te notificaremos cuando se confirme.
          </p>
        </>
      )}
      {isFailed && (
        <>
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Pago rechazado</h1>
          <p className="text-muted-foreground mb-8">
            No pudimos procesar tu pago. Por favor intentá de nuevo.
          </p>
        </>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {(isApproved || isPending) && (
          <Button asChild variant="outline">
            <Link href="/mis-pedidos">Ver mis pedidos</Link>
          </Button>
        )}
        {isFailed && (
          <Button asChild>
            <Link href="/carrito">Volver al carrito</Link>
          </Button>
        )}
        <Button asChild variant="outline">
          <Link href="/">Ir al inicio</Link>
        </Button>
      </div>
    </div>
  )
}
