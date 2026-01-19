import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShieldAvatar } from "@/components/ShieldAvatar"
import { MyVizPage } from "@/components/MyVizPage"
import { EditProfileModal } from "@/components/EditProfileModal"
import { MediaItem } from "@/components/MediaCarousel"
import { User, Sparkle, GridFour, Eye, ListChecks, PencilLine, Lock, Users, Globe, UserCircleGear, Play, Images } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface Post {
  id: string
  authorId: string
  mediaUrl?: string
  media?: MediaItem[]
  mediaType?: "photo" | "video"
  caption: string
  hashtags?: string[]
  likes: number
  comments: number
  timestamp: string
  views?: number
  selections?: Array<{
    id: string
    left: number
    top: number
    width: number
    height: number
    type: "open" | "approval"
  }>
}

interface Editorial {
  id: string
  authorId: string
  authorUsername: string
  authorAvatar: string
  pages: any[]
  assetReferences: string[]
  title?: string
  publishedAt: string
  type: "VizEdit"
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
}

export function ProfilePage() {
  const [currentUser] = useKV<{ id?: string; username: string; avatar: string; vizBizId?: string; bio?: string; followers?: number; following?: number; profileVisibility?: "public" | "followers" | "private" } | null>("viz-current-user", null)
  const [posts] = useKV<Post[]>("feed-posts", [])
  const [editorials] = useKV<Editorial[]>("viz-editorials", [])
  const [vizList] = useKV<VizListItem[]>("viz-list-items", [])
  const [myVizItems] = useKV<any[]>("my-viz-items", [])
  const [profileVisibility] = useKV<"public" | "followers" | "private">(
    `profile-visibility-${currentUser?.id || currentUser?.vizBizId}`,
    "public"
  )
  const [followRequests] = useKV<any[]>(
    `follow-requests-${currentUser?.id || currentUser?.vizBizId}`,
    []
  )
  const [isFollowing, setIsFollowing] = useState(false)
  const [hoveredPostId, setHoveredPostId] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const pendingFollowRequests = (followRequests || []).filter(req => req.status === "pending")

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <User size={80} className="text-muted-foreground mb-4" weight="thin" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Please log in to view your profile
        </h3>
        <Button className="bg-primary hover:bg-accent text-primary-foreground mt-4">
          Log In
        </Button>
      </div>
    )
  }

  const userPosts = (posts || []).filter(
    (post) => post.authorId === (currentUser?.id || currentUser?.vizBizId || currentUser?.username)
  )

  const userEditorials = (editorials || []).filter(
    (editorial) => editorial.authorId === (currentUser?.id || currentUser?.vizBizId || currentUser?.username)
  )

  const userVizList = (vizList || []).filter(() => true)

  const userVizItems = (myVizItems || []).filter(
    (item) => item.creatorId === (currentUser?.id || currentUser?.vizBizId || currentUser?.username)
  )

  const isOwnProfile = true

  return (
    <>
      <div className="mb-8 flex flex-col items-center text-center">
        <ShieldAvatar
          src={currentUser.avatar}
          alt={currentUser.username}
          className="w-[120px] h-[140px] mb-4"
        />
        <h1 className="text-2xl font-bold text-foreground mb-1">
          @{currentUser.username}
        </h1>
        {currentUser.bio && (
          <p className="text-sm text-foreground mt-2 max-w-md">
            {currentUser.bio}
          </p>
        )}
        {currentUser.vizBizId && (
          <p className="text-xs text-muted-foreground mt-1">
            Viz. Biz ID: {currentUser.vizBizId}
          </p>
        )}
        
        <div className="flex items-center gap-6 mt-4 text-sm">
          <div className="text-center">
            <p className="font-bold text-foreground">{userPosts.length + userEditorials.length}</p>
            <p className="text-muted-foreground">Posts</p>
          </div>
          <div className="text-center cursor-pointer hover:opacity-70 transition-opacity">
            <p className="font-bold text-foreground">{currentUser.followers || 247}</p>
            <p className="text-muted-foreground">Followers</p>
          </div>
          <div className="text-center cursor-pointer hover:opacity-70 transition-opacity">
            <p className="font-bold text-foreground">{currentUser.following || 183}</p>
            <p className="text-muted-foreground">Following</p>
          </div>
        </div>

        <div className="mt-6">
          {isOwnProfile ? (
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <PencilLine size={16} weight="bold" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 relative"
                  onClick={() => window.location.hash = "#manage-followers"}
                >
                  <UserCircleGear size={16} weight="bold" />
                  Manage Followers
                  {pendingFollowRequests.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-coral text-primary-foreground rounded-full w-5 h-5 p-0 flex items-center justify-center text-xs">
                      {pendingFollowRequests.length}
                    </Badge>
                  )}
                </Button>
              </div>
              {profileVisibility && profileVisibility !== "public" && (
                <Badge className={cn(
                  "gap-1.5 px-3 py-1",
                  profileVisibility === "followers" && "bg-peach text-foreground",
                  profileVisibility === "private" && "bg-accent text-accent-foreground"
                )}>
                  {profileVisibility === "followers" && <Users size={14} weight="fill" />}
                  {profileVisibility === "private" && <Lock size={14} weight="fill" />}
                  {profileVisibility === "followers" ? "Followers Only" : "Private Profile"}
                </Badge>
              )}
            </div>
          ) : (
            <Button
              className={cn(
                "gap-2",
                !isFollowing && "bg-primary text-primary-foreground hover:bg-accent",
                isFollowing && "bg-transparent border-2 border-primary text-primary hover:bg-primary/10"
              )}
              onClick={() => setIsFollowing(!isFollowing)}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </div>
      </div>

      <EditProfileModal 
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <Tabs defaultValue="all-viz-its" className="w-full">
        <TabsList className="w-full border-b border-border rounded-none h-auto p-0 bg-transparent mb-6 grid grid-cols-3">
          <TabsTrigger
            value="all-viz-its"
            className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
          >
            <GridFour size={20} className="mr-2" weight="fill" />
            <span className="font-semibold">All Viz.Its</span>
            {(userPosts.length + userEditorials.length) > 0 && (
              <Badge className="ml-2 bg-muted text-foreground rounded-full px-2 py-0 text-xs">
                {userPosts.length + userEditorials.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="viz-edits"
            className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
          >
            <Sparkle size={20} className="mr-2" weight="fill" />
            <span className="font-semibold">Viz.Edits</span>
            {userEditorials.length > 0 && (
              <Badge className="ml-2 bg-muted text-foreground rounded-full px-2 py-0 text-xs">
                {userEditorials.length}
              </Badge>
            )}
          </TabsTrigger>
          {isOwnProfile && (
            <TabsTrigger
              value="viz-list"
              className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
            >
              <ListChecks size={20} className="mr-2" weight="fill" />
              <span className="font-semibold">Viz.List</span>
              {userVizList.length > 0 && (
                <Badge className="ml-2 bg-muted text-foreground rounded-full px-2 py-0 text-xs">
                  {userVizList.length}
                </Badge>
              )}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="all-viz-its" className="mt-0">
          {(userPosts.length + userEditorials.length) === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <GridFour size={80} className="text-muted-foreground mb-4" weight="thin" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No posts yet
              </h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Share your first Viz.It to start building your profile!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
              {[...userEditorials.map(e => ({ ...e, itemType: "editorial" as const })), ...userPosts.map(p => ({ ...p, itemType: "post" as const }))].map((item) => (
                <Card 
                  key={item.id} 
                  className="aspect-square overflow-hidden p-0 border-0 cursor-pointer group relative"
                  onMouseEnter={() => setHoveredPostId(item.id)}
                  onMouseLeave={() => setHoveredPostId(null)}
                >
                  {item.itemType === "editorial" ? (
                    <div className="relative w-full h-full">
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundColor: item.pages[0]?.backgroundColor || "#fff"
                        }}
                      >
                        {item.pages[0]?.canvasElements.map((element: any) => (
                          <div
                            key={element.id}
                            className="absolute"
                            style={{
                              left: element.x,
                              top: element.y,
                              width: element.width,
                              height: element.height,
                              transform: `rotate(${element.rotation}deg)`,
                              zIndex: element.zIndex
                            }}
                          >
                            {element.type === "image" && (
                              <img
                                src={element.data.src}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-primary/90 text-primary-foreground flex items-center gap-1 text-xs">
                          <Sparkle size={12} weight="fill" />
                          VizEdit
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      {(() => {
                        const mediaItems = item.media || (item.mediaUrl ? [{ url: item.mediaUrl, type: "image" as const }] : [])
                        const firstMedia = mediaItems[0]
                        const hasMultiple = mediaItems.length > 1
                        const hasVideo = mediaItems.some(m => m.type === "video")
                        
                        return (
                          <>
                            {firstMedia?.type === "video" ? (
                              <video
                                src={firstMedia.url}
                                className="w-full h-full object-cover"
                                muted
                                playsInline
                              />
                            ) : (
                              <img
                                src={firstMedia?.url || item.mediaUrl || ""}
                                alt={item.caption}
                                className="w-full h-full object-cover"
                              />
                            )}
                            
                            {hasMultiple && (
                              <div className="absolute top-2 right-2">
                                <Badge className="bg-black/60 text-white flex items-center gap-1 text-xs">
                                  <Images size={12} weight="fill" />
                                  {mediaItems.length}
                                </Badge>
                              </div>
                            )}
                            
                            {hasVideo && (
                              <div className="absolute top-2 right-2">
                                <Badge className="bg-black/60 text-white flex items-center gap-1 text-xs">
                                  <Play size={12} weight="fill" />
                                </Badge>
                              </div>
                            )}
                            
                            {item.selections && item.selections.length > 0 && (
                              <>
                                {item.selections.map((selection: any) => (
                                  <div
                                    key={selection.id}
                                    className={cn(
                                      "absolute border-2 pointer-events-none",
                                      selection.type === "open" 
                                        ? "border-mint/60" 
                                        : "border-peach/60"
                                    )}
                                    style={{
                                      left: `${selection.left}%`,
                                      top: `${selection.top}%`,
                                      width: `${selection.width}%`,
                                      height: `${selection.height}%`,
                                    }}
                                  />
                                ))}
                              </>
                            )}
                          </>
                        )
                      })()}
                    </div>
                  )}
                  {hoveredPostId === item.id && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-4 text-white text-sm font-semibold">
                      <div className="flex items-center gap-1">
                        <Eye size={20} weight="fill" />
                        <span>{"views" in item ? item.views || Math.floor(Math.random() * 1000) + 100 : Math.floor(Math.random() * 1000) + 100}</span>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="viz-edits" className="mt-0">
          {userEditorials.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Sparkle size={80} className="text-muted-foreground mb-4" weight="thin" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Viz.Edits yet
              </h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Create your first editorial from your Viz.List!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
              {userEditorials.map((editorial) => (
                <Card 
                  key={editorial.id} 
                  className="aspect-square overflow-hidden p-0 border-0 cursor-pointer group relative"
                  onMouseEnter={() => setHoveredPostId(editorial.id)}
                  onMouseLeave={() => setHoveredPostId(null)}
                >
                  <div className="relative w-full h-full">
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundColor: editorial.pages[0]?.backgroundColor || "#fff"
                      }}
                    >
                      {editorial.pages[0]?.canvasElements.map((element: any) => (
                        <div
                          key={element.id}
                          className="absolute"
                          style={{
                            left: element.x,
                            top: element.y,
                            width: element.width,
                            height: element.height,
                            transform: `rotate(${element.rotation}deg)`,
                            zIndex: element.zIndex
                          }}
                        >
                          {element.type === "image" && (
                            <img
                              src={element.data.src}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-primary/90 text-primary-foreground flex items-center gap-1 text-xs">
                        <Sparkle size={12} weight="fill" />
                        VizEdit
                      </Badge>
                    </div>
                  </div>
                  {hoveredPostId === editorial.id && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-4 text-white text-sm font-semibold">
                      <div className="flex items-center gap-1">
                        <Eye size={20} weight="fill" />
                        <span>{Math.floor(Math.random() * 1000) + 100}</span>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {isOwnProfile && (
          <TabsContent value="viz-list" className="mt-0">
            {userVizList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <ListChecks size={80} className="text-muted-foreground mb-4" weight="thin" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Your Viz.List is empty
                </h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Start saving your favorite content selections!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                {userVizList.map((item) => (
                  <Card 
                    key={item.id} 
                    className="aspect-square overflow-hidden p-0 border-0 cursor-pointer group relative"
                    onMouseEnter={() => setHoveredPostId(item.id)}
                    onMouseLeave={() => setHoveredPostId(null)}
                  >
                    <div className="relative w-full h-full">
                      <img
                        src={item.contentThumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute border-2 border-primary/60 pointer-events-none"
                        style={{
                          left: `${item.selectionArea.left}%`,
                          top: `${item.selectionArea.top}%`,
                          width: `${item.selectionArea.width}%`,
                          height: `${item.selectionArea.height}%`,
                        }}
                      />
                    </div>
                    {hoveredPostId === item.id && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-4 text-white text-sm font-semibold">
                        <span>@{item.creatorUsername}</span>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </>
  )
}
