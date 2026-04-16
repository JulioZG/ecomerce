import Link from "next/link"

interface EmptyStateProps {
  emoji: string
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
}

export function EmptyState({ emoji, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-24">
      <p className="text-[56px] mb-4">{emoji}</p>
      <h3 className="font-heading text-xl font-bold text-[#1a1a1a] uppercase tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-[14px] text-[#666] mb-8 max-w-sm mx-auto">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="inline-flex px-7 py-3 bg-[#1a1a1a] text-white text-[12px] font-semibold uppercase tracking-[0.1em] hover:bg-[#333] transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  )
}
