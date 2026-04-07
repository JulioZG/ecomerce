import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg text-blue-600 mb-2">DeportesStore</h3>
            <p className="text-sm text-muted-foreground">
              Ropa deportiva de calidad para todos los deportes.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Navegación</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link href="/catalogo" className="hover:text-blue-600">Catálogo</Link></li>
              <li><Link href="/disenador" className="hover:text-blue-600">Diseñar uniforme</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Mi cuenta</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link href="/iniciar-sesion" className="hover:text-blue-600">Ingresar</Link></li>
              <li><Link href="/mis-pedidos" className="hover:text-blue-600">Mis pedidos</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} DeportesStore. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
