import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeSlash } from "@phosphor-icons/react"
import { toast } from "sonner"
import { useKV } from "@github/spark/hooks"

interface User {
  username: string
  email?: string
  phone?: string
  password: string
  vizBizId: string
  avatar: string
  createdAt: string
}

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLoginSuccess: (user: User) => void
}

export function LoginModal({ open, onOpenChange, onLoginSuccess }: LoginModalProps) {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [users] = useKV<User[]>("viz-users", [])

  const handleSubmit = () => {
    setError("")

    if (!identifier.trim()) {
      setError("Please enter your username, email, or phone number")
      return
    }

    if (!password) {
      setError("Please enter your password")
      return
    }

    const user = (users || []).find(
      (u) =>
        (u.username.toLowerCase() === identifier.toLowerCase() ||
        u.email?.toLowerCase() === identifier.toLowerCase() ||
        u.phone === identifier) &&
        u.password === password
    )

    if (!user) {
      setError("Invalid credentials. Please try again.")
      return
    }

    toast.success(`Welcome back, ${user.username}!`)
    onLoginSuccess(user)
    onOpenChange(false)
    
    setIdentifier("")
    setPassword("")
    setError("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Log In to Viz.</DialogTitle>
          <DialogDescription>
            Enter your credentials to access your account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <Label htmlFor="identifier">Username, Email, or Phone</Label>
            <Input
              id="identifier"
              type="text"
              placeholder="Enter your username, email, or phone"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full bg-primary hover:bg-accent text-primary-foreground"
          >
            Log In
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
