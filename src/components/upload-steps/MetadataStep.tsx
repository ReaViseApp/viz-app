import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { useKV } from "@github/spark/hooks"
import { cn } from "@/lib/utils"
import confetti from "canvas-confetti"
import type { MediaFile, Selection } from "../ContentUploadFlow"

interface MetadataStepProps {
  media: MediaFile
  selections: Selection[]
  onBack: () => void
}

interface User {
  id?: string
  username: string
  email?: string
  phone?: string
  password: string
  vizBizId: string
  avatar: string
  createdAt: string
}

interface Post {
  id: string
  author: {
    username: string
    avatar: string
  }
  timestamp: string
  mediaUrl: string
  mediaType: "image" | "video"
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
  hashtags: string[]
  createdAt: string
}

export function MetadataStep({ media, selections, onBack }: MetadataStepProps) {
  const [title, setTitle] = useState("")
  const [hashtags, setHashtags] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [isPublishing, setIsPublishing] = useState(false)
  const [currentUser] = useKV<User | null>("viz-current-user", null)
  const [posts, setPosts] = useKV<Post[]>("feed-posts", [])
  const [myVizItems, setMyVizItems] = useKV<any[]>("my-viz-items", [])

  useEffect(() => {
    const words = title.trim().split(/\s+/).filter(w => w.length > 0)
    setWordCount(words.length)
  }, [title])

  const formatHashtags = (input: string) => {
    return input
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .map(tag => (tag.startsWith("#") ? tag : `#${tag}`))
      .join(", ")
  }

  const handleHashtagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatHashtags(e.target.value)
    setHashtags(formatted)
  }

  const handlePublish = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title")
      return
    }

    if (wordCount > 20) {
      toast.error("Title must be 20 words or less")
      return
    }

    if (!currentUser) {
      toast.error("You must be logged in to publish")
      return
    }

    setIsPublishing(true)

    const hashtagArray = hashtags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: {
        username: currentUser.username,
        avatar: currentUser.avatar,
      },
      timestamp: "Just now",
      mediaUrl: media.url,
      mediaType: media.type,
      caption: `${title} ${hashtagArray.join(" ")}`,
      likes: 0,
      comments: [],
      selections: selections.map(sel => ({
        id: sel.id,
        left: (sel.x / 800) * 100,
        top: (sel.y / 800) * 100,
        width: (sel.width / 800) * 100,
        height: (sel.height / 800) * 100,
        type: sel.type,
      })),
      hashtags: hashtagArray,
      createdAt: new Date().toISOString(),
    }

    await new Promise(resolve => setTimeout(resolve, 1000))

    setPosts((currentPosts) => [newPost, ...(currentPosts || [])])

    if (selections.length > 0) {
      const myVizItem = {
        id: `myviz-${Date.now()}`,
        mediaUrl: media.url,
        mediaType: media.type,
        title: title,
        hashtags: hashtagArray,
        creatorId: currentUser.id || currentUser.vizBizId || currentUser.username,
        selections: selections.map(sel => ({
          id: sel.id,
          coordinates: {
            left: (sel.x / 800) * 100,
            top: (sel.y / 800) * 100,
            width: (sel.width / 800) * 100,
            height: (sel.height / 800) * 100,
          },
          type: sel.type === "open" ? "open-to-repost" : "approval-required",
          publishedBy: []
        })),
        createdDate: new Date().toISOString(),
        stats: {
          views: 0,
          vizListCount: 0,
          vizItCount: 0
        }
      }
      
      setMyVizItems((current) => [myVizItem, ...(current || [])])
    }

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFB6C1", "#FFC0CB", "#FF69B4", "#98D8AA", "#FFDAB3"],
    })

    toast.success("Your Viz.It is Now Live!")

    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Add Details</h2>
        <p className="text-muted-foreground">Give your content a title and tags</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden">
              {media.type === "image" ? (
                <img
                  src={media.url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={media.url}
                  controls
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 pointer-events-none">
                {selections.map((selection) => (
                  <div
                    key={selection.id}
                    className="absolute border-2 border-dashed"
                    style={{
                      left: `${(selection.x / 800) * 100}%`,
                      top: `${(selection.y / 800) * 100}%`,
                      width: `${(selection.width / 800) * 100}%`,
                      height: `${(selection.height / 800) * 100}%`,
                      borderColor: selection.type === "open" ? "#98D8AA" : "#FFDAB3",
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-3 text-center">
              <p className="text-sm text-muted-foreground">
                {selections.length} selection{selections.length !== 1 ? "s" : ""} added
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="title">Title *</Label>
              <span
                className={cn(
                  "text-sm",
                  wordCount > 20 ? "text-coral font-semibold" : "text-muted-foreground"
                )}
              >
                {wordCount}/20 words
              </span>
            </div>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Describe your content..."
              className={cn(wordCount > 20 && "border-coral focus-visible:ring-coral")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hashtags">Hashtags (optional)</Label>
            <Input
              id="hashtags"
              value={hashtags}
              onChange={handleHashtagChange}
              placeholder="art, design, inspiration"
              className="font-medium"
            />
            <p className="text-xs text-muted-foreground">
              Separate tags with commas. # will be added automatically.
            </p>
          </div>

          <Card className="bg-muted/30">
            <CardContent className="p-4 space-y-2">
              <h4 className="font-semibold text-sm">Selection Summary</h4>
              <div className="space-y-1 text-sm">
                {selections.map((sel, idx) => (
                  <div key={sel.id} className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full",
                        sel.type === "open" ? "bg-mint" : "bg-peach"
                      )}
                    />
                    <span>
                      Selection {idx + 1}:{" "}
                      {sel.type === "open" ? "Open" : "Approval Required"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onBack} disabled={isPublishing}>
          Back
        </Button>
        <Button
          onClick={handlePublish}
          disabled={isPublishing || !title.trim() || wordCount > 20}
          className="bg-primary text-primary-foreground hover:bg-accent min-w-[140px]"
          size="lg"
        >
          {isPublishing ? "Publishing..." : "Publish"}
        </Button>
      </div>
    </div>
  )
}
