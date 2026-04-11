import { prisma } from "@/lib/prisma"
import { Users } from "lucide-react"

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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Usuarios</h1>
        <p className="text-sm text-slate-500 mt-1">{users.length} usuarios registrados</p>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {users.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Usuario</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Rol</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Pedidos</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => {
                const initials = user.name
                  ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
                  : (user.email?.[0] ?? "?").toUpperCase()
                const isAdmin = user.role === "ADMIN"

                return (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    {/* Avatar + name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name ?? ""}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                        )}
                        <span className="font-medium text-slate-800">{user.name ?? "—"}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4 text-slate-500">{user.email}</td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          isAdmin
                            ? "bg-orange-50 text-orange-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {isAdmin ? "Admin" : "Cliente"}
                      </span>
                    </td>

                    {/* Orders */}
                    <td className="px-5 py-4">
                      <span
                        className={`text-sm font-semibold ${
                          user._count.orders > 0 ? "text-blue-600" : "text-slate-400"
                        }`}
                      >
                        {user._count.orders}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-sm text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-500 text-sm">Sin usuarios registrados</p>
          </div>
        )}
      </div>
    </div>
  )
}
