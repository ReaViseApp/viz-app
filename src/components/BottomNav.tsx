import { useState } from "react"
import { PencilSimple, Stamp, ListChecks } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

type SidebarPage = "viz-it" | "approval" | "viz-list" | "viz-let"

interface BottomNavProps {
  activePage?: SidebarPage
  onPageChange?: (page: SidebarPage) => void
}

export function BottomNav({ activePage = "viz-it", onPageChange }: BottomNavProps) {
  const [active, setActive] = useState<SidebarPage>(activePage)

  const handleClick = (page: SidebarPage) => {
    setActive(page)
    onPageChange?.(page)
  }

  const navItems = [
    { id: "viz-it" as SidebarPage, label: "Viz.It", icon: PencilSimple },
    { id: "approval" as SidebarPage, label: "Approval", icon: Stamp },
    { id: "viz-list" as SidebarPage, label: "Viz.List", icon: ListChecks },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all min-w-[44px] min-h-[44px]",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
            >
              <Icon 
                size={24} 
                weight={isActive ? "fill" : "regular"}
              />
              <span className="text-xs font-semibold">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
