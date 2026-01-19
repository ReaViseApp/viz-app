import { useEffect } from "react"
import { useKV } from "@github/spark/hooks"

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
        avatar: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAPoCAYAAABNo9TkAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSogMABBAAMgCgDEoIAoCAYGAQwgAAGCAgCAgAGBAAAEIBBAEAIAHAQAIAMhAADAgICcgOiAKSCAIAKBIABAYABAkAAA",
        createdAt: new Date().toISOString(),
      }

      setUsers((current) => [...(current || []), bijoufiUser])
    }
  }, [users, setUsers])
}
