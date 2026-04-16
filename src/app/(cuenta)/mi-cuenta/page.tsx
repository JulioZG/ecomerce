import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getOrdersByUser, getAddressesByUser } from "@/services/orders"
import { MiCuentaPage } from "@/components/cuenta/MiCuentaPage"
import { Breadcrumb } from "@/components/shared/Breadcrumb"

export default async function Page() {
  const session = await auth()
  if (!session) redirect("/iniciar-sesion?callbackUrl=/mi-cuenta")

  const [addresses, orders] = await Promise.all([
    getAddressesByUser(session.user.id),
    getOrdersByUser(session.user.id),
  ])

  return (
    <div className="bg-white min-h-screen">
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Mi cuenta" }]} />
      <MiCuentaPage user={session.user} addresses={addresses} orders={orders} />
    </div>
  )
}
