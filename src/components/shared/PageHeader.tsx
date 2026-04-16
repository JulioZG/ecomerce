interface PageHeaderProps {
  title: string
  subtitle?: string
  eyebrow?: string
  align?: "left" | "center"
  size?: "sm" | "md" | "lg"
}

const titleSizes = {
  sm: "text-2xl md:text-3xl",
  md: "text-3xl md:text-4xl",
  lg: "text-4xl md:text-5xl",
}

export function PageHeader({
  title,
  subtitle,
  eyebrow,
  align = "center",
  size = "md",
}: PageHeaderProps) {
  const alignClass = align === "center" ? "text-center" : "text-left"

  return (
    <div className="border-b border-[#e5e5e5]">
      <div className={`container mx-auto px-4 py-10 md:py-14 ${alignClass}`}>
        {eyebrow && (
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#999] font-medium mb-3">
            {eyebrow}
          </p>
        )}
        <h1
          className={`font-heading ${titleSizes[size]} font-bold text-[#1a1a1a] uppercase tracking-tight`}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-[14px] text-[#666] mt-3 max-w-md mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
