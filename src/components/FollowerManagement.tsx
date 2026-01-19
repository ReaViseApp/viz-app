import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShieldAvatar } from "@/components/ShieldAvatar"
import { Breadcrumb } from "@/components/Breadcrumb"
import { Check, X, MagnifyingGlass, Users, UserPlus, Clock } from "@phosphor-icons/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface FollowRequest {
  id: string
  requesterId: string
  requesterUsername: string
  requesterAvatar: string
  targetUserId: string
  timestamp: string
  status: "pending" | "approved" | "declined"
}

interface Follower {
  id: string
  userId: string
  username: string
  avatar: string
  followedAt: string
}

export function FollowerManagement() {
  const [currentUser] = useKV<any>("viz-current-user", null)
  const [followRequests, setFollowRequests] = useKV<FollowRequest[]>(
    `follow-requests-${currentUser?.id || currentUser?.vizBizId}`,
    []
  )
  const [followers, setFollowers] = useKV<Follower[]>(
    `followers-${currentUser?.id || currentUser?.vizBizId}`,
    []
  )
  const [following, setFollowing] = useKV<Follower[]>(
    `following-${currentUser?.id || currentUser?.vizBizId}`,
    []
  )
  const [searchQuery, setSearchQuery] = useState("")

  const pendingRequests = (followRequests || []).filter(req => req.status === "pending")
  
  const filteredFollowers = (followers || []).filter(follower =>
    follower.username.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const filteredFollowing = (following || []).filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleApproveRequest = (requestId: string) => {
    const request = followRequests?.find(r => r.id === requestId)
    if (!request) return

    setFollowRequests((prev) =>
      (prev || []).map(req =>
        req.id === requestId ? { ...req, status: "approved" as const } : req
      )
    )

    const newFollower: Follower = {
      id: `follower-${Date.now()}`,
      userId: request.requesterId,
      username: request.requesterUsername,
      avatar: request.requesterAvatar,
      followedAt: new Date().toISOString()
    }

    setFollowers((prev) => [...(prev || []), newFollower])

    toast.success(`@${request.requesterUsername} is now following you!`)
  }

  const handleDeclineRequest = (requestId: string) => {
    const request = followRequests?.find(r => r.id === requestId)
    if (!request) return

    setFollowRequests((prev) =>
      (prev || []).map(req =>
        req.id === requestId ? { ...req, status: "declined" as const } : req
      )
    )

    toast.success(`Follow request from @${request.requesterUsername} declined`)
  }

  const handleRemoveFollower = (followerId: string) => {
    const follower = followers?.find(f => f.id === followerId)
    if (!follower) return

    setFollowers((prev) => (prev || []).filter(f => f.id !== followerId))

    toast.success(`@${follower.username} removed from followers`)
  }

  const handleUnfollow = (userId: string) => {
    const user = following?.find(u => u.id === userId)
    if (!user) return

    setFollowing((prev) => (prev || []).filter(u => u.id !== userId))

    toast.success(`Unfollowed @${user.username}`)
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const then = new Date(timestamp)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <div className="w-full max-w-[600px] mx-auto">
      <Breadcrumb
        items={[
          { label: "Profile", onClick: () => window.location.hash = "" },
          { label: "Follower Management" }
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users size={32} weight="fill" className="text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Follower Management</h1>
        </div>
        <p className="text-muted-foreground">Manage who follows you and who you follow</p>
      </div>

      <Tabs defaultValue="followers" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="followers" className="gap-2">
            <Users size={16} weight="fill" />
            Followers
            {followers && followers.length > 0 && (
              <Badge className="ml-1 bg-muted text-foreground rounded-full px-2 py-0 text-xs">
                {followers.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="following" className="gap-2">
            <UserPlus size={16} weight="fill" />
            Following
            {following && following.length > 0 && (
              <Badge className="ml-1 bg-muted text-foreground rounded-full px-2 py-0 text-xs">
                {following.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="requests" className="gap-2">
            <Clock size={16} weight="fill" />
            Requests
            {pendingRequests.length > 0 && (
              <Badge className="ml-1 bg-coral text-primary-foreground rounded-full px-2 py-0 text-xs">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="followers" className="space-y-4">
          <div className="relative">
            <MagnifyingGlass
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search followers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredFollowers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Users size={80} className="text-muted-foreground mb-4" weight="thin" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchQuery ? "No followers found" : "No followers yet"}
              </h3>
              <p className="text-muted-foreground max-w-md">
                {searchQuery
                  ? "Try a different search term"
                  : "When people follow you, they'll appear here"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFollowers.map((follower) => (
                <Card key={follower.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <ShieldAvatar
                        src={follower.avatar}
                        alt={follower.username}
                        className="w-[44px] h-[52px]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground">
                          @{follower.username}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Following since {getTimeAgo(follower.followedAt)}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-coral hover:bg-coral/10 border-coral/50"
                      onClick={() => handleRemoveFollower(follower.id)}
                    >
                      <X size={16} className="mr-1" weight="bold" />
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="following" className="space-y-4">
          <div className="relative">
            <MagnifyingGlass
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search following..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredFollowing.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <UserPlus size={80} className="text-muted-foreground mb-4" weight="thin" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchQuery ? "No users found" : "Not following anyone yet"}
              </h3>
              <p className="text-muted-foreground max-w-md">
                {searchQuery
                  ? "Try a different search term"
                  : "Explore the feed to find creators to follow"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFollowing.map((user) => (
                <Card key={user.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <ShieldAvatar
                        src={user.avatar}
                        alt={user.username}
                        className="w-[44px] h-[52px]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground">
                          @{user.username}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Following since {getTimeAgo(user.followedAt)}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUnfollow(user.id)}
                    >
                      Unfollow
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Clock size={80} className="text-muted-foreground mb-4" weight="thin" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No pending requests
              </h3>
              <p className="text-muted-foreground max-w-md">
                When people want to follow you, their requests will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <Card key={request.id} className="p-4 border-peach/50 bg-peach/5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <ShieldAvatar
                        src={request.requesterAvatar}
                        alt={request.requesterUsername}
                        className="w-[44px] h-[52px] flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground">
                          @{request.requesterUsername}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Requested {getTimeAgo(request.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        className="bg-mint hover:bg-mint/80 text-foreground gap-1"
                        onClick={() => handleApproveRequest(request.id)}
                      >
                        <Check size={16} weight="bold" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-coral hover:bg-coral/10 border-coral/50 gap-1"
                        onClick={() => handleDeclineRequest(request.id)}
                      >
                        <X size={16} weight="bold" />
                        Decline
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Users size={16} className="text-primary" weight="fill" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-foreground font-medium mb-1">About Follower Management</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Approve or decline follow requests when your profile is set to "Followers Only"</li>
              <li>• Remove followers at any time to control who sees your content</li>
              <li>• Unfollow users you no longer want to see in your feed</li>
              <li>• Changes take effect immediately</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
