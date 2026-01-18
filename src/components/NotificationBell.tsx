import { useState, useEffect } from "react"
import { Bell, Check, X, ShoppingBag, Sparkle } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useKV } from "@github/spark/hooks"
import { toast } from "sonner"

interface Notification {
  id: string
  type: "approval_request" | "approved" | "declined" | "quoted" | "purchase"
  message: string
  timestamp: string
  read: boolean
  fromUser?: string
  contentId?: string
}

export function NotificationBell() {
  const [notifications, setNotifications] = useKV<Notification[]>("viz-notifications", [])
  const [open, setOpen] = useState(false)

  const unreadCount = (notifications || []).filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((current = []) => 
      current.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications((current = []) => 
      current.map(n => ({ ...n, read: true }))
    )
    toast.success("All notifications marked as read")
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "approval_request":
        return <div className="w-8 h-8 flex items-center justify-center text-peach">📌</div>
      case "approved":
        return <Check className="w-8 h-8 text-mint" weight="bold" />
      case "declined":
        return <X className="w-8 h-8 text-coral" weight="bold" />
      case "quoted":
        return <Sparkle className="w-8 h-8 text-accent" weight="fill" />
      case "purchase":
        return <ShoppingBag className="w-8 h-8 text-primary" weight="fill" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 hover:bg-muted rounded-full transition-colors">
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-coral text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-[380px] bg-background shadow-[0_4px_20px_rgba(255,182,193,0.25)] p-0"
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-base">Notifications</h3>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-sm text-primary hover:text-accent transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {(notifications || []).length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {(notifications || []).map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`w-full p-4 flex gap-3 hover:bg-muted/50 transition-colors text-left ${
                    !notification.read ? "bg-[oklch(0.98_0.02_350)]" : ""
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTimestamp(notification.timestamp)}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-coral rounded-full flex-shrink-0 mt-2" />
                  )}
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
        {(notifications || []).length > 0 && (
          <div className="p-3 border-t border-border text-center">
            <button className="text-sm text-primary hover:text-accent transition-colors font-medium">
              View all notifications
            </button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
