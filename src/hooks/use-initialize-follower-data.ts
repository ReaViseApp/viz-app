import { useEffect } from "react"
import { useKV } from "@github/spark/hooks"

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

export function useInitializeFollowerData() {
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

  useEffect(() => {
    if (!currentUser) return

    if (followRequests && followRequests.length === 0) {
      const sampleRequests: FollowRequest[] = [
        {
          id: "req-1",
          requesterId: "user-sample-1",
          requesterUsername: "aestheticvibes",
          requesterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aestheticvibes",
          targetUserId: currentUser.id || currentUser.vizBizId,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: "pending"
        },
        {
          id: "req-2",
          requesterId: "user-sample-2",
          requesterUsername: "minimalist_dreams",
          requesterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=minimalist",
          targetUserId: currentUser.id || currentUser.vizBizId,
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          status: "pending"
        },
        {
          id: "req-3",
          requesterId: "user-sample-3",
          requesterUsername: "vintage_curator",
          requesterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=vintage",
          targetUserId: currentUser.id || currentUser.vizBizId,
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          status: "pending"
        },
        {
          id: "req-4",
          requesterId: "user-sample-4",
          requesterUsername: "pastel_palette",
          requesterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pastel",
          targetUserId: currentUser.id || currentUser.vizBizId,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: "pending"
        },
        {
          id: "req-5",
          requesterId: "user-sample-5",
          requesterUsername: "bold_creations",
          requesterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bold",
          targetUserId: currentUser.id || currentUser.vizBizId,
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: "pending"
        }
      ]

      setFollowRequests(sampleRequests)
    }

    if (followers && followers.length === 0) {
      const sampleFollowers: Follower[] = [
        {
          id: "follower-1",
          userId: "user-follower-1",
          username: "art_enthusiast",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=enthusiast",
          followedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "follower-2",
          userId: "user-follower-2",
          username: "design_lover",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=design",
          followedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "follower-3",
          userId: "user-follower-3",
          username: "creative_soul",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=creative",
          followedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]

      setFollowers(sampleFollowers)
    }

    if (following && following.length === 0) {
      const sampleFollowing: Follower[] = [
        {
          id: "following-1",
          userId: "user-following-1",
          username: "minimal_studio",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=studio",
          followedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "following-2",
          userId: "user-following-2",
          username: "color_theory",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=color",
          followedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "following-3",
          userId: "user-following-3",
          username: "visual_harmony",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=harmony",
          followedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "following-4",
          userId: "user-following-4",
          username: "aesthetic_feed",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=feed",
          followedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]

      setFollowing(sampleFollowing)
    }
  }, [currentUser, followRequests, setFollowRequests, followers, setFollowers, following, setFollowing])
}
