import { useState } from "react"
import { House, PencilSimple, Stamp, ListChecks, Storefront, TrendUp } from "@phosphor-icons/react"
import { useKV } from "@github/spark/hooks"
import { cn } from "@/lib/utils"

type SidebarPage = "feed" | "viz-it" | "approval" | "viz-list" | "viz-let" | "trending" | "profile"

interface BottomNavProps {
  activePage?: SidebarPage
  onPageChange?: (page: SidebarPage) => void
}

interface ApprovalRequest {
  id: string
  requesterId: string
  creatorId: string
  status: "pending" | "approved" | "declined"
}

export function BottomNav({ activePage = "feed", onPageChange }: BottomNavProps) {
  const [active, setActive] = useState<SidebarPage>(activePage)
  const [approvalRequests] = useKV<ApprovalRequest[]>("approval-requests", [])
  const [currentUser] = useKV<{ id?: string; username?: string; vizBizId?: string } | null>("viz-current-user", null)

  const handleClick = (page: SidebarPage) => {
    setActive(page)
    onPageChange?.(page)
  }

  const pendingIncomingCount = (approvalRequests || []).filter(
    (req) => req.creatorId === (currentUser?.id || currentUser?.vizBizId || currentUser?.username) && req.status === "pending"
  ).length

  const navItems = [
    { id: "feed" as SidebarPage, label: "Home", icon: House, badge: 0 },
    { id: "trending" as SidebarPage, label: "Trending", icon: TrendUp, badge: 0 },
    { id: "viz-it" as SidebarPage, label: "Viz.It", icon: PencilSimple, badge: 0 },
    { id: "viz-list" as SidebarPage, label: "Viz.List", icon: ListChecks, badge: 0 },
    { id: "viz-let" as SidebarPage, label: "Viz.Let", icon: Storefront, badge: 0 },
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
              <div className="relative">
                <Icon 
                  size={24} 
                  weight={isActive ? "fill" : "regular"}
                />
                {item.badge > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF6B6B] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </div>
                )}
              </div>
              <span className="text-xs font-semibold">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
