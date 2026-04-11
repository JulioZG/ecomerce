import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"
import { Plus, Package } from "lucide-react"

export default async function AdminProductosPage() {
  const products = await prisma.product.findMany({
    include: {
      sport: { select: { nombre: true } },
      category: { select: { nombre: true } },
      variants: { select: { stock: true } },
    },
    orderBy: { createdAt: "desc" },
  }).catch(() => [])

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[11px] font-mono text-amber-400 tracking-widest uppercase mb-1">
            Catálogo
          </p>
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Productos</h1>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 text-zinc-950 text-sm font-bold rounded-lg hover:bg-amber-300 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Link>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {products.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-5 py-3.5 text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
                  Producto
                </th>
                <th className="text-left px-5 py-3.5 text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
                  Deporte
                </th>
                <th className="text-left px-5 py-3.5 text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
                  Precio
                </th>
                <th className="text-left px-5 py-3.5 text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
                  Stock
                </th>
                <th className="text-left px-5 py-3.5 text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
                  Estado
                </th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {products.map((p) => {
                const totalStock = p.variants.reduce((s, v) => s + v.stock, 0)
                const lowStock = totalStock > 0 && totalStock <= 10
                return (
                  <tr key={p.id} className="hover:bg-zinc-800/40 transition-colors group">
                    <td className="px-5 py-4">
                      <span className="font-medium text-zinc-200">{p.nombre}</span>
                    </td>
                    <td className="px-5 py-4 text-zinc-500 text-xs font-mono">
                      {p.sport.nombre}
                    </td>
                    <td
                      className="px-5 py-4 font-bold text-zinc-100"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {formatPrice(p.precio)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-mono px-2 py-1 rounded ${
                          totalStock === 0
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : lowStock
                            ? "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                            : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                        }`}
                      >
                        {totalStock} uds.
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-mono px-2 py-1 rounded border ${
                            p.activo
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-zinc-800 text-zinc-500 border-zinc-700"
                          }`}
                        >
                          {p.activo ? "Activo" : "Inactivo"}
                        </span>
                        {p.destacado && (
                          <span className="text-xs font-mono px-2 py-1 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                            ★ Destacado
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/productos/${p.id}`}
                        className="text-xs font-mono text-zinc-500 hover:text-amber-400 transition-colors px-3 py-1.5 rounded border border-zinc-700 hover:border-amber-400/30"
                      >
                        Editar →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <Package className="w-6 h-6 text-zinc-600" />
            </div>
            <div className="text-center">
              <p className="text-zinc-300 font-medium mb-1">Sin productos</p>
              <p className="text-sm text-zinc-600">
                <Link href="/admin/productos/nuevo" className="text-amber-400 hover:text-amber-300 transition-colors">
                  Crear el primero →
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>

      {products.length > 0 && (
        <p className="text-xs font-mono text-zinc-600 mt-3 px-1">
          {products.length} productos en total
        </p>
      )}
    </div>
  )
}
