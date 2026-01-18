import { useState, useRef } from "react"
import { useKV } from "@github/spark/hooks"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ShieldAvatar } from "@/components/ShieldAvatar"
import { Camera, X, Check } from "@phosphor-icons/react"
import { toast } from "sonner"

interface EditProfileModalProps {
  open: boolean
  onClose: () => void
}

export function EditProfileModal({ open, onClose }: EditProfileModalProps) {
  const [currentUser, setCurrentUser] = useKV<{
    id?: string
    username: string
    avatar: string
    vizBizId?: string
    bio?: string
    followers?: number
    following?: number
  } | null>("viz-current-user", null)

  const [username, setUsername] = useState(currentUser?.username || "")
  const [bio, setBio] = useState(currentUser?.bio || "")
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || "")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB")
      return
    }

    setIsUploading(true)
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const result = e.target?.result as string
      setAvatarPreview(result)
      setIsUploading(false)
      toast.success("Avatar preview updated!")
    }

    reader.onerror = () => {
      toast.error("Failed to read image file")
      setIsUploading(false)
    }

    reader.readAsDataURL(file)
  }

  const handleRemoveAvatar = () => {
    setAvatarPreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    toast.success("Avatar removed")
  }

  const handleSave = () => {
    if (!username.trim()) {
      toast.error("Username is required")
      return
    }

    if (username.trim().length < 3) {
      toast.error("Username must be at least 3 characters")
      return
    }

    if (bio.length > 500) {
      toast.error("Bio must be 500 characters or less")
      return
    }

    setCurrentUser((prev) => {
      if (!prev) return null
      return {
        ...prev,
        username: username.trim(),
        bio: bio.trim(),
        avatar: avatarPreview || prev.avatar,
      }
    })

    toast.success("Profile updated successfully!", {
      icon: <Check size={20} weight="bold" className="text-mint" />,
    })
    onClose()
  }

  const handleCancel = () => {
    setUsername(currentUser?.username || "")
    setBio(currentUser?.bio || "")
    setAvatarPreview(currentUser?.avatar || "")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Edit Profile
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update your profile information and avatar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <ShieldAvatar
                src={avatarPreview}
                alt={username}
                className="w-[120px] h-[140px]"
              />
              <button
                onClick={handleAvatarClick}
                disabled={isUploading}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                style={{
                  clipPath: "polygon(50% 0%, 85% 10%, 100% 35%, 100% 70%, 50% 100%, 0% 70%, 0% 35%, 15% 10%)"
                }}
              >
                <Camera size={32} weight="bold" className="text-white" />
              </button>
              {avatarPreview && (
                <button
                  onClick={handleRemoveAvatar}
                  className="absolute -top-2 -right-2 bg-coral text-white rounded-full p-1.5 hover:bg-coral/90 transition-colors shadow-lg"
                >
                  <X size={16} weight="bold" />
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAvatarClick}
                disabled={isUploading}
                className="gap-2"
              >
                <Camera size={16} weight="bold" />
                {isUploading ? "Uploading..." : "Change Avatar"}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-semibold">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              maxLength={30}
              className="focus:border-primary"
            />
            <p className="text-xs text-muted-foreground">
              {username.length}/30 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-semibold">
              Bio
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              maxLength={500}
              className="resize-none focus:border-primary"
            />
            <p className="text-xs text-muted-foreground">
              {bio.length}/500 characters
            </p>
          </div>

          {currentUser?.vizBizId && (
            <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
              <Label className="text-sm font-semibold text-muted-foreground">
                Viz. Biz ID
              </Label>
              <p className="text-sm font-mono text-foreground select-all">
                {currentUser.vizBizId}
              </p>
              <p className="text-xs text-muted-foreground">
                Your unique seller ID (cannot be changed)
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isUploading}
            className="flex-1 bg-primary hover:bg-accent text-primary-foreground"
          >
            <Check size={16} weight="bold" className="mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
