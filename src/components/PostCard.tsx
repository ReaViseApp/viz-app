import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ShieldAvatar } from "./ShieldAvatar"
import { SelectionOverlay } from "./SelectionOverlay"
import { MediaCarousel, MediaItem } from "./MediaCarousel"
import { Heart, ChatCircle, PaperPlaneRight, ListChecks, DotsThree } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useKV } from "@github/spark/hooks"

interface Comment {
  id: string
  username: string
  text: string
  avatar: string
}

interface SelectionArea {
  id: string
  left: number
  top: number
  width: number
  height: number
  type: "open" | "approval"
}

interface Post {
  id: string
  author: {
    username: string
    avatar: string
  }
  timestamp: string
  mediaUrl?: string
  media?: MediaItem[]
  caption: string
  likes: number
  comments: Comment[]
  selections: SelectionArea[]
  likedBy?: string[]
}

interface PostCardProps {
  post: Post
  onLike?: (postId: string) => void
  onComment?: (postId: string, comment: string) => void
}

interface ApprovalRequest {
  id: string
  requesterId: string
  requesterUsername: string
  requesterAvatar: string
  creatorId: string
  creatorUsername: string
  creatorAvatar: string
  contentId: string
  contentThumbnail: string
  selectionArea: {
    left: number
    top: number
    width: number
    height: number
  }
  requestDate: string
  status: "pending" | "approved" | "declined"
}

interface VizListItem {
  id: string
  contentId: string
  contentThumbnail: string
  selectionArea: {
    left: number
    top: number
    width: number
    height: number
  }
  creatorUsername: string
  creatorAvatar: string
  status: "approved" | "pending" | "declined"
  addedDate: string
  approvalRequestId?: string
}

