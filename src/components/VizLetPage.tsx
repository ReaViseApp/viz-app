import { useState, useEffect, useMemo } from "react"
import { useKV } from "@github/spark/hooks"
import { MagnifyingGlass, Storefront, Heart, TrendUp, Sparkle, Star, SortAscending } from "@phosphor-icons/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/components/marketplace/ProductCard"
import { ShopCard } from "@/components/marketplace/ShopCard"
import { ProductDetailModal } from "@/components/marketplace/ProductDetailModal"
import { ShopPageModal } from "@/components/marketplace/ShopPageModal"
import { useInitializeMarketplaceData } from "@/hooks/use-initialize-marketplace-data"
import { cn } from "@/lib/utils"

export interface Product {
  id: string
  title: string
  price: number
  images: string[]
  description: string
  shopId: string
  shopName: string
  shopAvatar?: string
  createdAt: number
  views: number
  likes: number
  tags: string[]
  sourcePostId?: string
}

export interface Shop {
  id: string
  name: string
  avatar?: string
  productCount: number
  followerCount: number
  ownerId: string
}

type FilterType = "all" | "trending" | "new" | "top-rated"
type SortType = "newest" | "price-low" | "price-high" | "popular"

interface VizLetPageProps {
  onNavigateToSettings?: () => void
}

export function VizLetPage({ onNavigateToSettings }: VizLetPageProps = {}) {
  useInitializeMarketplaceData()
  
  const [products] = useKV<Product[]>("viz-let-products", [])
  const [shops] = useKV<Shop[]>("viz-let-shops", [])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [sortBy, setSortBy] = useState<SortType>("newest")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [displayedProducts, setDisplayedProducts] = useState(20)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true)
      setTimeout(() => setIsRefreshing(false), 800)
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const filteredProducts = useMemo(() => {
    let filtered = [...(products || [])]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.shopName.toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    switch (activeFilter) {
      case "trending":
        filtered = filtered.filter((p) => p.views > 100)
        break
      case "new":
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
        filtered = filtered.filter((p) => p.createdAt > weekAgo)
        break
      case "top-rated":
        filtered = filtered.filter((p) => p.likes > 50)
        break
    }

    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => b.createdAt - a.createdAt)
        break
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "popular":
        filtered.sort((a, b) => b.views + b.likes - (a.views + a.likes))
        break
    }

    return filtered
  }, [products, searchQuery, activeFilter, sortBy])

  const trendingProducts = useMemo(() => {
    return [...(products || [])].sort((a, b) => b.views + b.likes - (a.views + a.likes)).slice(0, 10)
  }, [products])

  const popularShops = useMemo(() => {
    return [...(shops || [])].sort((a, b) => b.followerCount - a.followerCount).slice(0, 8)
  }, [shops])

  const handleLoadMore = () => {
    setDisplayedProducts((prev) => prev + 20)
  }

  return (
    <div className="w-full">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border pb-6 pt-0">
        <div className="flex items-center gap-3 mb-2">
          <Storefront size={32} weight="fill" className="text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Viz.Let</h1>
            <p className="text-sm text-muted-foreground">Shop Your Viz.Lists</p>
          </div>
        </div>

        <div className="relative mt-4">
          <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
          <Input
            type="text"
            placeholder="Search products or shops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>

        <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={activeFilter === "all" ? "default" : "outline"}
                onClick={() => setActiveFilter("all")}
                className={cn(activeFilter === "all" && "bg-primary text-primary-foreground")}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={activeFilter === "trending" ? "default" : "outline"}
                onClick={() => setActiveFilter("trending")}
                className={cn(activeFilter === "trending" && "bg-primary text-primary-foreground")}
              >
                <TrendUp size={16} className="mr-1" />
                Trending
              </Button>
              <Button
                size="sm"
                variant={activeFilter === "new" ? "default" : "outline"}
                onClick={() => setActiveFilter("new")}
                className={cn(activeFilter === "new" && "bg-primary text-primary-foreground")}
              >
                <Sparkle size={16} className="mr-1" />
                New Arrivals
              </Button>
              <Button
                size="sm"
                variant={activeFilter === "top-rated" ? "default" : "outline"}
                onClick={() => setActiveFilter("top-rated")}
                className={cn(activeFilter === "top-rated" && "bg-primary text-primary-foreground")}
              >
                <Star size={16} className="mr-1" />
                Top Rated
              </Button>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortType)}>
            <SelectTrigger className="w-[180px] shrink-0">
              <SortAscending size={16} className="mr-2" />
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

      <div className="space-y-8 mt-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              🔥 Trending Now
            </h2>
            <Button variant="link" className="text-primary">
              See All
            </Button>
          </div>

          {isRefreshing ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="min-w-[200px]">
                  <Skeleton className="w-[200px] h-[200px] rounded-lg mb-2" />
                  <Skeleton className="w-full h-4 mb-1" />
                  <Skeleton className="w-2/3 h-4" />
                </div>
              ))}
            </div>
          ) : (
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-4 pb-4">
                {trendingProducts.length > 0 ? (
                  trendingProducts.map((product) => (
                    <div key={product.id} className="inline-block min-w-[200px]">
                      <ProductCard product={product} onSelect={() => setSelectedProduct(product)} />
                    </div>
                  ))
                ) : (
                  <div className="w-full py-12 text-center text-muted-foreground">
                    No trending products yet
                  </div>
                )}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              ⭐ Popular Shops
            </h2>
            <Button variant="link" className="text-primary">
              See All
            </Button>
          </div>

          {isRefreshing ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="min-w-[240px]">
                  <Skeleton className="w-[240px] h-[160px] rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-4 pb-4">
                {popularShops.length > 0 ? (
                  popularShops.map((shop) => (
                    <ShopCard 
                      key={shop.id} 
                      shop={shop} 
                      onVisit={() => setSelectedShop(shop)}
                    />
                  ))
                ) : (
                  <div className="w-full py-12 text-center text-muted-foreground">No shops yet</div>
                )}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">All Products</h2>
            <p className="text-sm text-muted-foreground">{filteredProducts.length} products</p>
          </div>

          {filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredProducts.slice(0, displayedProducts).map((product) => (
                  <ProductCard key={product.id} product={product} onSelect={() => setSelectedProduct(product)} />
                ))}
              </div>

              {displayedProducts < filteredProducts.length && (
                <div className="flex justify-center mt-8">
                  <Button onClick={handleLoadMore} variant="outline" size="lg">
                    Load More
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg text-muted-foreground mb-2">No products found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </section>
      </div>

      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onNavigateToSettings={onNavigateToSettings}
          onVisitShop={(shopId) => {
            const shop = shops?.find(s => s.id === shopId)
            if (shop) {
              setSelectedProduct(null)
              setSelectedShop(shop)
            }
          }}
        />
      )}

      {selectedShop && (
        <ShopPageModal
          shop={selectedShop}
          onClose={() => setSelectedShop(null)}
          onNavigateToSettings={onNavigateToSettings}
        />
      )}
    </div>
  )
}
