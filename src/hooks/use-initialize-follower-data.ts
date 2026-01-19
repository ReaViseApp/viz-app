import { useEffect } from "react"
import { useKV } from "@github/spark/hooks"
import bijoufiLogo from "@/assets/images/bijoufi-logo.svg"
import editorLogo from "@/assets/images/editorlogo-badge.svg"

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
  const [users] = useKV<any[]>("viz-users", [])
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
  
  const [bijoufiFollowers, setBijoufiFollowers] = useKV<Follower[]>(
    "followers-1234567890123456",
    []
  )
  const [bijoufiFollowing, setBijoufiFollowing] = useKV<Follower[]>(
    "following-1234567890123456",
    []
  )
  const [bijoufanjournalFollowers, setBijoufanjournalFollowers] = useKV<Follower[]>(
    "followers-1234567890123457",
    []
  )
  const [bijoufanjournalFollowing, setBijoufanjournalFollowing] = useKV<Follower[]>(
    "following-1234567890123457",
    []
  )

  useEffect(() => {
    if (!users || users.length === 0) return
    
    const bijoufiUser = users.find((u: any) => u.username === "bijoufi")
    const bijoufanjournalUser = users.find((u: any) => u.username === "bijoufanjournal")
    
    if (!bijoufiUser || !bijoufanjournalUser) return

    const bijoufiFollowingBijoufanjournal = bijoufiFollowing?.some(
      f => f.userId === bijoufanjournalUser.vizBizId
    )
    
    if (!bijoufiFollowingBijoufanjournal) {
      const bijoufanjournalFollower: Follower = {
        id: "follower-bijoufi-to-bijoufanjournal",
        userId: bijoufanjournalUser.vizBizId,
        username: "bijoufanjournal",
        avatar: editorLogo,
        followedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
      
      setBijoufiFollowing((current) => [...(current || []), bijoufanjournalFollower])
    }

    const bijoufanjournalHasBijoufiFollower = bijoufanjournalFollowers?.some(
      f => f.userId === bijoufiUser.vizBizId
    )
    
    if (!bijoufanjournalHasBijoufiFollower) {
      const bijoufiAsFollower: Follower = {
        id: "follower-bijoufi-following-bijoufanjournal",
        userId: bijoufiUser.vizBizId,
        username: "bijoufi",
        avatar: bijoufiLogo,
        followedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
      
      setBijoufanjournalFollowers((current) => [...(current || []), bijoufiAsFollower])
    }

    const bijoufanjournalFollowingBijoufi = bijoufanjournalFollowing?.some(
      f => f.userId === bijoufiUser.vizBizId
    )
    
    if (!bijoufanjournalFollowingBijoufi) {
      const bijoufiFollower: Follower = {
        id: "follower-bijoufanjournal-to-bijoufi",
        userId: bijoufiUser.vizBizId,
        username: "bijoufi",
        avatar: bijoufiLogo,
        followedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
      
      setBijoufanjournalFollowing((current) => [...(current || []), bijoufiFollower])
    }

    const bijoufiHasBijoufanjournalFollower = bijoufiFollowers?.some(
      f => f.userId === bijoufanjournalUser.vizBizId
    )
    
    if (!bijoufiHasBijoufanjournalFollower) {
      const bijoufanjournalAsFollower: Follower = {
        id: "follower-bijoufanjournal-following-bijoufi",
        userId: bijoufanjournalUser.vizBizId,
        username: "bijoufanjournal",
        avatar: editorLogo,
        followedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
      
      setBijoufiFollowers((current) => [...(current || []), bijoufanjournalAsFollower])
    }
  }, [users, bijoufiFollowers, setBijoufiFollowers, bijoufiFollowing, setBijoufiFollowing, bijoufanjournalFollowers, setBijoufanjournalFollowers, bijoufanjournalFollowing, setBijoufanjournalFollowing])

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
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          status: "pending"
        },
        {
          id: "req-2",
          requesterId: "user-sample-2",
          requesterUsername: "minimalist_dreams",
          requesterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=minimalist",
          targetUserId: currentUser.id || currentUser.vizBizId,
          timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
          status: "pending"
        },
        {
          id: "req-3",
          requesterId: "user-sample-3",
          requesterUsername: "vintage_curator",
          requesterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=vintage",
          targetUserId: currentUser.id || currentUser.vizBizId,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: "pending"
        },
        {
          id: "req-4",
          requesterId: "user-sample-4",
          requesterUsername: "pastel_palette",
          requesterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pastel",
          targetUserId: currentUser.id || currentUser.vizBizId,
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          status: "pending"
        },
        {
          id: "req-5",
          requesterId: "user-sample-5",
          requesterUsername: "bold_creations",
          requesterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bold",
          targetUserId: currentUser.id || currentUser.vizBizId,
          timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
          status: "pending"
        },
        {
          id: "req-6",
          requesterId: "user-sample-6",
          requesterUsername: "modern_muse",
          requesterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=modern",
          targetUserId: currentUser.id || currentUser.vizBizId,
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: "pending"
        },
        {
          id: "req-7",
          requesterId: "user-sample-7",
          requesterUsername: "digital_artist",
          requesterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=digital",
          targetUserId: currentUser.id || currentUser.vizBizId,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: "pending"
        },
        {
          id: "req-8",
          requesterId: "user-sample-8",
          requesterUsername: "retro_revival",
          requesterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=retro",
          targetUserId: currentUser.id || currentUser.vizBizId,
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: "pending"
        },
        {
          id: "req-9",
          requesterId: "user-sample-9",
          requesterUsername: "neon_nights",
          requesterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=neon",
          targetUserId: currentUser.id || currentUser.vizBizId,
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          status: "pending"
        },
        {
          id: "req-10",
          requesterId: "user-sample-10",
          requesterUsername: "serene_spaces",
          requesterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=serene",
          targetUserId: currentUser.id || currentUser.vizBizId,
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: "pending"
        },
        {
          id: "req-11",
          requesterId: "user-sample-11",
          requesterUsername: "geometric_soul",
          requesterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=geometric",
          targetUserId: currentUser.id || currentUser.vizBizId,
          timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          status: "pending"
        },
        {
          id: "req-12",
          requesterId: "user-sample-12",
          requesterUsername: "soft_shadows",
          requesterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=soft",
          targetUserId: currentUser.id || currentUser.vizBizId,
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
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
          followedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "follower-2",
          userId: "user-follower-2",
          username: "design_lover",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=design",
          followedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "follower-3",
          userId: "user-follower-3",
          username: "creative_soul",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=creative",
          followedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "follower-4",
          userId: "user-follower-4",
          username: "pixel_perfect",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pixel",
          followedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "follower-5",
          userId: "user-follower-5",
          username: "color_burst",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=burst",
          followedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "follower-6",
          userId: "user-follower-6",
          username: "abstract_mind",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=abstract",
          followedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "follower-7",
          userId: "user-follower-7",
          username: "mood_boards",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mood",
          followedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "follower-8",
          userId: "user-follower-8",
          username: "sleek_designs",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sleek",
          followedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
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
          followedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "following-2",
          userId: "user-following-2",
          username: "color_theory",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=color",
          followedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "following-3",
          userId: "user-following-3",
          username: "visual_harmony",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=harmony",
          followedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "following-4",
          userId: "user-following-4",
          username: "aesthetic_feed",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=feed",
          followedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "following-5",
          userId: "user-following-5",
          username: "dreamy_edits",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dreamy",
          followedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "following-6",
          userId: "user-following-6",
          username: "sketch_daily",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sketch",
          followedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "following-7",
          userId: "user-following-7",
          username: "gradient_vibes",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=gradient",
          followedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "following-8",
          userId: "user-following-8",
          username: "urban_lens",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=urban",
          followedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "following-9",
          userId: "user-following-9",
          username: "pattern_play",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pattern",
          followedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "following-10",
          userId: "user-following-10",
          username: "texture_tales",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=texture",
          followedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]

      setFollowing(sampleFollowing)
    }
  }, [currentUser, followRequests, setFollowRequests, followers, setFollowers, following, setFollowing])
}
