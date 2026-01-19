import { useEffect } from "react"
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
  const [posts, setPosts] = useKV<Post[]>("feed-posts", [])
  const [users] = useKV<any[]>("viz-users", [])

  useEffect(() => {
    if (!posts || !users || posts.length === 0 || users.length === 0) return

    const bijoufiUser = users.find((u: any) => u.username === "bijoufi")
    const bijoufanjournalUser = users.find((u: any) => u.username === "bijoufanjournal")

    if (!bijoufiUser || !bijoufanjournalUser) return

    setPosts((currentPosts) => {
      return (currentPosts || []).map(post => {
        const needsUpdate = !post.likedBy || 
          (post.author.username === "bijoufi" && !post.comments.some(c => c.username === "bijoufanjournal")) ||
          (post.author.username === "bijoufanjournal" && !post.comments.some(c => c.username === "bijoufi"))

        if (!needsUpdate) return post

        const updatedPost = { ...post }
        
        if (!updatedPost.likedBy) {
          updatedPost.likedBy = []
        }

        if (post.author.username === "bijoufi") {
          if (!updatedPost.likedBy.includes(bijoufanjournalUser.vizBizId)) {
            updatedPost.likedBy = [...updatedPost.likedBy, bijoufanjournalUser.vizBizId]
            updatedPost.likes = updatedPost.likedBy.length
          }

          const hasComment = updatedPost.comments.some(c => c.username === "bijoufanjournal")
          if (!hasComment) {
            const commentTexts = [
              "This is absolutely stunning! The golden tones are perfect 😍✨",
              "Love the design aesthetic! So elegant and timeless 💫",
              "The craftsmanship is incredible - such attention to detail! 🌟",
            ]
            const randomComment = commentTexts[Math.floor(Math.random() * commentTexts.length)]

            updatedPost.comments = [
              ...updatedPost.comments,
              {
                id: `comment-bijoufanjournal-${Date.now()}`,
                username: "bijoufanjournal",
                text: randomComment,
                avatar: editorLogo,
              }
            ]
          }
        }

        if (post.author.username === "bijoufanjournal") {
          if (!updatedPost.likedBy.includes(bijoufiUser.vizBizId)) {
            updatedPost.likedBy = [...updatedPost.likedBy, bijoufiUser.vizBizId]
            updatedPost.likes = updatedPost.likedBy.length
          }

          const hasComment = updatedPost.comments.some(c => c.username === "bijoufi")
          if (!hasComment) {
            const commentTexts = [
              "Beautiful curation! Really inspiring work 🎨",
              "Love your eye for detail! This is gorgeous ✨",
              "Such a great composition - well done! 💯",
            ]
            const randomComment = commentTexts[Math.floor(Math.random() * commentTexts.length)]

            updatedPost.comments = [
              ...updatedPost.comments,
              {
                id: `comment-bijoufi-${Date.now()}`,
                username: "bijoufi",
                text: randomComment,
                avatar: bijoufiLogo,
              }
            ]
          }
        }

        return updatedPost
      })
    })
  }, [posts, users, setPosts])
}