export function PostCard({ post, onLike, onComment }: PostCardProps) {
  const [currentUser] = useKV<{ id?: string; username: string; avatar: string; vizBizId?: string } | null>("viz-current-user", null)
  const userId = currentUser?.id || currentUser?.vizBizId || currentUser?.username
  const liked = post.likedBy?.includes(userId || "") || false
  
  const [showAllComments, setShowAllComments] = useState(false)
  const [showFullCaption, setShowFullCaption] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [showHeartAnimation, setShowHeartAnimation] = useState(false)
  const [lastTap, setLastTap] = useState(0)
  const [approvalRequests, setApprovalRequests] = useKV<ApprovalRequest[]>("approval-requests", [])
  const [vizList, setVizList] = useKV<VizListItem[]>("viz-list-items", [])

  const handleLike = () => {
    onLike?.(post.id)
  }

  const handleDoubleTap = () => {
    const now = Date.now()
    const DOUBLE_TAP_DELAY = 300
    
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      if (!liked) {
        onLike?.(post.id)
      }
      setShowHeartAnimation(true)
      setTimeout(() => setShowHeartAnimation(false), 600)
    }
    setLastTap(now)
  }

  const handleAddComment = () => {
    if (commentText.trim()) {
      onComment?.(post.id, commentText)
      setCommentText("")
      toast.success("Comment added!")
    }
  }

  const truncateCaption = (text: string, maxLines: number = 2) => {
    const words = text.split(" ")
    if (words.length <= 20) return text
    return words.slice(0, 20).join(" ")
  }

  const displayedComments = showAllComments ? post.comments : post.comments.slice(-2)
  const hasMoreComments = post.comments.length > 2

  const mediaItems: MediaItem[] = post.media || (post.mediaUrl ? [{ url: post.mediaUrl, type: "image" }] : [])
  const primaryMediaUrl = mediaItems[0]?.url || post.mediaUrl || ""
  
  if (!primaryMediaUrl) {
    return null
  }

  return (
    <Card className="w-full max-w-[470px] mx-auto overflow-hidden border border-border shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <ShieldAvatar 
            src={post.author.avatar} 
            alt={post.author.username}
            size="small"
          />
          <span className="font-bold text-sm">{post.author.username}</span>
          <span className="text-xs text-muted-foreground">{post.timestamp}</span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <DotsThree size={20} weight="bold" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuItem>Copy Link</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative">
        {post.selections && post.selections.length > 0 ? (
          <div onClick={handleDoubleTap}>
            <SelectionOverlay 
              imageUrl={primaryMediaUrl}
              selections={post.selections}
              authorUsername={post.author.username}
              authorAvatar={post.author.avatar}
              contentId={post.id}
              onAddToList={(selectionId, selectionArea) => {
                if (!currentUser) {
                  toast.error("Please log in to add to Viz.List")
                  return
                }
                
                const newVizListItem: VizListItem = {
                  id: `vizlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  contentId: post.id,
                  contentThumbnail: primaryMediaUrl,
                  selectionArea: {
                    left: selectionArea.left,
                    top: selectionArea.top,
                    width: selectionArea.width,
                    height: selectionArea.height
                  },
                  creatorUsername: post.author.username,
                  creatorAvatar: post.author.avatar,
                  status: "approved",
                  addedDate: new Date().toISOString()
                }
                
                setVizList((current) => [...(current || []), newVizListItem])
              }}
              onRequestApproval={(selectionId, selectionArea) => {
                if (!currentUser) {
                  toast.error("Please log in to request approval")
                  return
                }
                
                const userId = currentUser.id || currentUser.vizBizId || currentUser.username || "unknown"
                
                const newRequest: ApprovalRequest = {
                  id: `request-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  requesterId: userId,
                  requesterUsername: currentUser.username,
                  requesterAvatar: currentUser.avatar,
                  creatorId: post.author.username,
                  creatorUsername: post.author.username,
                  creatorAvatar: post.author.avatar,
                  contentId: post.id,
                  contentThumbnail: primaryMediaUrl,
                  selectionArea: {
                    left: selectionArea.left,
                    top: selectionArea.top,
                    width: selectionArea.width,
                    height: selectionArea.height
                  },
                  requestDate: new Date().toISOString(),
                  status: "pending"
                }
                
                setApprovalRequests((current) => [...(current || []), newRequest])
                
                const newVizListItem: VizListItem = {
                  id: `vizlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  contentId: post.id,
                  contentThumbnail: primaryMediaUrl,
                  selectionArea: {
                    left: selectionArea.left,
                    top: selectionArea.top,
                    width: selectionArea.width,
                    height: selectionArea.height
                  },
                  creatorUsername: post.author.username,
                  creatorAvatar: post.author.avatar,
                  status: "pending",
                  addedDate: new Date().toISOString(),
                  approvalRequestId: newRequest.id
                }
                
                setVizList((current) => [...(current || []), newVizListItem])
              }}
            />
          </div>
        ) : (
          <MediaCarousel 
            media={mediaItems}
            onDoubleTap={handleDoubleTap}
          />
        )}
        
        {showHeartAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <Heart 
              size={100} 
              weight="fill" 
              className="text-coral heart-animation"
            />
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className="transition-transform hover:scale-110 active:scale-95">
              <Heart 
                size={24} 
                weight={liked ? "fill" : "regular"}
                className={cn(liked && "text-coral")}
              />
            </button>
            <button className="transition-transform hover:scale-110 active:scale-95">
              <ChatCircle size={24} />
            </button>
            <button className="transition-transform hover:scale-110 active:scale-95">
              <PaperPlaneRight size={24} />
            </button>
          </div>
          <button className="transition-transform hover:scale-110 active:scale-95">
            <ListChecks size={24} />
          </button>
        </div>

        <div className="text-sm font-semibold">
          {post.likes + (liked ? 1 : 0)} likes
        </div>

        <div className="text-sm">
          <span className="font-bold mr-2">{post.author.username}</span>
          <span className="text-foreground">
            {showFullCaption ? post.caption : truncateCaption(post.caption)}
            {!showFullCaption && post.caption.split(" ").length > 20 && (
              <button 
                onClick={() => setShowFullCaption(true)}
                className="ml-1 text-muted-foreground"
              >
                ...more
              </button>
            )}
          </span>
        </div>

        {hasMoreComments && !showAllComments && (
          <button 
            onClick={() => setShowAllComments(true)}
            className="text-sm text-muted-foreground"
          >
            View all {post.comments.length} comments
          </button>
        )}

        <div className="space-y-2">
          {displayedComments.map((comment) => (
            <div key={comment.id} className="text-sm">
              <span className="font-bold mr-2">{comment.username}</span>
              <span className="text-foreground">{comment.text}</span>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex items-start gap-2">
          <Textarea
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="min-h-[40px] max-h-[120px] resize-none text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleAddComment()
              }
            }}
          />
          <Button 
            size="sm"
            onClick={handleAddComment}
            disabled={!commentText.trim()}
            className="shrink-0"
          >
            Post
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          {new Date().toLocaleDateString("en-US", { 
            year: "numeric", 
            month: "long", 
            day: "numeric" 
          })}
        </div>
      </div>
    </Card>
  )
}
