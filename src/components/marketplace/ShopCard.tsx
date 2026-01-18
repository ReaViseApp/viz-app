import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldAvatar } from "@/components/ShieldAvatar"
import type { Shop } from "@/components/VizLetPage"

interface ShopCardProps {
  shop: Shop
}

export function ShopCard({ shop }: ShopCardProps) {
  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <Card className="inline-block min-w-[240px] p-4 border border-border hover:border-primary transition-all cursor-pointer hover:shadow-lg">
      <div className="flex flex-col items-center text-center gap-3">
        <ShieldAvatar src={shop.avatar || ""} alt={shop.name} size="medium" />

        <div>
          <h3 className="font-bold text-foreground mb-1">{shop.name}</h3>
          <p className="text-xs text-muted-foreground">
            {shop.productCount} product{shop.productCount !== 1 ? "s" : ""}
          </p>
          <p className="text-xs text-muted-foreground">{formatCount(shop.followerCount)} followers</p>
        </div>

        <Button variant="outline" size="sm" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          Visit Shop
        </Button>
      </div>
    </Card>
  )
}
