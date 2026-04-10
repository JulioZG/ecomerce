import Link from "next/link"
import { Zap, Globe, MessageCircle, Share2 } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 w-fit">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white fill-white" />
              </div>
              <span className="font-extrabold text-lg text-white">
                Deportes<span className="text-blue-400">Store</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Ropa deportiva de calidad para todos los deportes. Uniformes personalizados
              con inteligencia artificial.
            </p>
            <div className="flex gap-3 mt-5">
              {[Globe, MessageCircle, Share2].map((Icon, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-slate-800 hover:bg-blue-600 flex items-center justify-center cursor-pointer transition-colors">
                  <Icon className="h-3.5 w-3.5 text-slate-400 hover:text-white" />
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Tienda</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/catalogo" className="hover:text-white transition-colors">Catálogo</Link></li>
              <li><Link href="/catalogo?deporte=futbol" className="hover:text-white transition-colors">Fútbol</Link></li>
              <li><Link href="/catalogo?deporte=basquet" className="hover:text-white transition-colors">Básquet</Link></li>
              <li><Link href="/catalogo?deporte=running" className="hover:text-white transition-colors">Running</Link></li>
              <li><Link href="/disenador" className="hover:text-white transition-colors">Diseñar uniforme</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Mi cuenta</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/iniciar-sesion" className="hover:text-white transition-colors">Ingresar</Link></li>
              <li><Link href="/registrarse" className="hover:text-white transition-colors">Registrarse</Link></li>
              <li><Link href="/mis-pedidos" className="hover:text-white transition-colors">Mis pedidos</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} DeportesStore. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Pagos procesados por</span>
            <span className="text-blue-400 font-semibold ml-1">MercadoPago</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
