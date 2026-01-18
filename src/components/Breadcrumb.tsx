import { CaretRight, House } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  onClick?: () => void
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-2 text-sm mb-4", className)}>
      <button
        onClick={items[0]?.onClick}
        className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        aria-label="Home"
      >
        <House className="w-4 h-4" />
      </button>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <CaretRight className="w-4 h-4 text-muted-foreground" />
          {index === items.length - 1 ? (
            <span className="font-medium text-foreground">{item.label}</span>
          ) : (
            <button
              onClick={item.onClick}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </button>
          )}
        </div>
      ))}
    </nav>
  )
}
