import { useState, useEffect, useMemo } from "react"
import { useKV } from "@github/spark/hooks"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendUp, Hash, Fire, Sparkle } from "@phosphor-icons/react"
import { motion } from "framer-motion"

interface Post {
  id: string
  caption: string
  timestamp: string
  hashtags?: string[]
  views?: number
  likes: number
  likedBy?: string[]
}

interface HashtagData {
  tag: string
  count: number
  posts: string[]
  trend: "up" | "stable" | "new"
}

export function TrendingPage() {
  const [allPosts] = useKV<Post[]>("viz-posts", [])
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null)
  const [timeFilter, setTimeFilter] = useState<"today" | "week" | "all">("today")

  const hashtagStats = useMemo(() => {
    if (!allPosts || allPosts.length === 0) return []

    const now = Date.now()
    const oneDayAgo = now - 24 * 60 * 60 * 1000
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000

    const filteredPosts = allPosts.filter(post => {
      const postTime = new Date(post.timestamp).getTime()
      if (timeFilter === "today") return postTime >= oneDayAgo
      if (timeFilter === "week") return postTime >= oneWeekAgo
      return true
    })

    const hashtagMap = new Map<string, { count: number; posts: string[]; firstSeen: number }>()

    filteredPosts.forEach(post => {
      const hashtags = post.hashtags || []
      const postTime = new Date(post.timestamp).getTime()

      hashtags.forEach(tag => {
        const cleanTag = tag.replace(/^#/, "").toLowerCase()
        if (!cleanTag) return

        if (hashtagMap.has(cleanTag)) {
          const existing = hashtagMap.get(cleanTag)!
          existing.count += 1
          existing.posts.push(post.id)
          existing.firstSeen = Math.min(existing.firstSeen, postTime)
        } else {
          hashtagMap.set(cleanTag, {
            count: 1,
            posts: [post.id],
            firstSeen: postTime
          })
        }
      })
    })

    const hashtagArray: HashtagData[] = Array.from(hashtagMap.entries()).map(([tag, data]) => {
      const isNew = data.firstSeen >= oneDayAgo
      const trend = isNew ? "new" : data.count >= 5 ? "up" : "stable"

      return {
        tag,
        count: data.count,
        posts: data.posts,
        trend
      }
    })

    return hashtagArray.sort((a, b) => b.count - a.count)
  }, [allPosts, timeFilter])

  const topHashtags = hashtagStats.slice(0, 50)

  const getTrendIcon = (trend: "up" | "stable" | "new") => {
    switch (trend) {
      case "up":
        return <TrendUp size={16} weight="bold" className="text-[#FF6B6B]" />
      case "new":
        return <Sparkle size={16} weight="fill" className="text-[#FFB6C1]" />
      default:
        return null
    }
  }

  const getTrendLabel = (trend: "up" | "stable" | "new") => {
    switch (trend) {
      case "up":
        return "Trending"
      case "new":
        return "New"
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Fire size={32} weight="fill" className="text-[#FF6B6B]" />
          <h1 className="text-3xl font-bold text-foreground">Trending</h1>
        </div>
        <p className="text-muted-foreground">
          Discover what's popular on Viz. right now
        </p>
      </div>

      <div className="flex items-center gap-2 border-b border-border">
        <Button
          variant="ghost"
          onClick={() => setTimeFilter("today")}
          className={`rounded-none border-b-2 transition-colors ${
            timeFilter === "today"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Today
        </Button>
        <Button
          variant="ghost"
          onClick={() => setTimeFilter("week")}
          className={`rounded-none border-b-2 transition-colors ${
            timeFilter === "week"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          This Week
        </Button>
        <Button
          variant="ghost"
          onClick={() => setTimeFilter("all")}
          className={`rounded-none border-b-2 transition-colors ${
            timeFilter === "all"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          All Time
        </Button>
      </div>

      {topHashtags.length === 0 ? (
        <Card className="p-12 text-center">
          <Hash size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No trending hashtags yet</h3>
          <p className="text-muted-foreground">
            Start using hashtags in your posts to see them appear here!
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {topHashtags.map((hashtag, index) => (
            <motion.div
              key={hashtag.tag}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, duration: 0.3 }}
            >
              <Card
                className={`p-4 cursor-pointer transition-all hover:shadow-md hover:border-primary/50 ${
                  selectedHashtag === hashtag.tag ? "border-primary shadow-md" : ""
                }`}
                onClick={() => setSelectedHashtag(selectedHashtag === hashtag.tag ? null : hashtag.tag)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Hash size={20} weight="bold" className="text-primary" />
                        <h3 className="text-lg font-bold text-foreground">
                          {hashtag.tag}
                        </h3>
                        {getTrendIcon(hashtag.trend)}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">{hashtag.count}</span>
                          {" "}
                          {hashtag.count === 1 ? "post" : "posts"}
                        </p>
                        
                        {getTrendLabel(hashtag.trend) && (
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              hashtag.trend === "up"
                                ? "bg-[#FF6B6B]/10 text-[#FF6B6B]"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            {getTrendLabel(hashtag.trend)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {index < 3 && (
                    <div className="ml-4">
                      {index === 0 && <Fire size={32} weight="fill" className="text-[#FF6B6B]" />}
                      {index === 1 && <Fire size={28} weight="fill" className="text-[#FFB6C1]" />}
                      {index === 2 && <Fire size={24} weight="fill" className="text-[#FFDAB3]" />}
                    </div>
                  )}
                </div>

                {selectedHashtag === hashtag.tag && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 pt-4 border-t border-border"
                  >
                    <p className="text-sm text-muted-foreground mb-3">
                      This hashtag appears in {hashtag.count} {hashtag.count === 1 ? "post" : "posts"}
                    </p>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.dispatchEvent(
                          new CustomEvent("search-hashtag", { detail: hashtag.tag })
                        )
                      }}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Hash size={16} className="mr-1" />
                      View all posts
                    </Button>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {topHashtags.length > 0 && (
        <div className="text-center pt-6">
          <p className="text-sm text-muted-foreground">
            Showing top {topHashtags.length} {topHashtags.length === 1 ? "hashtag" : "hashtags"}
          </p>
        </div>
      )}
    </div>
  )
}
