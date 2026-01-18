import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { X, Upload, CaretLeft, CaretRight, Stamp } from "@phosphor-icons/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { Product, Shop } from "@/components/VizLetPage"

interface MyVizItem {
  id: string
  mediaUrl: string
  mediaType: "photo" | "video"
  title: string
  creatorId: string
}

interface ProductListingFlowProps {
  isOpen: boolean
  onClose: () => void
  vizItem: MyVizItem
}

const CURRENCY_OPTIONS = [
  { value: "USD", symbol: "$", label: "USD ($)" },
  { value: "EUR", symbol: "€", label: "EUR (€)" },
  { value: "GBP", symbol: "£", label: "GBP (£)" },
  { value: "JPY", symbol: "¥", label: "JPY (¥)" },
  { value: "AUD", symbol: "A$", label: "AUD (A$)" },
]

const CATEGORIES = [
  "Art & Collectibles",
  "Fashion & Accessories",
  "Home & Living",
  "Jewelry",
  "Craft Supplies",
  "Toys & Games",
  "Electronics",
  "Books & Media",
  "Other",
]

export function ProductListingFlow({ isOpen, onClose, vizItem }: ProductListingFlowProps) {
  const [currentUser] = useKV<any>("viz-current-user", null)
  const [products, setProducts] = useKV<Product[]>("viz-let-products", [])
  const [shops, setShops] = useKV<Shop[]>("viz-let-shops", [])
  
  const [step, setStep] = useState(1)
  
  const [productTitle, setProductTitle] = useState(vizItem.title)
  const [productDescription, setProductDescription] = useState("")
  const [price, setPrice] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [category, setCategory] = useState("")
  
  const [photos, setPhotos] = useState<string[]>([vizItem.mediaUrl])
  const [draggedPhotoIndex, setDraggedPhotoIndex] = useState<number | null>(null)
  
  const [deliveryTime, setDeliveryTime] = useState("")
  const [deliveryMethods, setDeliveryMethods] = useState<string[]>([])
  const [paymentMethods, setPaymentMethods] = useState<string[]>([])
  const [offerCustomization, setOfferCustomization] = useState(false)
  const [customizationDetails, setCustomizationDetails] = useState("")
  const [offerGiftWrap, setOfferGiftWrap] = useState(false)
  const [giftWrapPrice, setGiftWrapPrice] = useState("")
  const [stockQuantity, setStockQuantity] = useState("")

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            setPhotos((prev) => [...prev, event.target!.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDragStart = (index: number) => {
    setDraggedPhotoIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedPhotoIndex === null || draggedPhotoIndex === index) return
    
    const newPhotos = [...photos]
    const draggedPhoto = newPhotos[draggedPhotoIndex]
    newPhotos.splice(draggedPhotoIndex, 1)
    newPhotos.splice(index, 0, draggedPhoto)
    
    setPhotos(newPhotos)
    setDraggedPhotoIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedPhotoIndex(null)
  }

  const toggleDeliveryMethod = (method: string) => {
    setDeliveryMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    )
  }

  const togglePaymentMethod = (method: string) => {
    setPaymentMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    )
  }

  const validateStep1 = () => {
    if (!productTitle.trim()) {
      toast.error("Product title is required")
      return false
    }
    if (!productDescription.trim()) {
      toast.error("Product description is required")
      return false
    }
    if (!price || parseFloat(price) <= 0) {
      toast.error("Valid price is required")
      return false
    }
    if (!category) {
      toast.error("Please select a category")
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (photos.length < 5) {
      toast.error("Please upload at least 5 photos")
      return false
    }
    return true
  }

  const validateStep3 = () => {
    if (!deliveryTime) {
      toast.error("Please select delivery time")
      return false
    }
    if (deliveryMethods.length === 0) {
      toast.error("Please select at least one delivery method")
      return false
    }
    if (paymentMethods.length === 0) {
      toast.error("Please select at least one payment method")
      return false
    }
    if (offerGiftWrap && (!giftWrapPrice || parseFloat(giftWrapPrice) <= 0)) {
      toast.error("Please enter a valid gift wrapping price")
      return false
    }
    return true
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handlePublish = () => {
    if (!validateStep3()) return

    const userShop = shops?.find(s => s.ownerId === currentUser?.vizBizId)
    let shopId = userShop?.id

    if (!userShop) {
      const newShopId = `shop-${Date.now()}`
      const newShop: Shop = {
        id: newShopId,
        name: currentUser?.username || "My Shop",
        avatar: currentUser?.avatar,
        productCount: 1,
        followerCount: 0,
        ownerId: currentUser?.vizBizId,
      }
      setShops((prev) => [...(prev || []), newShop])
      shopId = newShopId
    } else {
      setShops((currentShops) =>
        (currentShops || []).map((s) =>
          s.id === shopId ? { ...s, productCount: s.productCount + 1 } : s
        )
      )
    }

    const newProduct: Product = {
      id: `product-${Date.now()}`,
      title: productTitle,
      price: parseFloat(price),
      images: photos,
      description: productDescription,
      shopId: shopId!,
      shopName: currentUser?.username || "My Shop",
      shopAvatar: currentUser?.avatar,
      createdAt: Date.now(),
      views: 0,
      likes: 0,
      tags: [category],
      sourcePostId: vizItem.id,
    }

    setProducts((prev) => [...(prev || []), newProduct])

    toast.success(
      <div className="flex items-center gap-2">
        <Stamp size={24} weight="fill" className="text-mint" />
        <span>Your product is now live on Viz.Let!</span>
      </div>
    )

    onClose()
    setStep(1)
  }

  const photoCounter = photos.length
  const isPhotoCountValid = photoCounter >= 5

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            List Your Product
          </DialogTitle>
          <div className="mt-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>
                Step {step} of 3: {step === 1 ? "Product Details" : step === 2 ? "Product Photos" : "Delivery & Options"}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="product-title">Product Title *</Label>
                <Input
                  id="product-title"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  placeholder="Enter product title"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="product-description">Product Description *</Label>
                <Textarea
                  id="product-description"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Describe your product..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency *</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className="mt-1">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  onClick={handleNext}
                  className="bg-primary hover:bg-accent text-primary-foreground"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Upload at least 5 photos of your physical product
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium">Photo Count:</span>
                  <span
                    className={cn(
                      "text-sm font-bold",
                      isPhotoCountValid ? "text-mint" : "text-coral"
                    )}
                  >
                    {photoCounter}/5 minimum photos
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className="relative aspect-square rounded-lg overflow-hidden bg-muted border-2 border-border hover:border-primary transition-colors cursor-move"
                  >
                    <img
                      src={photo}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-coral hover:bg-coral/80 flex items-center justify-center transition-colors"
                    >
                      <X size={14} className="text-white" />
                    </button>
                  </div>
                ))}

                <label className="relative aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer flex flex-col items-center justify-center bg-muted/50">
                  <Upload size={32} className="text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground">Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <p className="text-xs text-muted-foreground italic">
                Drag photos to reorder. The first photo will be your main product image.
              </p>

              <div className="flex justify-between gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                >
                  <CaretLeft size={16} className="mr-1" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!isPhotoCountValid}
                  className="bg-primary hover:bg-accent text-primary-foreground"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="delivery-time">Delivery Time *</Label>
                <Select value={deliveryTime} onValueChange={setDeliveryTime}>
                  <SelectTrigger id="delivery-time" className="mt-1">
                    <SelectValue placeholder="Select delivery time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3 days">1-3 days</SelectItem>
                    <SelectItem value="3-7 days">3-7 days</SelectItem>
                    <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                    <SelectItem value="2-4 weeks">2-4 weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Delivery Methods *</Label>
                <div className="space-y-2 mt-2">
                  {["Standard Shipping", "Express Shipping", "Local Pickup"].map((method) => (
                    <div key={method} className="flex items-center gap-2">
                      <Checkbox
                        id={method}
                        checked={deliveryMethods.includes(method)}
                        onCheckedChange={() => toggleDeliveryMethod(method)}
                      />
                      <Label htmlFor={method} className="font-normal cursor-pointer">
                        {method}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Accepted Payment Methods *</Label>
                <div className="space-y-2 mt-2">
                  {["Credit Card", "PayPal", "Apple Pay", "Google Pay"].map((method) => (
                    <div key={method} className="flex items-center gap-2">
                      <Checkbox
                        id={method}
                        checked={paymentMethods.includes(method)}
                        onCheckedChange={() => togglePaymentMethod(method)}
                      />
                      <Label htmlFor={method} className="font-normal cursor-pointer">
                        {method}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="customization" className="text-base">
                    Offer customization?
                  </Label>
                  <Checkbox
                    id="customization"
                    checked={offerCustomization}
                    onCheckedChange={(checked) => setOfferCustomization(checked as boolean)}
                  />
                </div>
                {offerCustomization && (
                  <Textarea
                    placeholder="Describe available customizations..."
                    value={customizationDetails}
                    onChange={(e) => setCustomizationDetails(e.target.value)}
                    rows={3}
                  />
                )}
              </Card>

              <Card className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="gift-wrap" className="text-base">
                    Offer gift wrapping?
                  </Label>
                  <Checkbox
                    id="gift-wrap"
                    checked={offerGiftWrap}
                    onCheckedChange={(checked) => setOfferGiftWrap(checked as boolean)}
                  />
                </div>
                {offerGiftWrap && (
                  <div>
                    <Label htmlFor="gift-wrap-price" className="text-sm">
                      Gift wrapping fee
                    </Label>
                    <Input
                      id="gift-wrap-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={giftWrapPrice}
                      onChange={(e) => setGiftWrapPrice(e.target.value)}
                      placeholder="0.00"
                      className="mt-1"
                    />
                  </div>
                )}
              </Card>

              <div>
                <Label htmlFor="stock">Stock Quantity (optional)</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  placeholder="Leave blank for unlimited"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave blank if you have unlimited stock
                </p>
              </div>

              <div className="flex justify-between gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                >
                  <CaretLeft size={16} className="mr-1" />
                  Back
                </Button>
                <Button
                  onClick={handlePublish}
                  className="bg-primary hover:bg-accent text-primary-foreground text-lg px-8"
                >
                  List Product
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
