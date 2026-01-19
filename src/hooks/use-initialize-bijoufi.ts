import { useEffect, useState } from "react"
import { useKV } from "@github/spark/hooks"
import bijoufiLogo from "@/assets/images/bijoufi-logo.svg"
import editorLogo from "@/assets/images/editorlogo-badge.svg"
import { MediaItem } from "@/components/MediaCarousel"

interface User {
  username: string
  email?: string
  phone?: string
  password: string
  vizBizId: string
  avatar: string
  createdAt: string
  bio?: string
}

interface Post {
  id: string
  authorId?: string
  author: {
    username: string
    avatar: string
    id?: string
  }
  timestamp: string
  mediaUrl?: string
  media?: MediaItem[]
  caption: string
  likes: number
  comments: Array<{
    id: string
    username: string
    text: string
    avatar: string
  }>
  selections: Array<{
    id: string
    left: number
    top: number
    width: number
    height: number
    type: "open" | "approval"
  }>
  views?: number
}

interface Product {
  id: string
  title: string
  price: number
  images: string[]
  description: string
  shopId: string
  shopName: string
  shopAvatar: string
  createdAt: number
  views: number
  likes: number
  tags: string[]
  sourcePostId?: string
  sourceSelectionId?: string
}

interface Shop {
  id: string
  name: string
  avatar: string
  productCount: number
  followerCount: number
  ownerId: string
  description?: string
}

export function useInitializeBijoufi() {
  const [users, setUsers] = useKV<User[]>("viz-users", [])
  const [posts, setPosts] = useKV<Post[]>("feed-posts", [])
  const [products, setProducts] = useKV<Product[]>("viz-let-products", [])
  const [shops, setShops] = useKV<Shop[]>("viz-let-shops", [])
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (initialized) return

    const init = async () => {
      const currentUsers = await window.spark.kv.get<User[]>("viz-users") || []
      
      const bijoufiExists = currentUsers.some(u => u.username === "bijoufi")
      const bijoufanjournalExists = currentUsers.some(u => u.username === "bijoufanjournal")
      
      if (!bijoufiExists) {
        const bijoufiUser: User = {
          username: "bijoufi",
          email: "bijoufi@viz.app",
          password: "bijoufi123",
          vizBizId: "1234567890123456",
          avatar: bijoufiLogo,
          bio: "Out-of-the-Box Design at bijoufi.com",
          createdAt: new Date().toISOString(),
        }

        await window.spark.kv.set("viz-users", [...currentUsers, bijoufiUser])
      }

      if (!bijoufanjournalExists) {
        const updatedUsers = await window.spark.kv.get<User[]>("viz-users") || []
        const bijoufanjournalUser: User = {
          username: "bijoufanjournal",
          email: "bijoufanjournal@viz.app",
          password: "journal123",
          vizBizId: "1234567890123457",
          avatar: editorLogo,
          bio: "Bijoux Du Jour",
          createdAt: new Date().toISOString(),
        }

        await window.spark.kv.set("viz-users", [...updatedUsers, bijoufanjournalUser])
      }

      const finalUsers = await window.spark.kv.get<User[]>("viz-users") || []
      const bijoufiUser = finalUsers.find(u => u.username === "bijoufi")
      const bijoufanjournalUser = finalUsers.find(u => u.username === "bijoufanjournal")

      if (bijoufiUser && bijoufanjournalUser) {
        const currentPosts = await window.spark.kv.get<Post[]>("feed-posts") || []
        const postsToAdd: Post[] = []

        if (!currentPosts.some(p => p.id === "bijoufi-maplestack-post")) {
          postsToAdd.push({
            id: "bijoufi-maplestack-post",
            authorId: bijoufiUser.vizBizId,
            author: {
              username: "bijoufi",
              avatar: bijoufiLogo,
              id: bijoufiUser.vizBizId,
            },
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            mediaUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=800&fit=crop",
            caption: "The Stacking Pendant - A golden symphony of form and nature 🍁✨ #jewelry #design #autumn #bijoufi",
            likes: 42,
            comments: [{
              id: "c-bijoufi-1",
              username: "bijoufanjournal",
              text: "Absolutely stunning! The maple leaf detail is perfect 🍁",
              avatar: editorLogo,
            }],
            selections: [{
              id: "selection-pendant",
              left: 35,
              top: 45,
              width: 30,
              height: 25,
              type: "approval"
            }],
            views: 127,
          })
        }

        if (!currentPosts.some(p => p.id === "bijoufanjournal-dujour-spring26")) {
          postsToAdd.push({
            id: "bijoufanjournal-dujour-spring26",
            authorId: bijoufanjournalUser.vizBizId,
            author: {
              username: "bijoufanjournal",
              avatar: editorLogo,
              id: bijoufanjournalUser.vizBizId,
            },
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            mediaUrl: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&h=800&fit=crop",
            caption: "Bijoux du jour Spring 26 Collection ✨ Discover our latest pieces that blend elegance with seasonal beauty 🌸💎 #BijouxDuJour #Spring26 #JewelryCollection",
            likes: 89,
            comments: [{
              id: "c-bjj-1",
              username: "bijoufi",
              text: "Love the composition! Beautiful work 💕",
              avatar: bijoufiLogo,
            }],
            selections: [
              { id: "selection-ring", left: 10, top: 45, width: 25, height: 30, type: "approval" },
              { id: "selection-earrings", left: 42, top: 38, width: 28, height: 30, type: "approval" },
              { id: "selection-detail", left: 75, top: 42, width: 20, height: 35, type: "open" }
            ],
            views: 234,
          })
        }

        if (postsToAdd.length > 0) {
          await window.spark.kv.set("feed-posts", [...currentPosts, ...postsToAdd])
        }

        const currentShops = await window.spark.kv.get<Shop[]>("viz-let-shops") || []
        if (!currentShops.some(s => s.id === "shop-bijoufi")) {
          await window.spark.kv.set("viz-let-shops", [...currentShops, {
            id: "shop-bijoufi",
            name: "bijoufi",
            avatar: bijoufiLogo,
            productCount: 1,
            followerCount: 0,
            ownerId: bijoufiUser.vizBizId,
            description: "Out-of-the-Box Design",
          }])
        }

        const currentProducts = await window.spark.kv.get<Product[]>("viz-let-products") || []
        if (!currentProducts.some(p => p.id === "bijoufi-stacking-pendant")) {
          await window.spark.kv.set("viz-let-products", [...currentProducts, {
            id: "bijoufi-stacking-pendant",
            title: "The Stacking Pendant",
            price: 160,
            images: [
              "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=800&fit=crop",
              "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
              "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop",
              "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop",
              "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop",
            ],
            description: "A stunning pendant featuring a golden sphere arrangement nestled with autumn maple leaves. This unique piece combines natural beauty with contemporary metallic design, perfect for those who appreciate artistic jewelry.",
            shopId: "shop-bijoufi",
            shopName: "bijoufi",
            shopAvatar: bijoufiLogo,
            createdAt: Date.now(),
            views: 0,
            likes: 0,
            tags: ["jewelry", "pendant", "gold", "autumn", "design"],
            sourcePostId: "bijoufi-maplestack-post",
            sourceSelectionId: "selection-pendant",
          }])
        }
      }

      setInitialized(true)
    }

    init()
  }, [initialized])
}
