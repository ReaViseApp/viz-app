import { useState } from "react"
import { House, PencilSimple, Stamp, ListChecks } from "@phosphor-icons/react"
import { useKV } from "@github/spark/hooks"
import { cn } from "@/lib/utils"

type SidebarPage = "feed" | "viz-it" | "approval" | "viz-list" | "viz-let"

interface SidebarProps {
  activePage?: SidebarPage
  onPageChange?: (page: SidebarPage) => void
}

interface ApprovalRequest {
  id: string
  requesterId: string
  creatorId: string
  status: "pending" | "approved" | "declined"
}

export function Sidebar({ activePage = "feed", onPageChange }: SidebarProps) {
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
    { id: "viz-it" as SidebarPage, label: "Viz.It", icon: PencilSimple, badge: 0 },
    { id: "approval" as SidebarPage, label: "Approval Status", icon: Stamp, badge: pendingIncomingCount },
    { id: "viz-list" as SidebarPage, label: "Viz.List", icon: ListChecks, badge: 0 },
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
            <div className="relative">
              <Icon 
                size={24} 
                weight={isActive ? "fill" : "regular"}
                className="transition-all"
              />
              {item.badge > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B6B] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </div>
              )}
            </div>
            <span className="font-semibold text-sm">{item.label}</span>
          </button>
        )
      })}
    </aside>
  )
}
