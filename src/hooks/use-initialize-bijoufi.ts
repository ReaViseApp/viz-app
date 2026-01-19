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
        bio: "Bijoux Du Jour",
        createdAt: new Date().toISOString(),
      }

      setUsers((current) => [...(current || []), bijoufanjournalUser])
    } else {
      setUsers((current) =>
        (current || []).map(user =>
          user.username === "bijoufanjournal"
            ? { ...user, avatar: editorLogo, bio: "Bijoux Du Jour" }
            : user
        )
      )
    }
  }, [users, setUsers])

  useEffect(() => {
    if (!users || !posts) return

    const bijoufiUser = users.find(u => u.username === "bijoufi")
    const bijoufanjournalUser = users.find(u => u.username === "bijoufanjournal")
    if (!bijoufiUser || !bijoufanjournalUser) return

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
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        mediaUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=800&fit=crop",
        caption: "The Stacking Pendant - A golden symphony of form and nature 🍁✨ #jewelry #design #autumn #bijoufi",
        likes: 42,
        comments: [
          {
            id: "c-bijoufi-1",
            username: "bijoufanjournal",
            text: "Absolutely stunning! The maple leaf detail is perfect 🍁",
            avatar: editorLogo,
          }
        ],
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
        views: 127,
      }

      setPosts((current) => [...(current || []), mapleStackPost])
    }

    const dujourEditPostExists = posts.some(p => p.id === "bijoufanjournal-dujour-spring26")
    
    if (!dujourEditPostExists) {
      const dujourEditPost: Post = {
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
        comments: [
          {
            id: "c-bjj-1",
            username: "bijoufi",
            text: "Love the composition! Beautiful work 💕",
            avatar: bijoufiLogo,
          }
        ],
        selections: [
          {
            id: "selection-ring",
            left: 10,
            top: 45,
            width: 25,
            height: 30,
            type: "approval"
          },
          {
            id: "selection-earrings",
            left: 42,
            top: 38,
            width: 28,
            height: 30,
            type: "approval"
          },
          {
            id: "selection-detail",
            left: 75,
            top: 42,
            width: 20,
            height: 35,
            type: "open"
          }
        ],
        views: 234,
      }

      setPosts((current) => [...(current || []), dujourEditPost])
    }

    const bijoufanjournalPost1Exists = posts.some(p => p.id === "bijoufanjournal-post-1")
    
    if (!bijoufanjournalPost1Exists) {
      const bijoufanjournalPost1: Post = {
        id: "bijoufanjournal-post-1",
        authorId: bijoufanjournalUser.vizBizId,
        author: {
          username: "bijoufanjournal",
          avatar: editorLogo,
          id: bijoufanjournalUser.vizBizId,
        },
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        mediaUrl: "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&h=800&fit=crop",
        caption: "Exploring minimalist aesthetics in modern design 📐✨ #minimalism #editorial #design",
        likes: 156,
        comments: [],
        selections: [],
        views: 312,
      }

      setPosts((current) => [...(current || []), bijoufanjournalPost1])
    }

    const bijoufanjournalPost2Exists = posts.some(p => p.id === "bijoufanjournal-post-2")
    
    if (!bijoufanjournalPost2Exists) {
      const bijoufanjournalPost2: Post = {
        id: "bijoufanjournal-post-2",
        authorId: bijoufanjournalUser.vizBizId,
        author: {
          username: "bijoufanjournal",
          avatar: editorLogo,
          id: bijoufanjournalUser.vizBizId,
        },
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        mediaUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=800&fit=crop",
        caption: "Fashion meets function in the everyday 👗💫 #fashion #style #curation",
        likes: 203,
        comments: [],
        selections: [
          {
            id: "selection-fashion-1",
            left: 40,
            top: 30,
            width: 20,
            height: 35,
            type: "open"
          }
        ],
        views: 478,
      }

      setPosts((current) => [...(current || []), bijoufanjournalPost2])
    }

    const bijoufanjournalPost3Exists = posts.some(p => p.id === "bijoufanjournal-post-3")
    
    if (!bijoufanjournalPost3Exists) {
      const bijoufanjournalPost3: Post = {
        id: "bijoufanjournal-post-3",
        authorId: bijoufanjournalUser.vizBizId,
        author: {
          username: "bijoufanjournal",
          avatar: editorLogo,
          id: bijoufanjournalUser.vizBizId,
        },
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        mediaUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop",
        caption: "Coffee & contemplation - the perfect pairing ☕️🌿 #lifestyle #aesthetic #moments",
        likes: 178,
        comments: [],
        selections: [],
        views: 289,
      }

      setPosts((current) => [...(current || []), bijoufanjournalPost3])
    }

    const bijoufiPost2Exists = posts.some(p => p.id === "bijoufi-post-2")
    
    if (!bijoufiPost2Exists) {
      const bijoufiPost2: Post = {
        id: "bijoufi-post-2",
        authorId: bijoufiUser.vizBizId,
        author: {
          username: "bijoufi",
          avatar: bijoufiLogo,
          id: bijoufiUser.vizBizId,
        },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        mediaUrl: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800&h=800&fit=crop",
        caption: "Delicate chains, bold statements 🔗✨ Each link tells a story #bijoufi #jewelry #craft",
        likes: 67,
        comments: [
          {
            id: "c-bijoufi-2-1",
            username: "bijoufanjournal",
            text: "The craftsmanship is incredible! 💎",
            avatar: editorLogo,
          }
        ],
        selections: [
          {
            id: "selection-chain-detail",
            left: 25,
            top: 35,
            width: 35,
            height: 30,
            type: "approval"
          }
        ],
        views: 198,
      }

      setPosts((current) => [...(current || []), bijoufiPost2])
    }

    const bijoufiPost3Exists = posts.some(p => p.id === "bijoufi-post-3")
    
    if (!bijoufiPost3Exists) {
      const bijoufiPost3: Post = {
        id: "bijoufi-post-3",
        authorId: bijoufiUser.vizBizId,
        author: {
          username: "bijoufi",
          avatar: bijoufiLogo,
          id: bijoufiUser.vizBizId,
        },
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        mediaUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop",
        caption: "Gemstone magic in rose gold 💫 The perfect balance between elegance and edge #bijoufi #rosegold #gems",
        likes: 94,
        comments: [
          {
            id: "c-bijoufi-3-1",
            username: "bijoufanjournal",
            text: "This color palette is divine! 🌹",
            avatar: editorLogo,
          }
        ],
        selections: [
          {
            id: "selection-gemstone",
            left: 38,
            top: 40,
            width: 24,
            height: 28,
            type: "open"
          }
        ],
        views: 245,
      }

      setPosts((current) => [...(current || []), bijoufiPost3])
    }

    const bijoufiPost4Exists = posts.some(p => p.id === "bijoufi-post-4")
    
    if (!bijoufiPost4Exists) {
      const bijoufiPost4: Post = {
        id: "bijoufi-post-4",
        authorId: bijoufiUser.vizBizId,
        author: {
          username: "bijoufi",
          avatar: bijoufiLogo,
          id: bijoufiUser.vizBizId,
        },
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        mediaUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop",
        caption: "Silver moonlight captured in metal 🌙 Contemporary designs for modern souls #sterlingsilver #bijoufi #jewelry",
        likes: 81,
        comments: [],
        selections: [
          {
            id: "selection-silver-pendant",
            left: 35,
            top: 35,
            width: 30,
            height: 30,
            type: "approval"
          }
        ],
        views: 176,
      }

      setPosts((current) => [...(current || []), bijoufiPost4])
    }

    const bijoufanjournalPost4Exists = posts.some(p => p.id === "bijoufanjournal-post-4")
    
    if (!bijoufanjournalPost4Exists) {
      const bijoufanjournalPost4: Post = {
        id: "bijoufanjournal-post-4",
        authorId: bijoufanjournalUser.vizBizId,
        author: {
          username: "bijoufanjournal",
          avatar: editorLogo,
          id: bijoufanjournalUser.vizBizId,
        },
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        mediaUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop",
        caption: "Texture and light: the poetry of precious metals 🌟 #editorial #jewelry #artistry",
        likes: 142,
        comments: [
          {
            id: "c-bjj-4-1",
            username: "bijoufi",
            text: "Beautiful composition! Love how the light plays across the surface ✨",
            avatar: bijoufiLogo,
          }
        ],
        selections: [
          {
            id: "selection-texture-1",
            left: 30,
            top: 35,
            width: 40,
            height: 30,
            type: "approval"
          }
        ],
        views: 367,
      }

      setPosts((current) => [...(current || []), bijoufanjournalPost4])
    }

    const bijoufanjournalPost5Exists = posts.some(p => p.id === "bijoufanjournal-post-5")
    
    if (!bijoufanjournalPost5Exists) {
      const bijoufanjournalPost5: Post = {
        id: "bijoufanjournal-post-5",
        authorId: bijoufanjournalUser.vizBizId,
        author: {
          username: "bijoufanjournal",
          avatar: editorLogo,
          id: bijoufanjournalUser.vizBizId,
        },
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        mediaUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
        caption: "Pearls reimagined for the contemporary wardrobe 🤍 Classic meets modern #pearls #jewelry #timeless",
        likes: 219,
        comments: [
          {
            id: "c-bjj-5-1",
            username: "bijoufi",
            text: "Pearls never go out of style! 💕",
            avatar: bijoufiLogo,
          }
        ],
        selections: [
          {
            id: "selection-pearl-1",
            left: 20,
            top: 30,
            width: 25,
            height: 35,
            type: "open"
          },
          {
            id: "selection-pearl-2",
            left: 55,
            top: 35,
            width: 30,
            height: 30,
            type: "open"
          }
        ],
        views: 456,
      }

      setPosts((current) => [...(current || []), bijoufanjournalPost5])
    }

    const bijoufiPost5Exists = posts.some(p => p.id === "bijoufi-post-5")
    
    if (!bijoufiPost5Exists) {
      const bijoufiPost5: Post = {
        id: "bijoufi-post-5",
        authorId: bijoufiUser.vizBizId,
        author: {
          username: "bijoufi",
          avatar: bijoufiLogo,
          id: bijoufiUser.vizBizId,
        },
        timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
        mediaUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
        caption: "Sculptural forms inspired by nature's geometry 🌿 When art meets adornment #bijoufi #sculptural #jewelry",
        likes: 103,
        comments: [],
        selections: [
          {
            id: "selection-sculptural",
            left: 28,
            top: 32,
            width: 44,
            height: 36,
            type: "approval"
          }
        ],
        views: 221,
      }

      setPosts((current) => [...(current || []), bijoufiPost5])
    }

    const bijoufanjournalPost6Exists = posts.some(p => p.id === "bijoufanjournal-post-6")
    
    if (!bijoufanjournalPost6Exists) {
      const bijoufanjournalPost6: Post = {
        id: "bijoufanjournal-post-6",
        authorId: bijoufanjournalUser.vizBizId,
        author: {
          username: "bijoufanjournal",
          avatar: editorLogo,
          id: bijoufanjournalUser.vizBizId,
        },
        timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
        mediaUrl: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&h=800&fit=crop",
        caption: "Layering essentials for the season 🌸 Mix, match, and create your signature look #layering #style #editorial",
        likes: 187,
        comments: [],
        selections: [
          {
            id: "selection-layer-1",
            left: 15,
            top: 25,
            width: 30,
            height: 40,
            type: "open"
          },
          {
            id: "selection-layer-2",
            left: 55,
            top: 30,
            width: 30,
            height: 35,
            type: "open"
          }
        ],
        views: 412,
      }

      setPosts((current) => [...(current || []), bijoufanjournalPost6])
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
