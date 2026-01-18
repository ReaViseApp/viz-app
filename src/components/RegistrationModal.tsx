import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
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

interface RegistrationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRegistrationSuccess: (user: User) => void
}

const TERMS_OF_SERVICE = `TERMS OF SERVICE

Last Updated: January 18, 2026

Welcome to Viz.! By using our service, you agree to these Terms of Service.

1. ACCEPTANCE OF TERMS
By accessing or using Viz., you agree to be bound by these Terms of Service and all applicable laws and regulations.

2. USER ACCOUNTS
- You must provide accurate and complete information when creating an account
- You are responsible for maintaining the security of your account
- You must be at least 13 years old to use Viz.
- One person may not maintain more than one account

3. CONTENT AND PERMISSIONS
- You retain all rights to content you post on Viz.
- By marking content as "Open to Repost", you grant other users permission to use that content
- "Approval Required" content requires your explicit permission before others can repost
- You must respect the permission settings of other users' content

4. PROHIBITED CONDUCT
- You may not post illegal, harmful, or offensive content
- You may not harass, bully, or threaten other users
- You may not spam or attempt to manipulate the platform
- You may not impersonate others or misrepresent your identity

5. INTELLECTUAL PROPERTY
- Users retain copyright to their original content
- Viz. has a license to display and distribute user content on the platform
- Respect copyright and intellectual property rights of others

6. TERMINATION
We reserve the right to terminate or suspend accounts that violate these Terms.

7. DISCLAIMERS
Viz. is provided "as is" without warranties of any kind.

8. LIMITATION OF LIABILITY
Viz. shall not be liable for any indirect, incidental, or consequential damages.

9. CHANGES TO TERMS
We may modify these Terms at any time. Continued use constitutes acceptance of modified Terms.

PRIVACY POLICY

1. INFORMATION WE COLLECT
- Account information (username, email/phone, password)
- Content you post (images, videos, captions)
- Usage data (likes, comments, interactions)

2. HOW WE USE YOUR INFORMATION
- To provide and improve our services
- To communicate with you
- To personalize your experience
- To ensure platform security

3. INFORMATION SHARING
- We do not sell your personal information
- We may share information with service providers who assist us
- We may share information when required by law

4. DATA SECURITY
We implement reasonable security measures to protect your data.

5. YOUR RIGHTS
- You can access and update your information
- You can delete your account
- You can control privacy settings

6. COOKIES
We use cookies to improve user experience and analyze usage.

7. CHANGES TO PRIVACY POLICY
We may update this policy and will notify you of significant changes.

For questions, contact us at privacy@viz.app`

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

export function RegistrationModal({ open, onOpenChange, onRegistrationSuccess }: RegistrationModalProps) {
  const [registrationType, setRegistrationType] = useState<"email" | "phone">("email")
  const [email, setEmail] = useState("")
  const [countryCode, setCountryCode] = useState("+1")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [users, setUsers] = useKV<User[]>("viz-users", [])

  const generateVizBizId = () => {
    return Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join("")
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!username.trim()) {
      newErrors.username = "Username is required"
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    } else if ((users || []).some(u => u.username.toLowerCase() === username.toLowerCase())) {
      newErrors.username = "Username is already taken"
    }

    if (registrationType === "email") {
      if (!email.trim()) {
        newErrors.email = "Email is required"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "Invalid email format"
      }
    } else {
      if (!phoneNumber.trim()) {
        newErrors.phone = "Phone number is required"
      } else if (!/^\d{10,}$/.test(phoneNumber.replace(/\s/g, ""))) {
        newErrors.phone = "Invalid phone number"
      }
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!termsAccepted) {
      newErrors.terms = "You must accept the Terms of Service and Privacy Policy"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting")
      return
    }

    const newUser: User = {
      username,
      email: registrationType === "email" ? email : undefined,
      phone: registrationType === "phone" ? `${countryCode}${phoneNumber}` : undefined,
      password,
      vizBizId: generateVizBizId(),
      avatar: `https://i.pravatar.cc/150?u=${username}`,
      createdAt: new Date().toISOString(),
    }

    setUsers((currentUsers) => [...(currentUsers || []), newUser])
    
    toast.success("Welcome to Viz.!")
    onRegistrationSuccess(newUser)
    onOpenChange(false)
    
    setEmail("")
    setPhoneNumber("")
    setUsername("")
    setPassword("")
    setConfirmPassword("")
    setTermsAccepted(false)
    setErrors({})
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Sign Up for Viz.</DialogTitle>
          <DialogDescription>
            Create your account to start curating visual content
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-4">
            <Tabs value={registrationType} onValueChange={(v) => setRegistrationType(v as "email" | "phone")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Register with Email</TabsTrigger>
                <TabsTrigger value="phone">Register with Phone</TabsTrigger>
              </TabsList>
              
              <TabsContent value="email" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email}</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="phone" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
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
                      id="phone"
                      type="tel"
                      placeholder="1234567890"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className={errors.phone ? "border-destructive flex-1" : "flex-1"}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a unique username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={errors.username ? "border-destructive" : ""}
              />
              {errors.username && (
                <p className="text-sm text-destructive mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? "border-destructive pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={errors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label>Terms of Service and Privacy Policy</Label>
              <ScrollArea className="h-40 w-full rounded-md border p-4 bg-[#FFF0F3]">
                <div className="text-xs whitespace-pre-wrap text-foreground">
                  {TERMS_OF_SERVICE}
                </div>
              </ScrollArea>
              
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                  className="mt-1 data-[state=checked]:bg-[#FFB6C1] data-[state=checked]:border-[#FFB6C1]"
                />
                <Label
                  htmlFor="terms"
                  className="text-sm leading-relaxed cursor-pointer"
                >
                  I have read and accept the Terms of Service and Privacy Policy
                </Label>
              </div>
              {errors.terms && (
                <p className="text-sm text-destructive">{errors.terms}</p>
              )}
            </div>
          </div>
        </ScrollArea>

        <div className="pt-4 border-t">
          <Button
            onClick={handleSubmit}
            disabled={!termsAccepted}
            className="w-full bg-[#FFB6C1] hover:bg-[#FF69B4] text-white disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
          >
            Create Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
