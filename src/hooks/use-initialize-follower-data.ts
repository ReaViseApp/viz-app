import { useEffect, useState } from "react"
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
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (initialized) return

    const init = async () => {
      const currentUsers = await window.spark.kv.get<any[]>("viz-users") || []
      
      if (currentUsers.length === 0) return
      
      const bijoufiUser = currentUsers.find((u: any) => u.username === "bijoufi")
      const bijoufanjournalUser = currentUsers.find((u: any) => u.username === "bijoufanjournal")
      
      if (!bijoufiUser || !bijoufanjournalUser) return

      const bijoufiFollowing = await window.spark.kv.get<Follower[]>("following-1234567890123456") || []
      const bijoufiFollowingBijoufanjournal = bijoufiFollowing.some(
        f => f.userId === bijoufanjournalUser.vizBizId
      )
      
      if (!bijoufiFollowingBijoufanjournal) {
        await window.spark.kv.set("following-1234567890123456", [
          ...bijoufiFollowing,
          {
            id: "follower-bijoufi-to-bijoufanjournal",
            userId: bijoufanjournalUser.vizBizId,
            username: "bijoufanjournal",
            avatar: editorLogo,
            followedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ])
      }

      const bijoufanjournalFollowers = await window.spark.kv.get<Follower[]>("followers-1234567890123457") || []
      const bijoufanjournalHasBijoufiFollower = bijoufanjournalFollowers.some(
        f => f.userId === bijoufiUser.vizBizId
      )
      
      if (!bijoufanjournalHasBijoufiFollower) {
        await window.spark.kv.set("followers-1234567890123457", [
          ...bijoufanjournalFollowers,
          {
            id: "follower-bijoufi-following-bijoufanjournal",
            userId: bijoufiUser.vizBizId,
            username: "bijoufi",
            avatar: bijoufiLogo,
            followedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ])
      }

      const bijoufanjournalFollowing = await window.spark.kv.get<Follower[]>("following-1234567890123457") || []
      const bijoufanjournalFollowingBijoufi = bijoufanjournalFollowing.some(
        f => f.userId === bijoufiUser.vizBizId
      )
      
      if (!bijoufanjournalFollowingBijoufi) {
        await window.spark.kv.set("following-1234567890123457", [
          ...bijoufanjournalFollowing,
          {
            id: "follower-bijoufanjournal-to-bijoufi",
            userId: bijoufiUser.vizBizId,
            username: "bijoufi",
            avatar: bijoufiLogo,
            followedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          }
        ])
      }

      const bijoufiFollowers = await window.spark.kv.get<Follower[]>("followers-1234567890123456") || []
      const bijoufiHasBijoufanjournalFollower = bijoufiFollowers.some(
        f => f.userId === bijoufanjournalUser.vizBizId
      )
      
      if (!bijoufiHasBijoufanjournalFollower) {
        await window.spark.kv.set("followers-1234567890123456", [
          ...bijoufiFollowers,
          {
            id: "follower-bijoufanjournal-following-bijoufi",
            userId: bijoufanjournalUser.vizBizId,
            username: "bijoufanjournal",
            avatar: editorLogo,
            followedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          }
        ])
      }

      setInitialized(true)
    }

    init()
  }, [initialized])
}
