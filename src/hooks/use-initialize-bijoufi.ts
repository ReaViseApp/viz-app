import { useEffect } from "react"
import { useKV } from "@github/spark/hooks"
import bijoufiLogo from "@/assets/images/bijoufi-logo.svg"
import editorLogo from "@/assets/images/editorlogo-badge.svg"

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
  mediaUrl: string
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

  useEffect(() => {
    if (!users) return

    const bijoufiExists = users.some(u => u.username === "bijoufi")
    
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

      setUsers((current) => [...(current || []), bijoufiUser])
    } else {
      setUsers((current) =>
        (current || []).map(user =>
          user.username === "bijoufi"
            ? { ...user, avatar: bijoufiLogo, bio: "Out-of-the-Box Design at bijoufi.com" }
            : user
        )
      )
    }

    const bijoufanjournalExists = users.some(u => u.username === "bijoufanjournal")
    
    if (!bijoufanjournalExists) {
      const bijoufanjournalUser: User = {
        username: "bijoufanjournal",
        email: "bijoufanjournal@viz.app",
        password: "journal123",
        vizBizId: "1234567890123457",
        avatar: editorLogo,
        bio: "Editorial musings and creative explorations",
        createdAt: new Date().toISOString(),
      }

      setUsers((current) => [...(current || []), bijoufanjournalUser])
    } else {
      setUsers((current) =>
        (current || []).map(user =>
          user.username === "bijoufanjournal"
            ? { ...user, avatar: editorLogo }
            : user
        )
      )
    }
  }, [users, setUsers])

  useEffect(() => {
    if (!users || !posts) return

    const bijoufiUser = users.find(u => u.username === "bijoufi")
    if (!bijoufiUser) return

    const bijoufiPostExists = posts.some(p => p.id === "bijoufi-maplestack-post")
    
    if (!bijoufiPostExists) {
      const mapleStackPost: Post = {
        id: "bijoufi-maplestack-post",
        authorId: bijoufiUser.vizBizId,
        author: {
          username: "bijoufi",
          avatar: bijoufiLogo,
          id: bijoufiUser.vizBizId,
        },
        timestamp: new Date().toISOString(),
        mediaUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=800&fit=crop",
        caption: "The Stacking Pendant - A golden symphony of form and nature 🍁✨ #jewelry #design #autumn #bijoufi",
        likes: 0,
        comments: [],
        selections: [
          {
            id: "selection-pendant",
            left: 35,
            top: 45,
            width: 30,
            height: 25,
            type: "approval"
          }
        ],
        views: 0,
      }

      setPosts((current) => [...(current || []), mapleStackPost])
    }
  }, [users, posts, setPosts])

  useEffect(() => {
    if (!users || !shops) return

    const bijoufiUser = users.find(u => u.username === "bijoufi")
    if (!bijoufiUser) return

    const bijoufiShopExists = shops.some(s => s.id === "shop-bijoufi")
    
    if (!bijoufiShopExists) {
      const bijoufiShop: Shop = {
        id: "shop-bijoufi",
        name: "bijoufi",
        avatar: bijoufiLogo,
        productCount: 1,
        followerCount: 0,
        ownerId: bijoufiUser.vizBizId,
        description: "Out-of-the-Box Design",
      }

      setShops((current) => [...(current || []), bijoufiShop])
    }
  }, [users, shops, setShops])

  useEffect(() => {
    if (!users || !products) return

    const bijoufiUser = users.find(u => u.username === "bijoufi")
    if (!bijoufiUser) return

    const productExists = products.some(p => p.id === "bijoufi-stacking-pendant")
    
    if (!productExists) {
      const stackingPendant: Product = {
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
      }

      setProducts((current) => [...(current || []), stackingPendant])
    }
  }, [users, products, setProducts])
}
