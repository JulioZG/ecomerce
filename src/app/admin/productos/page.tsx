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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Productos</h1>
          <p className="text-sm text-slate-500 mt-1">{products.length} productos en catálogo</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {products.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Producto</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Deporte</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Precio</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Stock</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Estado</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => {
                const totalStock = p.variants.reduce((s, v) => s + v.stock, 0)
                const lowStock = totalStock > 0 && totalStock <= 10
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-5 py-4 font-medium text-slate-900">{p.nombre}</td>
                    <td className="px-5 py-4 text-slate-500 text-sm">{p.sport.nombre}</td>
                    <td className="px-5 py-4 font-semibold text-slate-900">{formatPrice(p.precio)}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          totalStock === 0
                            ? "bg-red-50 text-red-600"
                            : lowStock
                            ? "bg-orange-50 text-orange-600"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {totalStock} uds.
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            p.activo
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {p.activo ? "Activo" : "Inactivo"}
                        </span>
                        {p.destacado && (
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-orange-50 text-orange-600">
                            Destacado
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/productos/${p.id}`}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-slate-400" />
            </div>
            <div className="text-center">
              <p className="text-slate-700 font-medium mb-1">Sin productos</p>
              <Link href="/admin/productos/nuevo" className="text-sm text-blue-600 hover:underline">
                Crear el primero →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
