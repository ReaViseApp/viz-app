import { useEffect, useState } from "react"
import { useKV } from "@github/spark/hooks"
import bijoufiLogo from "@/assets/images/bijoufi-logo.svg"
import editorLogo from "@/assets/images/editorlogo-badge.svg"

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
  likedBy?: string[]
}

export function useInitializeInteractions() {
  const [users] = useKV<any[]>("viz-users", [])
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (initialized) return

    const init = async () => {
      const currentUsers = await window.spark.kv.get<any[]>("viz-users") || []
      const currentPosts = await window.spark.kv.get<Post[]>("feed-posts") || []

      if (currentPosts.length === 0 || currentUsers.length === 0) return

      const bijoufiUser = currentUsers.find((u: any) => u.username === "bijoufi")
      const bijoufanjournalUser = currentUsers.find((u: any) => u.username === "bijoufanjournal")

      if (!bijoufiUser || !bijoufanjournalUser) return

      const updatedPosts = currentPosts.map(post => {
        const needsUpdate = !post.likedBy || 
          (post.author.username === "bijoufi" && !post.comments.some(c => c.username === "bijoufanjournal")) ||
          (post.author.username === "bijoufanjournal" && !post.comments.some(c => c.username === "bijoufi"))

        if (!needsUpdate) return post

        const updatedPost = { ...post }
        
        if (!updatedPost.likedBy) {
          updatedPost.likedBy = []
        }

        if (post.author.username === "bijoufi" && !updatedPost.likedBy.includes(bijoufanjournalUser.vizBizId)) {
          updatedPost.likedBy = [...updatedPost.likedBy, bijoufanjournalUser.vizBizId]
          updatedPost.likes = updatedPost.likedBy.length
        }

        if (post.author.username === "bijoufanjournal" && !updatedPost.likedBy.includes(bijoufiUser.vizBizId)) {
          updatedPost.likedBy = [...updatedPost.likedBy, bijoufiUser.vizBizId]
          updatedPost.likes = updatedPost.likedBy.length
        }

        return updatedPost
      })

      await window.spark.kv.set("feed-posts", updatedPosts)
      setInitialized(true)
    }

    init()
  }, [initialized])
}
