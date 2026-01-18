import { useState } from "react"
import { PencilSimple, Stamp, ListChecks } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

type SidebarPage = "viz-it" | "approval" | "viz-list" | "viz-let"

interface SidebarProps {
  activePage?: SidebarPage
  onPageChange?: (page: SidebarPage) => void
}

export function Sidebar({ activePage = "viz-it", onPageChange }: SidebarProps) {
  const [active, setActive] = useState<SidebarPage>(activePage)

  const handleClick = (page: SidebarPage) => {
    setActive(page)
    onPageChange?.(page)
  }

  const navItems = [
    { id: "viz-it" as SidebarPage, label: "Viz.It", icon: PencilSimple },
    { id: "approval" as SidebarPage, label: "Approval Status", icon: Stamp },
    { id: "viz-list" as SidebarPage, label: "Viz.List", icon: ListChecks },
  ]

  return (
    <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-64 border-r border-border bg-background flex-col gap-6 p-6">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = active === item.id
        
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group",
              isActive 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {isActive && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
            )}
            <Icon 
              size={24} 
              weight={isActive ? "fill" : "regular"}
              className="transition-all"
            />
            <span className="font-semibold text-sm">{item.label}</span>
          </button>
        )
      })}
    </aside>
  )
}
