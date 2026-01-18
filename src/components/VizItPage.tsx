import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Upload } from "@phosphor-icons/react"
import { ContentUploadFlow } from "./ContentUploadFlow"
import { useKV } from "@github/spark/hooks"
import { toast } from "sonner"

interface User {
  username: string
  email?: string
  phone?: string
  password: string
  vizBizId: string
  avatar: string
  createdAt: string
}

export function VizItPage() {
  const [currentUser] = useKV<User | null>("viz-current-user", null)
  const [selectedOption, setSelectedOption] = useState<"upload" | "vizlist" | null>(null)

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Sign In Required</h2>
        <p className="text-muted-foreground">
          Please sign in to create Viz. content
        </p>
      </div>
    )
  }

  if (selectedOption === "upload") {
    return <ContentUploadFlow onBack={() => setSelectedOption(null)} />
  }

  if (selectedOption === "vizlist") {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-foreground mb-2">From Viz.List</h2>
        <p className="text-muted-foreground mb-4">Edit content from your Viz.List</p>
        <button 
          onClick={() => setSelectedOption(null)}
          className="text-primary hover:underline"
        >
          ← Back to options
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[600px] mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Viz.It!</h1>
        <p className="text-muted-foreground text-lg">Create with the Viz.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card 
          className="cursor-pointer border-primary hover:bg-[#FFF0F3] transition-all duration-200 group"
          onClick={() => setSelectedOption("upload")}
        >
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4 min-h-[280px]">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Camera size={40} className="text-primary" weight="duotone" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-foreground">Take/Upload</h3>
              <p className="text-sm text-muted-foreground">
                Take or upload photos and videos
              </p>
              <p className="text-xs text-primary font-semibold">
                Want to be Viz.Listed?
              </p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer border-primary hover:bg-[#FFF0F3] transition-all duration-200 group"
          onClick={() => setSelectedOption("vizlist")}
        >
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4 min-h-[280px]">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Upload size={40} className="text-primary" weight="duotone" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-foreground">From Viz.List</h3>
              <p className="text-sm text-muted-foreground">
                Edit from your Viz.List
              </p>
              <p className="text-xs text-primary font-semibold">
                Viz.It with Your Favorites
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
