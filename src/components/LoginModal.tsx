import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

interface OTPData {
  code: string
  expiresAt: number
  identifier: string
}

const COUNTRY_CODES = [
  { code: "+1", country: "US/Canada" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "India" },
  { code: "+86", country: "China" },
  { code: "+81", country: "Japan" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+61", country: "Australia" },
  { code: "+55", country: "Brazil" },
  { code: "+82", country: "South Korea" },
]

export function LoginModal({ open, onOpenChange, onLoginSuccess }: LoginModalProps) {
  const [loginType, setLoginType] = useState<"email" | "phone">("email")
  const [authMethod, setAuthMethod] = useState<"password" | "otp">("password")
  
  const [email, setEmail] = useState("")
  const [countryCode, setCountryCode] = useState("+1")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  const [otpCode, setOtpCode] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [currentOTP, setCurrentOTP] = useState<OTPData | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(0)
  
  const [error, setError] = useState("")
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [users] = useKV<User[]>("viz-users", [])

  useEffect(() => {
    if (currentOTP && timeRemaining > 0) {
      const timer = setInterval(() => {
        const remaining = Math.max(0, Math.floor((currentOTP.expiresAt - Date.now()) / 1000))
        setTimeRemaining(remaining)
        
        if (remaining === 0) {
          setCurrentOTP(null)
          setCodeSent(false)
          toast.error("Code expired. Please request a new one.")
        }
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [currentOTP, timeRemaining])

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const getIdentifier = () => {
    return loginType === "email" ? email : `${countryCode}${phoneNumber}`
  }

  const handleSendCode = () => {
    setError("")
    const identifier = getIdentifier()
    
    if (!identifier.trim()) {
      setError(`Please enter your ${loginType === "email" ? "email" : "phone number"}`)
      return
    }

    const userExists = (users || []).some(u => 
      loginType === "email" 
        ? u.email?.toLowerCase() === identifier.toLowerCase()
        : u.phone === identifier
    )

    if (!userExists) {
      setError(`No account found with this ${loginType === "email" ? "email" : "phone number"}`)
      return
    }

    const code = generateOTP()
    const expiresAt = Date.now() + 5 * 60 * 1000
    
    setCurrentOTP({ code, expiresAt, identifier })
    setCodeSent(true)
    setTimeRemaining(300)
    
    console.log(`OTP Code for ${identifier}: ${code}`)
    
    toast.success(
      `Code sent! Check your ${loginType === "email" ? "email" : "phone"}.`,
      {
        style: {
          background: "oklch(0.85 0.08 150)",
          color: "oklch(0.25 0 0)",
        }
      }
    )
  }

  const handlePasswordLogin = () => {
    setError("")
    const identifier = getIdentifier()

    if (!identifier.trim()) {
      setError(`Please enter your ${loginType === "email" ? "email" : "phone number"}`)
      return
    }

    if (!password) {
      setError("Please enter your password")
      return
    }

    const user = (users || []).find(u => {
      const identifierMatch = loginType === "email"
        ? u.email?.toLowerCase() === identifier.toLowerCase()
        : u.phone === identifier
      return identifierMatch && u.password === password
    })

    if (!user) {
      setError("Invalid credentials. Please try again.")
      return
    }

    toast.success("Welcome back!")
    onLoginSuccess(user)
    onOpenChange(false)
    resetForm()
  }

  const handleOTPLogin = () => {
    setError("")
    
    if (!otpCode.trim()) {
      setError("Please enter the verification code")
      return
    }

    if (!currentOTP) {
      setError("No code was sent. Please request a new code.")
      return
    }

    if (Date.now() > currentOTP.expiresAt) {
      setError("Code has expired. Please request a new code.")
      setCurrentOTP(null)
      setCodeSent(false)
      return
    }

    if (otpCode !== currentOTP.code) {
      setError("Invalid code. Please try again.")
      return
    }

    const user = (users || []).find(u => 
      loginType === "email"
        ? u.email?.toLowerCase() === currentOTP.identifier.toLowerCase()
        : u.phone === currentOTP.identifier
    )

    if (!user) {
      setError("User not found")
      return
    }

    toast.success("Welcome back!")
    onLoginSuccess(user)
    onOpenChange(false)
    resetForm()
  }

  const handleForgotPassword = () => {
    setShowForgotPassword(true)
    toast.info("Password reset flow coming soon!", {
      description: "For now, please use the One-Time Code option to log in."
    })
  }

  const resetForm = () => {
    setEmail("")
    setPhoneNumber("")
    setPassword("")
    setOtpCode("")
    setCodeSent(false)
    setCurrentOTP(null)
    setTimeRemaining(0)
    setError("")
    setShowPassword(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen)
      if (!isOpen) resetForm()
    }}>
      <DialogContent className="max-w-md bg-background">
        <DialogHeader className="bg-[#FFB6C1] -mx-6 -mt-6 px-6 py-4 rounded-t-lg">
          <DialogTitle className="text-2xl font-bold text-white">Log In to Viz.</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Tabs value={loginType} onValueChange={(v) => setLoginType(v as "email" | "phone")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Login with Email</TabsTrigger>
              <TabsTrigger value="phone">Login with Phone</TabsTrigger>
            </TabsList>
          </Tabs>

          {loginType === "email" ? (
            <div>
              <Label htmlFor="login-email">Email Address</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="login-phone">Phone Number</Label>
              <div className="flex gap-2">
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRY_CODES.map((item) => (
                      <SelectItem key={item.code} value={item.code}>
                        {item.code} {item.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="login-phone"
                  type="tel"
                  placeholder="1234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          )}

          <Tabs value={authMethod} onValueChange={(v) => setAuthMethod(v as "password" | "otp")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger 
                value="password"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#FFB6C1] data-[state=active]:bg-transparent rounded-none"
              >
                Password
              </TabsTrigger>
              <TabsTrigger 
                value="otp"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#FFB6C1] data-[state=active]:bg-transparent rounded-none"
              >
                One-Time Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="password" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handlePasswordLogin()}
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
                onClick={handlePasswordLogin}
                className="w-full bg-[#FFB6C1] hover:bg-[#FF69B4] text-white"
              >
                Log In
              </Button>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-[#FFB6C1] hover:text-[#FF69B4] underline w-full text-center"
              >
                Forgot Password?
              </button>
            </TabsContent>

            <TabsContent value="otp" className="space-y-4 mt-4">
              {!codeSent ? (
                <>
                  {error && (
                    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                      {error}
                    </div>
                  )}
                  
                  <Button
                    onClick={handleSendCode}
                    className="w-full bg-[#FFB6C1] hover:bg-[#FF69B4] text-white"
                  >
                    Send Code
                  </Button>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-md bg-[#98D8AA]/20 border border-[#98D8AA]">
                    <p className="text-sm text-foreground">
                      Code sent! Check your {loginType === "email" ? "email" : "phone"}.
                    </p>
                    {timeRemaining > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Code expires in {formatTime(timeRemaining)}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="otp-code">6-Digit Code</Label>
                    <Input
                      id="otp-code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      onKeyDown={(e) => e.key === "Enter" && handleOTPLogin()}
                      maxLength={6}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Dev mode: Check console for OTP code
                    </p>
                  </div>

                  {error && (
                    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Button
                      onClick={handleOTPLogin}
                      className="w-full bg-[#FFB6C1] hover:bg-[#FF69B4] text-white"
                    >
                      Verify & Log In
                    </Button>
                    
                    <Button
                      onClick={handleSendCode}
                      variant="outline"
                      className="w-full"
                    >
                      Resend Code
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
