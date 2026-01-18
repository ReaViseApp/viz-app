import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShieldAvatar } from "@/components/ShieldAvatar"
import { X, Storefront, Users, ShoppingBag, Heart, ChatCircle } from "@phosphor-icons/react"
import { ProductCard } from "@/components/marketplace/ProductCard"
import { ProductDetailModal } from "@/components/marketplace/ProductDetailModal"
import type { Shop, Product } from "@/components/VizLetPage"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface ShopPageModalProps {
  shop: Shop
  onClose: () => void
  onNavigateToSettings?: () => void
}

type SortType = "newest" | "price-low" | "price-high" | "popular"

export function ShopPageModal({ shop, onClose, onNavigateToSettings }: ShopPageModalProps) {
  const [products] = useKV<Product[]>("viz-let-products", [])
  const [isFollowing, setIsFollowing] = useState(false)
  const [sortBy, setSortBy] = useState<SortType>("newest")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const shopProducts = (products || []).filter(p => p.shopId === shop.id)

  const sortedProducts = [...shopProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.createdAt - a.createdAt
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "popular":
        return (b.views + b.likes) - (a.views + a.likes)
      default:
        return 0
    }
  })

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    toast.success(isFollowing ? "Unfollowed shop" : "Following shop")
  }

  const handleContact = () => {
    toast.info("Contact seller feature coming soon")
  }

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
          >
            <X size={20} />
          </button>

          <div className="overflow-y-auto max-h-[90vh]">
            <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 p-8 border-b border-border">
              <div className="flex items-start gap-6">
                <div className="shield-avatar w-[120px] h-[140px] flex-shrink-0 overflow-hidden border-2 border-primary">
                  {shop.avatar ? (
                    <img
                      src={shop.avatar}
                      alt={shop.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-background flex items-center justify-center">
                      <Storefront size={48} className="text-muted-foreground" weight="thin" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">{shop.name}</h1>
                  <p className="text-muted-foreground mb-4">
                    Welcome to our shop! Discover unique items curated just for you.
                  </p>

                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <ShoppingBag size={20} weight="fill" className="text-primary" />
                      <span className="font-semibold text-foreground">{shop.productCount}</span>
                      <span className="text-sm text-muted-foreground">Products</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={20} weight="fill" className="text-primary" />
                      <span className="font-semibold text-foreground">
                        {shop.followerCount >= 1000 
                          ? `${(shop.followerCount / 1000).toFixed(1)}K` 
                          : shop.followerCount}
                      </span>
                      <span className="text-sm text-muted-foreground">Followers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart size={20} weight="fill" className="text-primary" />
                      <span className="font-semibold text-foreground">
                        {shopProducts.reduce((sum, p) => sum + p.likes, 0)}
                      </span>
                      <span className="text-sm text-muted-foreground">Total Likes</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleFollow}
                      className={cn(
                        isFollowing 
                          ? "border-primary text-primary hover:bg-primary/10" 
                          : "bg-primary text-primary-foreground hover:bg-accent"
                      )}
                      variant={isFollowing ? "outline" : "default"}
                    >
                      <Heart size={16} className="mr-2" weight={isFollowing ? "fill" : "regular"} />
                      {isFollowing ? "Following" : "Follow Shop"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleContact}
                    >
                      <ChatCircle size={16} className="mr-2" />
                      Contact Seller
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">All Products</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortType)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {sortedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag size={64} className="mx-auto mb-4 text-muted-foreground" weight="thin" />
                  <p className="text-lg font-semibold text-foreground mb-2">No products yet</p>
                  <p className="text-sm text-muted-foreground">This shop hasn't listed any products</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={() => setSelectedProduct(product)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onNavigateToSettings={onNavigateToSettings}
        />
      )}
    </>
  )
}
