import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ShieldAvatar } from "./ShieldAvatar"
import { RegistrationModal } from "./RegistrationModal"
import { LoginModal } from "./LoginModal"
import { useKV } from "@github/spark/hooks"
import { toast } from "sonner"

interface User {
  username: string
  email?: string
  phone?: string
  password: string
  vizBizId: string
  avatar: string
  createdAt: string
}

interface HeaderProps {
  onNavigateToProfile?: () => void
}

export function Header({ onNavigateToProfile }: HeaderProps) {
  const [showRegistration, setShowRegistration] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [currentUser, setCurrentUser] = useKV<User | null>("viz-current-user", null)

  const handleLogout = () => {
    setCurrentUser(null)
    toast.success("You've been logged out")
  }

  const handleProfileClick = () => {
    onNavigateToProfile?.()
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-[32px] font-bold tracking-tight text-foreground">Viz.</h1>
          </div>
          
          {!currentUser ? (
            <div className="flex items-center gap-2 md:gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowLogin(true)}
                className="border-primary text-primary hover:bg-primary/10 text-xs md:text-sm"
              >
                Log In
              </Button>
              <Button 
                size="sm"
                onClick={() => setShowRegistration(true)}
                className="bg-primary text-primary-foreground hover:bg-accent text-xs md:text-sm whitespace-nowrap"
              >
                Sign Up for Viz.
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <ShieldAvatar 
                    src={currentUser.avatar} 
                    alt={currentUser.username}
                    size="small"
                  />
                  <span className="font-bold text-sm hidden md:inline">{currentUser.username}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-48 bg-background shadow-[0_4px_12px_rgba(255,182,193,0.2)]"
              >
                <DropdownMenuItem onClick={handleProfileClick}>My Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Log Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      <RegistrationModal
        open={showRegistration}
        onOpenChange={setShowRegistration}
        onRegistrationSuccess={(user) => setCurrentUser(user)}
      />

      <LoginModal
        open={showLogin}
        onOpenChange={setShowLogin}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />
    </>
  )
}
