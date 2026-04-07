import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"

export default async function AdminProductosPage() {
  const products = await prisma.product.findMany({
    include: {
      sport: { select: { nombre: true } },
      category: { select: { nombre: true } },
      variants: { select: { stock: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Button asChild>
          <Link href="/admin/productos/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo producto
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3">Producto</th>
              <th className="text-left p-3">Deporte</th>
              <th className="text-left p-3">Precio</th>
              <th className="text-left p-3">Stock total</th>
              <th className="text-left p-3">Estado</th>
              <th className="text-left p-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => {
              const totalStock = p.variants.reduce((s, v) => s + v.stock, 0)
              return (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-3 font-medium">{p.nombre}</td>
                  <td className="p-3 text-muted-foreground">{p.sport.nombre}</td>
                  <td className="p-3 font-semibold">{formatPrice(p.precio)}</td>
                  <td className="p-3">
                    <Badge variant={totalStock > 0 ? "outline" : "secondary"}>
                      {totalStock} uds.
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge variant={p.activo ? "default" : "secondary"}>
                      {p.activo ? "Activo" : "Inactivo"}
                    </Badge>
                    {p.destacado && (
                      <Badge variant="outline" className="ml-1">Destacado</Badge>
                    )}
                  </td>
                  <td className="p-3">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/productos/${p.id}`}>Editar</Link>
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No hay productos. <Link href="/admin/productos/nuevo" className="text-blue-600 hover:underline">Crear el primero</Link>
          </div>
        )}
      </div>
    </div>
  )
}
