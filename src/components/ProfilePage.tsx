import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShieldAvatar } from "@/components/ShieldAvatar"
import { MyVizPage } from "@/components/MyVizPage"
import { User, Sparkle, GridFour } from "@phosphor-icons/react"

interface Post {
  id: string
  authorId: string
  mediaUrl: string
  mediaType: "photo" | "video"
  caption: string
  hashtags: string[]
  likes: number
  comments: number
  timestamp: string
}

export function ProfilePage() {
  const [currentUser] = useKV<{ id?: string; username: string; avatar: string; vizBizId?: string } | null>("viz-current-user", null)
  const [posts] = useKV<Post[]>("feed-posts", [])
  const [myVizItems] = useKV<any[]>("my-viz-items", [])

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
    (post) => post.authorId === (currentUser.id || currentUser.vizBizId || currentUser.username)
  )

  const userVizItems = (myVizItems || []).filter(
    (item) => item.creatorId === (currentUser.id || currentUser.vizBizId || currentUser.username)
  )

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <div className="mb-8 flex flex-col items-center text-center">
        <ShieldAvatar
          src={currentUser.avatar}
          alt={currentUser.username}
          className="w-[120px] h-[140px] mb-4"
        />
        <h1 className="text-2xl font-bold text-foreground mb-1">
          @{currentUser.username}
        </h1>
        {currentUser.vizBizId && (
          <p className="text-xs text-muted-foreground">
            Viz. Biz ID: {currentUser.vizBizId}
          </p>
        )}
        
        <div className="flex items-center gap-6 mt-4 text-sm">
          <div className="text-center">
            <p className="font-bold text-foreground">{userPosts.length}</p>
            <p className="text-muted-foreground">Posts</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-foreground">{userVizItems.length}</p>
            <p className="text-muted-foreground">Viz.Listables</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full border-b border-border rounded-none h-auto p-0 bg-transparent mb-6 grid grid-cols-2">
          <TabsTrigger
            value="posts"
            className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
          >
            <GridFour size={20} className="mr-2" weight="fill" />
            <span className="font-semibold">Posts</span>
            {userPosts.length > 0 && (
              <Badge className="ml-2 bg-muted text-foreground rounded-full px-2 py-0 text-xs">
                {userPosts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="myviz"
            className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
          >
            <Sparkle size={20} className="mr-2" weight="fill" />
            <span className="font-semibold">MyViz</span>
            {userVizItems.length > 0 && (
              <Badge className="ml-2 bg-muted text-foreground rounded-full px-2 py-0 text-xs">
                {userVizItems.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-0">
          {userPosts.length === 0 ? (
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
            <div className="grid grid-cols-3 gap-1">
              {userPosts.map((post) => (
                <Card key={post.id} className="aspect-square overflow-hidden p-0 border-0 cursor-pointer hover:opacity-80 transition-opacity">
                  <img
                    src={post.mediaUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover"
                  />
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="myviz" className="mt-0">
          <MyVizPage />
        </TabsContent>
      </Tabs>
    </div>
  )
}
