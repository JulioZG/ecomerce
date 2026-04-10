import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function AdminUsuariosPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  }).catch(() => [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Usuarios ({users.length})</h1>
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3">Usuario</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Rol</th>
              <th className="text-left p-3">Pedidos</th>
              <th className="text-left p-3">Registro</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.image ?? ""} />
                      <AvatarFallback className="text-xs">
                        {user.name?.[0]?.toUpperCase() ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.name ?? "—"}</span>
                  </div>
                </td>
                <td className="p-3 text-muted-foreground">{user.email}</td>
                <td className="p-3">
                  <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </td>
                <td className="p-3">{user._count.orders}</td>
                <td className="p-3 text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString("es-AR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
