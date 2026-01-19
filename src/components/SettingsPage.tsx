import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShieldAvatar } from "@/components/ShieldAvatar"
import { FollowerManagement } from "@/components/FollowerManagement"
import { 
  Gear, 
  MapPin, 
  CreditCard, 
  Storefront, 
  Plus, 
  Trash, 
  Pencil,
  Check,
  Copy,
  Lock,
  Globe,
  Users,
  Eye
} from "@phosphor-icons/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ShippingAddress {
  id: string
  name: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  isDefault: boolean
}

interface PaymentMethod {
  id: string
  type: "credit-card" | "paypal" | "apple-pay" | "google-pay"
  cardLast4?: string
  cardBrand?: string
  expiryDate?: string
  email?: string
  isDefault: boolean
}

interface Shop {
  id: string
  name: string
  avatar?: string
  description: string
  isActive: boolean
  ownerId: string
}

export function SettingsPage() {
  const [currentUser, setCurrentUser] = useKV<any>("viz-current-user", null)
  const [shippingAddresses, setShippingAddresses] = useKV<ShippingAddress[]>("user-shipping-addresses", [])
  const [paymentMethods, setPaymentMethods] = useKV<PaymentMethod[]>("user-payment-methods", [])
  const [shops, setShops] = useKV<Shop[]>("viz-let-shops", [])
  const [profileVisibility, setProfileVisibility] = useKV<"public" | "followers" | "private">(
    `profile-visibility-${currentUser?.id || currentUser?.vizBizId}`,
    "public"
  )

  const [showAddressForm, setShowAddressForm] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showShopForm, setShowShopForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null)
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null)

  const userShop = shops?.find(s => s.ownerId === currentUser?.vizBizId)
  const trialStartDate = currentUser?.createdAt ? new Date(currentUser.createdAt) : new Date()
  const trialEndDate = new Date(trialStartDate)
  trialEndDate.setFullYear(trialEndDate.getFullYear() + 1)
  const daysLeft = Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  const copyVizBizId = () => {
    if (currentUser?.vizBizId) {
      navigator.clipboard.writeText(currentUser.vizBizId)
      toast.success("Viz.Biz ID copied to clipboard!")
    }
  }

  const handleVisibilityChange = (value: "public" | "followers" | "private") => {
    setProfileVisibility(value)
    setCurrentUser((prev: any) => prev ? { ...prev, profileVisibility: value } : prev)
    toast.success("Profile visibility updated!")
  }

  const handleDeleteAddress = (id: string) => {
    setShippingAddresses((prev) => (prev || []).filter(a => a.id !== id))
    toast.success("Shipping address deleted")
  }

  const handleDeletePayment = (id: string) => {
    setPaymentMethods((prev) => (prev || []).filter(p => p.id !== id))
    toast.success("Payment method deleted")
  }

  const handleSetDefaultAddress = (id: string) => {
    setShippingAddresses((prev) =>
      (prev || []).map(a => ({ ...a, isDefault: a.id === id }))
    )
    toast.success("Default shipping address updated")
  }

  const handleSetDefaultPayment = (id: string) => {
    setPaymentMethods((prev) =>
      (prev || []).map(p => ({ ...p, isDefault: p.id === id }))
    )
    toast.success("Default payment method updated")
  }

  return (
    <div className="w-full max-w-[900px] mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Gear size={32} weight="fill" className="text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        </div>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="buyer" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="buyer">Buyer Info</TabsTrigger>
          <TabsTrigger value="seller">Seller Info</TabsTrigger>
          <TabsTrigger value="shop">My Shop</TabsTrigger>
          <TabsTrigger value="followers">Followers</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="buyer" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <MapPin size={24} weight="fill" className="text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Shipping Addresses</h2>
            </div>

            {(!shippingAddresses || shippingAddresses.length === 0) ? (
              <div className="text-center py-8">
                <MapPin size={48} className="mx-auto mb-3 text-muted-foreground" weight="thin" />
                <p className="text-muted-foreground mb-4">No shipping addresses added</p>
                <Button
                  onClick={() => setShowAddressForm(true)}
                  className="bg-primary hover:bg-accent text-primary-foreground"
                >
                  <Plus size={16} className="mr-2" />
                  Add Shipping Address
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {shippingAddresses.map((address) => (
                  <Card key={address.id} className={cn("p-4", address.isDefault && "border-primary")}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold text-foreground">{address.name}</p>
                          {address.isDefault && (
                            <Badge className="bg-mint text-foreground text-xs">Default</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{address.addressLine1}</p>
                        {address.addressLine2 && (
                          <p className="text-sm text-muted-foreground">{address.addressLine2}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                        <p className="text-sm text-muted-foreground">{address.country}</p>
                        <p className="text-sm text-muted-foreground">{address.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        {!address.isDefault && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSetDefaultAddress(address.id)}
                          >
                            <Check size={14} className="mr-1" />
                            Set Default
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingAddress(address)
                            setShowAddressForm(true)
                          }}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-coral hover:bg-coral/10"
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                <Button
                  onClick={() => setShowAddressForm(true)}
                  variant="outline"
                  className="w-full"
                >
                  <Plus size={16} className="mr-2" />
                  Add New Address
                </Button>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard size={24} weight="fill" className="text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Payment Methods</h2>
            </div>

            {(!paymentMethods || paymentMethods.length === 0) ? (
              <div className="text-center py-8">
                <CreditCard size={48} className="mx-auto mb-3 text-muted-foreground" weight="thin" />
                <p className="text-muted-foreground mb-4">No payment methods added</p>
                <Button
                  onClick={() => setShowPaymentForm(true)}
                  className="bg-primary hover:bg-accent text-primary-foreground"
                >
                  <Plus size={16} className="mr-2" />
                  Add Payment Method
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <Card key={method.id} className={cn("p-4", method.isDefault && "border-primary")}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold text-foreground">
                            {method.type === "credit-card" && `${method.cardBrand} •••• ${method.cardLast4}`}
                            {method.type === "paypal" && `PayPal (${method.email})`}
                            {method.type === "apple-pay" && "Apple Pay"}
                            {method.type === "google-pay" && "Google Pay"}
                          </p>
                          {method.isDefault && (
                            <Badge className="bg-mint text-foreground text-xs">Default</Badge>
                          )}
                        </div>
                        {method.expiryDate && (
                          <p className="text-sm text-muted-foreground">Expires {method.expiryDate}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!method.isDefault && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSetDefaultPayment(method.id)}
                          >
                            <Check size={14} className="mr-1" />
                            Set Default
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-coral hover:bg-coral/10"
                          onClick={() => handleDeletePayment(method.id)}
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                <Button
                  onClick={() => setShowPaymentForm(true)}
                  variant="outline"
                  className="w-full"
                >
                  <Plus size={16} className="mr-2" />
                  Add New Payment Method
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="seller" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Storefront size={24} weight="fill" className="text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Seller Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Viz.Biz ID</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    value={currentUser?.vizBizId || "Not available"}
                    readOnly
                    className="font-mono bg-muted"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={copyVizBizId}
                  >
                    <Copy size={16} />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Your unique seller identification number
                </p>
              </div>

              <div className="p-4 bg-mint/20 border border-mint rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-foreground">Free Trial Status</p>
                  <Badge className="bg-mint text-foreground">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your 1-year free trial started on {trialStartDate.toLocaleDateString()}
                </p>
                <p className="text-sm font-semibold text-foreground mt-2">
                  {daysLeft} days remaining
                </p>
                <div className="w-full bg-muted rounded-full h-2 mt-3">
                  <div
                    className="bg-mint h-2 rounded-full transition-all"
                    style={{ width: `${(daysLeft / 365) * 100}%` }}
                  />
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <p className="mb-2">✓ Unlimited product listings</p>
                <p className="mb-2">✓ Access to Viz.Let marketplace</p>
                <p className="mb-2">✓ Shop customization</p>
                <p>✓ Analytics and insights</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="shop" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Storefront size={24} weight="fill" className="text-primary" />
                <h2 className="text-xl font-semibold text-foreground">My Shop</h2>
              </div>
              {userShop && (
                <Badge className={cn(userShop.isActive ? "bg-mint" : "bg-muted", "text-foreground")}>
                  {userShop.isActive ? "Active" : "Inactive"}
                </Badge>
              )}
            </div>

            {!userShop ? (
              <div className="text-center py-8">
                <Storefront size={48} className="mx-auto mb-3 text-muted-foreground" weight="thin" />
                <p className="text-foreground font-semibold mb-2">Set up your shop</p>
                <p className="text-muted-foreground mb-4">
                  Your shop will be created automatically when you list your first product
                </p>
                <Button
                  onClick={() => setShowShopForm(true)}
                  className="bg-primary hover:bg-accent text-primary-foreground"
                >
                  Customize Shop Now
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="shield-avatar w-[120px] h-[140px] flex-shrink-0 overflow-hidden border-2 border-primary">
                    {userShop.avatar ? (
                      <img
                        src={userShop.avatar}
                        alt={userShop.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Storefront size={48} className="text-muted-foreground" weight="thin" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{userShop.name}</h3>
                    <p className="text-muted-foreground mb-4">{userShop.description || "No description"}</p>
                    <Button
                      onClick={() => setShowShopForm(true)}
                      variant="outline"
                    >
                      <Pencil size={16} className="mr-2" />
                      Edit Shop
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="followers">
          <FollowerManagement />
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Lock size={24} weight="fill" className="text-primary" />
              <div>
                <h2 className="text-xl font-semibold text-foreground">Profile Visibility</h2>
                <p className="text-sm text-muted-foreground">Control who can see your posts</p>
              </div>
            </div>

            <div className="space-y-4">
              <Card
                className={cn(
                  "p-4 cursor-pointer transition-all border-2",
                  profileVisibility === "public"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => handleVisibilityChange("public")}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    profileVisibility === "public" ? "bg-primary" : "bg-muted"
                  )}>
                    <Globe 
                      size={20} 
                      weight="fill" 
                      className={profileVisibility === "public" ? "text-primary-foreground" : "text-muted-foreground"}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground">Public</h3>
                      {profileVisibility === "public" && (
                        <Badge className="bg-mint text-foreground">Active</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Anyone on or off Viz. can see your posts, Viz.Edits, and profile
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Eye size={14} />
                      <span>Maximum visibility</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card
                className={cn(
                  "p-4 cursor-pointer transition-all border-2",
                  profileVisibility === "followers"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => handleVisibilityChange("followers")}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    profileVisibility === "followers" ? "bg-primary" : "bg-muted"
                  )}>
                    <Users 
                      size={20} 
                      weight="fill" 
                      className={profileVisibility === "followers" ? "text-primary-foreground" : "text-muted-foreground"}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground">Followers Only</h3>
                      {profileVisibility === "followers" && (
                        <Badge className="bg-mint text-foreground">Active</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Only your approved followers can see your posts and Viz.Edits
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Eye size={14} />
                      <span>Followers: {currentUser?.followers || 247}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card
                className={cn(
                  "p-4 cursor-pointer transition-all border-2",
                  profileVisibility === "private"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => handleVisibilityChange("private")}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    profileVisibility === "private" ? "bg-primary" : "bg-muted"
                  )}>
                    <Lock 
                      size={20} 
                      weight="fill" 
                      className={profileVisibility === "private" ? "text-primary-foreground" : "text-muted-foreground"}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground">Private</h3>
                      {profileVisibility === "private" && (
                        <Badge className="bg-mint text-foreground">Active</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Only you can see your posts and Viz.Edits. Your profile is hidden from others
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Eye size={14} />
                      <span>Hidden from everyone</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lock size={16} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground font-medium mb-1">About Privacy Settings</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Your Viz.Let shop remains public regardless of this setting</li>
                    <li>• Profile visibility only affects your feed content and profile page</li>
                    <li>• Followers can be managed from your profile page</li>
                    <li>• Changes take effect immediately</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <AddressFormDialog
        isOpen={showAddressForm}
        onClose={() => {
          setShowAddressForm(false)
          setEditingAddress(null)
        }}
        editingAddress={editingAddress}
        onSave={(address) => {
          if (editingAddress) {
            setShippingAddresses((prev) =>
              (prev || []).map(a => a.id === address.id ? address : a)
            )
            toast.success("Shipping address updated")
          } else {
            setShippingAddresses((prev) => [...(prev || []), address])
            toast.success("Shipping address added")
          }
          setShowAddressForm(false)
          setEditingAddress(null)
        }}
      />

      <PaymentFormDialog
        isOpen={showPaymentForm}
        onClose={() => setShowPaymentForm(false)}
        onSave={(payment) => {
          setPaymentMethods((prev) => [...(prev || []), payment])
          toast.success("Payment method added")
          setShowPaymentForm(false)
        }}
      />

      <ShopFormDialog
        isOpen={showShopForm}
        onClose={() => setShowShopForm(false)}
        existingShop={userShop}
        currentUser={currentUser}
        onSave={(shop) => {
          if (userShop) {
            setShops((prev) =>
              (prev || []).map(s => s.id === shop.id ? shop : s)
            )
            toast.success("Shop updated")
          } else {
            setShops((prev) => [...(prev || []), shop])
            toast.success("Shop created")
          }
          setShowShopForm(false)
        }}
      />
    </div>
  )
}

function AddressFormDialog({ isOpen, onClose, editingAddress, onSave }: {
  isOpen: boolean
  onClose: () => void
  editingAddress: ShippingAddress | null
  onSave: (address: ShippingAddress) => void
}) {
  const [name, setName] = useState(editingAddress?.name || "")
  const [addressLine1, setAddressLine1] = useState(editingAddress?.addressLine1 || "")
  const [addressLine2, setAddressLine2] = useState(editingAddress?.addressLine2 || "")
  const [city, setCity] = useState(editingAddress?.city || "")
  const [state, setState] = useState(editingAddress?.state || "")
  const [zipCode, setZipCode] = useState(editingAddress?.zipCode || "")
  const [country, setCountry] = useState(editingAddress?.country || "")
  const [phone, setPhone] = useState(editingAddress?.phone || "")

  const handleSave = () => {
    if (!name || !addressLine1 || !city || !state || !zipCode || !country || !phone) {
      toast.error("Please fill in all required fields")
      return
    }

    const address: ShippingAddress = {
      id: editingAddress?.id || `addr-${Date.now()}`,
      name,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country,
      phone,
      isDefault: editingAddress?.isDefault || false
    }

    onSave(address)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingAddress ? "Edit" : "Add"} Shipping Address</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="address1">Address Line 1 *</Label>
            <Input id="address1" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="address2">Address Line 2</Label>
            <Input id="address2" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input id="state" value={state} onChange={(e) => setState(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="zip">Zip Code *</Label>
              <Input id="zip" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="country">Country *</Label>
              <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-accent text-primary-foreground">
            Save Address
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function PaymentFormDialog({ isOpen, onClose, onSave }: {
  isOpen: boolean
  onClose: () => void
  onSave: (payment: PaymentMethod) => void
}) {
  const [cardNumber, setCardNumber] = useState("")
  const [cardBrand, setCardBrand] = useState("Visa")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")

  const handleSave = () => {
    if (!cardNumber || !expiryDate || !cvv) {
      toast.error("Please fill in all required fields")
      return
    }

    const payment: PaymentMethod = {
      id: `payment-${Date.now()}`,
      type: "credit-card",
      cardLast4: cardNumber.slice(-4),
      cardBrand,
      expiryDate,
      isDefault: false
    }

    onSave(payment)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="card-number">Card Number *</Label>
            <Input 
              id="card-number" 
              value={cardNumber} 
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="1234 5678 9012 3456"
              maxLength={16}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="expiry">Expiry Date *</Label>
              <Input 
                id="expiry" 
                value={expiryDate} 
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
              />
            </div>
            <div>
              <Label htmlFor="cvv">CVV *</Label>
              <Input 
                id="cvv" 
                value={cvv} 
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                placeholder="123"
                maxLength={4}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-accent text-primary-foreground">
            Add Payment Method
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ShopFormDialog({ isOpen, onClose, existingShop, currentUser, onSave }: {
  isOpen: boolean
  onClose: () => void
  existingShop?: Shop
  currentUser: any
  onSave: (shop: Shop) => void
}) {
  const [shopName, setShopName] = useState(existingShop?.name || currentUser?.username || "")
  const [shopDescription, setShopDescription] = useState(existingShop?.description || "")
  const [shopAvatar, setShopAvatar] = useState(existingShop?.avatar || currentUser?.avatar || "")

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setShopAvatar(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (!shopName.trim()) {
      toast.error("Shop name is required")
      return
    }

    const shop: Shop = {
      id: existingShop?.id || `shop-${Date.now()}`,
      name: shopName,
      avatar: shopAvatar,
      description: shopDescription,
      isActive: true,
      ownerId: currentUser?.vizBizId
    }

    onSave(shop)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{existingShop ? "Edit" : "Create"} Shop</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Shop Avatar</Label>
            <div className="flex items-center gap-4 mt-2">
              <div className="shield-avatar w-[80px] h-[93px] overflow-hidden border-2 border-primary flex-shrink-0">
                {shopAvatar ? (
                  <img src={shopAvatar} alt="Shop avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Storefront size={32} className="text-muted-foreground" weight="thin" />
                  </div>
                )}
              </div>
              <label className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span>Upload Avatar</span>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <div>
            <Label htmlFor="shop-name">Shop Name *</Label>
            <Input
              id="shop-name"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Enter shop name"
            />
          </div>
          <div>
            <Label htmlFor="shop-description">Shop Description</Label>
            <Textarea
              id="shop-description"
              value={shopDescription}
              onChange={(e) => setShopDescription(e.target.value)}
              placeholder="Describe your shop..."
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-accent text-primary-foreground">
            {existingShop ? "Update" : "Create"} Shop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
