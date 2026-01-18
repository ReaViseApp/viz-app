import { Heart } from "@phosphor-icons/react"
import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Product } from "@/components/VizLetPage"

interface ProductCardProps {
  product: Product
  onSelect: () => void
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const [wishlist, setWishlist] = useKV<string[]>("viz-let-wishlist", [])
  const [isLiked, setIsLiked] = useState(wishlist?.includes(product.id) || false)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setWishlist((current) => {
      const updated = current || []
      if (updated.includes(product.id)) {
        setIsLiked(false)
        return updated.filter((id) => id !== product.id)
      } else {
        setIsLiked(true)
        return [...updated, product.id]
      }
    })
  }

  return (
    <Card
      className="group cursor-pointer overflow-hidden border border-border hover:border-primary transition-all hover:shadow-lg"
      onClick={onSelect}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
        )}
        <button
          onClick={handleLike}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all"
        >
          <Heart
            size={18}
            weight={isLiked ? "fill" : "regular"}
            className={cn(isLiked ? "text-[#FF6B6B]" : "text-foreground")}
          />
        </button>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-1">{product.title}</h3>
        <p className="text-lg font-bold text-primary mb-2">${product.price.toFixed(2)}</p>
        <button
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          {product.shopName}
        </button>
      </div>
    </Card>
  )
}
