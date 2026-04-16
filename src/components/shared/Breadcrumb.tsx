import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="border-b border-[#e5e5e5]">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-1.5 text-[12px] text-[#999]">
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3 w-3" />}
              {item.href ? (
                <Link href={item.href} className="hover:text-[#1a1a1a] transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-[#1a1a1a] font-medium">{item.label}</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
