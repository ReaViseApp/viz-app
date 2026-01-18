import { useState } from "react"
import { X, CaretLeft, CaretRight, MagnifyingGlassPlus, ArrowRight } from "@phosphor-icons/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShieldAvatar } from "@/components/ShieldAvatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Product } from "@/components/VizLetPage"
import { cn } from "@/lib/utils"

interface ProductDetailModalProps {
  product: Product
  onClose: () => void
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
        >
          <X size={20} />
        </button>

        <ScrollArea className="h-[90vh]">
          <div className="p-6">
            <div className="relative mb-6">
              <div
                className={cn(
                  "relative aspect-square rounded-lg overflow-hidden bg-muted cursor-zoom-in",
                  isZoomed && "cursor-zoom-out"
                )}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                {product.images.length > 0 ? (
                  <img
                    src={product.images[currentImageIndex]}
                    alt={product.title}
                    className={cn(
                      "w-full h-full object-cover transition-transform duration-300",
                      isZoomed && "scale-150"
                    )}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}

                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        prevImage()
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <CaretLeft size={24} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        nextImage()
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <CaretRight size={24} />
                    </button>
                  </>
                )}

                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center">
                  <MagnifyingGlassPlus size={18} />
                </div>
              </div>

              {product.images.length > 1 && (
                <div className="flex justify-center gap-2 mt-3">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        index === currentImageIndex ? "bg-primary w-6" : "bg-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">{product.title}</h2>
                <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
              </div>

              <div className="prose prose-sm max-w-none">
                <p className="text-foreground">{product.description}</p>
              </div>

              <Card className="p-4 bg-muted/50">
                <div className="flex items-center gap-3">
                  <ShieldAvatar src={product.shopAvatar || ""} alt={product.shopName} size="small" />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{product.shopName}</p>
                    <button className="text-sm text-primary hover:underline">Visit Shop</button>
                  </div>
                </div>
              </Card>

              <div className="border-t border-border pt-4">
                <h3 className="font-semibold text-foreground mb-2">Delivery Information</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Standard shipping: 5-7 business days</li>
                  <li>• Express shipping available</li>
                  <li>• Free shipping on orders over $50</li>
                </ul>
              </div>

              {product.sourcePostId && (
                <div className="border-t border-border pt-4">
                  <button className="flex items-center gap-2 text-primary hover:underline">
                    <span>See the inspiration</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              <div className="flex gap-3 pt-4 sticky bottom-0 bg-background">
                <Button variant="outline" size="lg" className="flex-1 border-primary text-primary hover:bg-primary/10">
                  Add to Cart
                </Button>
                <Button size="lg" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
