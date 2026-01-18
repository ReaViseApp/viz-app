import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { CaretLeft, CaretRight, Sparkle } from "@phosphor-icons/react"
import { VizListItem, EditorialPage } from "./EditorialCreationFlow"
import { toast } from "sonner"
import confetti from "canvas-confetti"

interface PreviewPublishStepProps {
  pages: EditorialPage[]
  selectedItems: VizListItem[]
  onBack: () => void
}

interface Editorial {
  id: string
  authorId: string
  authorUsername: string
  authorAvatar: string
  pages: EditorialPage[]
  assetReferences: string[]
  title?: string
  publishedAt: string
  type: "VizEdit"
}

export function PreviewPublishStep({ pages, selectedItems, onBack }: PreviewPublishStepProps) {
  const [currentUser] = useKV<{ id?: string; username: string; avatar: string } | null>("viz-current-user", null)
  const [editorials, setEditorials] = useKV<Editorial[]>("viz-editorials", [])
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [title, setTitle] = useState("")
  const [isPublishing, setIsPublishing] = useState(false)

  const handlePrevPage = () => {
    setCurrentPageIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPageIndex((prev) => Math.min(pages.length - 1, prev + 1))
  }

  const handlePublish = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to publish")
      return
    }

    setIsPublishing(true)

    const newEditorial: Editorial = {
      id: `editorial-${Date.now()}`,
      authorId: currentUser.id || currentUser.username,
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      pages: pages,
      assetReferences: selectedItems.map((item) => item.id),
      title: title.trim() || undefined,
      publishedAt: new Date().toISOString(),
      type: "VizEdit"
    }

    setEditorials((current) => [newEditorial, ...(current || [])])

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFB6C1", "#FF69B4", "#FFC0CB", "#98D8AA", "#FFDAB3"]
    })

    await new Promise((resolve) => setTimeout(resolve, 500))

    toast.success("Your Viz.Edit is live!", {
      description: "Your editorial has been published to the feed"
    })

    setIsPublishing(false)

    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    window.location.reload()
  }

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkle size={24} weight="fill" className="text-primary" />
            Step 3 of 3: Preview & Publish
          </DialogTitle>
          <Progress value={100} className="h-2 mt-2" />
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          <div className="space-y-2">
            <Label htmlFor="editorial-title">Title (Optional)</Label>
            <Input
              id="editorial-title"
              placeholder="Give your editorial a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">
              {title.length}/100 characters
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Preview</Label>
              <div className="text-sm text-muted-foreground">
                Page {currentPageIndex + 1} of {pages.length}
              </div>
            </div>

            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <div
                className="w-full h-full"
                style={{
                  backgroundColor: pages[currentPageIndex].backgroundColor
                }}
              >
                {pages[currentPageIndex].canvasElements.map((element) => (
                  <div
                    key={element.id}
                    className="absolute"
                    style={{
                      left: element.x,
                      top: element.y,
                      width: element.width,
                      height: element.height,
                      transform: `rotate(${element.rotation}deg)`,
                      zIndex: element.zIndex
                    }}
                  >
                    {element.type === "image" && (
                      <img
                        src={element.data.src}
                        alt="Canvas element"
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                    {element.type === "text" && (
                      <div
                        className="w-full h-full flex items-center justify-center p-2"
                        style={{
                          fontSize: element.data.fontSize,
                          fontFamily: element.data.fontFamily,
                          color: element.data.color,
                          fontWeight: element.data.fontWeight
                        }}
                      >
                        {element.data.text}
                      </div>
                    )}
                    {element.type === "shape" && (
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundColor: element.data.fillColor,
                          border: `${element.data.strokeWidth}px solid ${element.data.strokeColor}`,
                          borderRadius: element.data.shapeType === "circle" ? "50%" : "0"
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {pages.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handlePrevPage}
                    disabled={currentPageIndex === 0}
                  >
                    <CaretLeft size={24} weight="bold" />
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleNextPage}
                    disabled={currentPageIndex === pages.length - 1}
                  >
                    <CaretRight size={24} weight="bold" />
                  </button>
                </>
              )}
            </div>

            <div className="flex justify-center gap-2">
              {pages.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentPageIndex 
                      ? "bg-primary w-6" 
                      : "bg-border hover:bg-border/70"
                  }`}
                  onClick={() => setCurrentPageIndex(index)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Assets Used</Label>
            <div className="flex flex-wrap gap-2">
              {selectedItems.map((item) => (
                <div
                  key={item.id}
                  className="relative w-16 h-16 rounded border border-border overflow-hidden"
                >
                  <img
                    src={item.contentThumbnail}
                    alt={`Asset by ${item.creatorUsername}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedItems.length} asset{selectedItems.length !== 1 ? "s" : ""} from your Viz.List
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-4 border-t border-border">
          <Button
            size="lg"
            className="w-full bg-primary hover:bg-accent text-primary-foreground"
            onClick={handlePublish}
            disabled={isPublishing}
          >
            {isPublishing ? (
              <>
                <Sparkle size={20} className="mr-2 animate-spin" weight="fill" />
                Publishing...
              </>
            ) : (
              <>
                <Sparkle size={20} className="mr-2" weight="fill" />
                Confirm Publish
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full text-muted-foreground hover:text-foreground"
            onClick={onBack}
            disabled={isPublishing}
          >
            Back to Edit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
