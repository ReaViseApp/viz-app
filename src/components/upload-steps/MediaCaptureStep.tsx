import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Upload } from "@phosphor-icons/react"
import { toast } from "sonner"
import type { MediaFile } from "../ContentUploadFlow"

interface MediaCaptureStepProps {
  onCapture: (media: MediaFile) => void
}

export function MediaCaptureStep({ onCapture }: MediaCaptureStepProps) {
  const [preview, setPreview] = useState<MediaFile | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const isVideo = file.type.startsWith("video/")
    const isImage = file.type.startsWith("image/")

    if (!isVideo && !isImage) {
      toast.error("Please upload an image or video file")
      return
    }

    if (isVideo && file.size > 100 * 1024 * 1024) {
      toast.error("Video file size must be less than 100MB")
      return
    }

    const url = URL.createObjectURL(file)
    const mediaFile: MediaFile = {
      url,
      type: isVideo ? "video" : "image",
      file
    }

    setPreview(mediaFile)
  }

  const handleCameraCapture = async () => {
    try {
      setIsCapturing(true)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" },
        audio: false 
      })

      const video = document.createElement("video")
      video.srcObject = stream
      video.play()

      await new Promise(resolve => {
        video.onloadedmetadata = resolve
      })

      const canvas = document.createElement("canvas")
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(video, 0, 0)

      stream.getTracks().forEach(track => track.stop())

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const file = new File([blob], "capture.jpg", { type: "image/jpeg" })
          setPreview({ url, type: "image", file })
        }
      }, "image/jpeg", 0.9)

      setIsCapturing(false)
    } catch (error) {
      console.error("Camera access error:", error)
      toast.error("Unable to access camera. Please try uploading instead.")
      setIsCapturing(false)
    }
  }

  const handleNext = () => {
    if (preview) {
      onCapture(preview)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Capture Your Content</h2>
        <p className="text-muted-foreground">Take a photo or upload from your device</p>
      </div>

      {!preview ? (
        <div className="grid md:grid-cols-2 gap-4">
          <Card 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={handleCameraCapture}
          >
            <CardContent className="flex flex-col items-center justify-center p-8 space-y-4 min-h-[200px]">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Camera size={32} className="text-primary" weight="duotone" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-foreground mb-1">Take Photo/Video</h3>
                <p className="text-sm text-muted-foreground">
                  Use your device camera
                </p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => {
              fileInputRef.current?.click()
            }}
          >
            <CardContent className="flex flex-col items-center justify-center p-8 space-y-4 min-h-[200px]">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload size={32} className="text-primary" weight="duotone" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-foreground mb-1">Upload from Device</h3>
                <p className="text-sm text-muted-foreground">
                  Select images or videos
                </p>
              </div>
            </CardContent>
          </Card>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/mov,video/webm"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden">
                {preview.type === "image" ? (
                  <img
                    src={preview.url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={preview.url}
                    controls
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setPreview(null)}
            >
              Change Media
            </Button>
            <Button
              onClick={handleNext}
              className="bg-primary text-primary-foreground hover:bg-accent"
            >
              Next: Add Selections
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
