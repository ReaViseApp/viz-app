import { useEffect } from "react"
import { useKV } from "@github/spark/hooks"
import type { Product, Shop } from "@/components/VizLetPage"

export function useInitializeMarketplaceData() {
  const [products, setProducts] = useKV<Product[]>("viz-let-products", [])
  const [shops, setShops] = useKV<Shop[]>("viz-let-shops", [])

  useEffect(() => {
    if (products && products.length === 0) {
      const sampleShops: Shop[] = [
        {
          id: "shop-1",
          name: "Aesthetic Studio",
          avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=aesthetic",
          productCount: 12,
          followerCount: 2400,
          ownerId: "user-1",
        },
        {
          id: "shop-2",
          name: "Vintage Vibes",
          avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=vintage",
          productCount: 18,
          followerCount: 3200,
          ownerId: "user-2",
        },
        {
          id: "shop-3",
          name: "Modern Minimalist",
          avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=modern",
          productCount: 24,
          followerCount: 5100,
          ownerId: "user-3",
        },
        {
          id: "shop-4",
          name: "Pastel Dreams",
          avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=pastel",
          productCount: 15,
          followerCount: 1800,
          ownerId: "user-4",
        },
        {
          id: "shop-5",
          name: "Bold & Bright",
          avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=bold",
          productCount: 20,
          followerCount: 4500,
          ownerId: "user-5",
        },
      ]

      const sampleProducts: Product[] = [
        {
          id: "prod-1",
          title: "Minimalist Typography Poster Set",
          price: 24.99,
          images: [
            "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=600&h=600&fit=crop",
          ],
          description:
            "A beautiful set of 3 minimalist typography posters perfect for modern interiors. High-quality prints on premium matte paper.",
          shopId: "shop-3",
          shopName: "Modern Minimalist",
          shopAvatar: "https://api.dicebear.com/7.x/shapes/svg?seed=modern",
          createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
          views: 342,
          likes: 89,
          tags: ["poster", "typography", "minimalist"],
          sourcePostId: "post-1",
        },
        {
          id: "prod-2",
          title: "Vintage Film Camera Print",
          price: 18.5,
          images: ["https://images.unsplash.com/photo-1495121553079-4c61bcce1894?w=600&h=600&fit=crop"],
          description: "Nostalgic vintage camera photography print. Perfect for photography enthusiasts.",
          shopId: "shop-2",
          shopName: "Vintage Vibes",
          shopAvatar: "https://api.dicebear.com/7.x/shapes/svg?seed=vintage",
          createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
          views: 156,
          likes: 42,
          tags: ["vintage", "camera", "photography"],
        },
        {
          id: "prod-3",
          title: "Pastel Gradient Wall Art",
          price: 32.0,
          images: [
            "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=600&h=600&fit=crop",
          ],
          description: "Soft pastel gradient abstract art. Brings calm and elegance to any space.",
          shopId: "shop-4",
          shopName: "Pastel Dreams",
          shopAvatar: "https://api.dicebear.com/7.x/shapes/svg?seed=pastel",
          createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
          views: 512,
          likes: 134,
          tags: ["pastel", "gradient", "abstract"],
          sourcePostId: "post-3",
        },
        {
          id: "prod-4",
          title: "Geometric Pattern Cushion Cover",
          price: 15.99,
          images: ["https://images.unsplash.com/photo-1598300188050-fb26d014ddd8?w=600&h=600&fit=crop"],
          description: "Bold geometric patterns on soft cotton cushion covers. Available in multiple colors.",
          shopId: "shop-5",
          shopName: "Bold & Bright",
          shopAvatar: "https://api.dicebear.com/7.x/shapes/svg?seed=bold",
          createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
          views: 89,
          likes: 23,
          tags: ["cushion", "geometric", "home-decor"],
        },
        {
          id: "prod-5",
          title: "Abstract Line Art Drawing",
          price: 28.0,
          images: ["https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600&h=600&fit=crop"],
          description: "Elegant continuous line art. Minimalist design for sophisticated spaces.",
          shopId: "shop-1",
          shopName: "Aesthetic Studio",
          shopAvatar: "https://api.dicebear.com/7.x/shapes/svg?seed=aesthetic",
          createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
          views: 423,
          likes: 98,
          tags: ["line-art", "abstract", "drawing"],
          sourcePostId: "post-5",
        },
        {
          id: "prod-6",
          title: "Botanical Print Collection",
          price: 35.5,
          images: [
            "https://images.unsplash.com/photo-1530447920184-b88c8872?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1517191434949-5e90cd67d2b6?w=600&h=600&fit=crop",
          ],
          description: "Set of 4 beautiful botanical prints featuring various plants and leaves.",
          shopId: "shop-1",
          shopName: "Aesthetic Studio",
          shopAvatar: "https://api.dicebear.com/7.x/shapes/svg?seed=aesthetic",
          createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
          views: 267,
          likes: 71,
          tags: ["botanical", "plants", "nature"],
        },
        {
          id: "prod-7",
          title: "Retro Sunset Landscape",
          price: 22.0,
          images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop"],
          description: "Stunning retro-style sunset landscape. Perfect nostalgic wall decor.",
          shopId: "shop-2",
          shopName: "Vintage Vibes",
          shopAvatar: "https://api.dicebear.com/7.x/shapes/svg?seed=vintage",
          createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
          views: 189,
          likes: 54,
          tags: ["sunset", "landscape", "retro"],
          sourcePostId: "post-7",
        },
        {
          id: "prod-8",
          title: "Modern Architecture Print",
          price: 29.99,
          images: ["https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=600&h=600&fit=crop"],
          description: "Clean lines and modern architectural photography. Great for contemporary spaces.",
          shopId: "shop-3",
          shopName: "Modern Minimalist",
          shopAvatar: "https://api.dicebear.com/7.x/shapes/svg?seed=modern",
          createdAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
          views: 298,
          likes: 67,
          tags: ["architecture", "modern", "photography"],
        },
      ]

      setShops(sampleShops)
      setProducts(sampleProducts)
    }
  }, [products, setProducts, shops, setShops])
}
