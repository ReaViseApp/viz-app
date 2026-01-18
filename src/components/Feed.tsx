import { useEffect, useState, useRef } from "react"
import { PostCard } from "./PostCard"
import { useKV } from "@github/spark/hooks"
import { Skeleton } from "@/components/ui/skeleton"

interface Post {
  id: string
  author: {
    username: string
    avatar: string
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
}

export function Feed() {
  const [posts, setPosts] = useKV<Post[]>("feed-posts", [])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const observerTarget = useRef<HTMLDivElement>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!initialized && (!posts || posts.length === 0)) {
      const initialPosts: Post[] = [
        {
          id: "post-1",
          author: {
            username: "designlover",
            avatar: "https://i.pravatar.cc/150?img=5",
          },
          timestamp: "2h",
          mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop",
          caption: "Just finished this abstract piece! The interplay of light and shadow creates such a dynamic composition. What do you think? #abstractart #contemporaryart #vizart",
          likes: 234,
          comments: [
            {
              id: "c1",
              username: "artcritic_jane",
              text: "Love the color palette!",
              avatar: "https://i.pravatar.cc/150?img=9",
            },
            {
              id: "c2",
              username: "visualartist",
              text: "The composition is stunning. Mind if I Viz.List the left corner?",
              avatar: "https://i.pravatar.cc/150?img=12",
            },
          ],
          selections: [
            { id: "sel-1", left: 10, top: 15, width: 35, height: 40, type: "open" },
            { id: "sel-2", left: 55, top: 45, width: 30, height: 35, type: "approval" },
          ],
        },
        {
          id: "post-2",
          author: {
            username: "urban_photographer",
            avatar: "https://i.pravatar.cc/150?img=8",
          },
          timestamp: "5h",
          mediaUrl: "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=800&h=800&fit=crop",
          caption: "Golden hour in the city never gets old. Captured this moment during my evening walk",
          likes: 892,
          comments: [
            {
              id: "c3",
              username: "photogeek",
              text: "What camera did you use?",
              avatar: "https://i.pravatar.cc/150?img=15",
            },
            {
              id: "c4",
              username: "cityscapes",
              text: "Beautiful light! That building reflection is perfect",
              avatar: "https://i.pravatar.cc/150?img=20",
            },
          ],
          selections: [
            { id: "sel-3", left: 20, top: 25, width: 40, height: 30, type: "open" },
            { id: "sel-4", left: 5, top: 60, width: 25, height: 25, type: "open" },
          ],
        },
        {
          id: "post-3",
          author: {
            username: "minimalist_design",
            avatar: "https://i.pravatar.cc/150?img=3",
          },
          timestamp: "1d",
          mediaUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&h=800&fit=crop",
          caption: "Less is more. Simple geometric forms can say so much without saying anything at all. This is my philosophy in design. #minimalism #design #geometricart",
          likes: 1543,
          comments: [
            {
              id: "c5",
              username: "geometric_dreams",
              text: "This speaks to my soul",
              avatar: "https://i.pravatar.cc/150?img=11",
            },
          ],
          selections: [
            { id: "sel-5", left: 30, top: 30, width: 40, height: 40, type: "approval" },
          ],
        },
      ]
      setPosts(initialPosts)
      setInitialized(true)
    }
  }, [initialized, posts, setPosts])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && posts && posts.length > 0) {
          setLoading(true)
          setTimeout(() => {
            setPage((prev) => prev + 1)
            setLoading(false)
          }, 1000)
        }
      },
      { threshold: 0.5 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [loading, posts])

  const handleLike = (postId: string) => {
    setPosts((currentPosts) =>
      (currentPosts || []).map((post) =>
        post.id === postId
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    )
  }

  const handleComment = (postId: string, commentText: string) => {
    setPosts((currentPosts) =>
      (currentPosts || []).map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: `comment-${Date.now()}`,
                  username: "current_user",
                  text: commentText,
                  avatar: "https://i.pravatar.cc/150?img=1",
                },
              ],
            }
          : post
      )
    )
  }

  if (!posts || posts.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to Viz.</h2>
        <p className="text-muted-foreground">
          Start following users to see their posts in your feed
        </p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6 pb-12">
      {posts && posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={handleLike}
          onComment={handleComment}
        />
      ))}

      {loading && (
        <div className="w-full max-w-[470px] mx-auto space-y-4">
          <Skeleton className="w-full h-[600px] rounded-lg" />
        </div>
      )}

      <div ref={observerTarget} className="h-20" />
    </div>
  )
}
