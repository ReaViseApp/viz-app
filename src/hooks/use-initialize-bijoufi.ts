import { useEffect } from "react"
import { useKV } from "@github/spark/hooks"
import bijoufiLogo from "@/assets/images/bijoufi-logo.svg"

interface User {
  username: string
  email?: string
  phone?: string
  password: string
  vizBizId: string
  avatar: string
  createdAt: string
}

export function useInitializeBijoufi() {
  const [users, setUsers] = useKV<User[]>("viz-users", [])

  useEffect(() => {
    if (!users) return

    const bijoufiExists = users.some(u => u.username === "bijoufi")
    
    if (!bijoufiExists) {
      const bijoufiUser: User = {
        username: "bijoufi",
        email: "bijoufi@viz.app",
        password: "bijoufi123",
        vizBizId: "1234567890123456",
        avatar: bijoufiLogo,
        createdAt: new Date().toISOString(),
      }

      setUsers((current) => [...(current || []), bijoufiUser])
    } else {
      setUsers((current) =>
        (current || []).map(user =>
          user.username === "bijoufi"
            ? { ...user, avatar: bijoufiLogo }
            : user
        )
      )
    }
  }, [users, setUsers])
}
