import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ShieldAvatar } from "./ShieldAvatar"
import { 
  DotsThree, 
  Heart, 
  ChatCircle, 
  PaperPlaneTilt, 
  CaretLeft, 
  CaretRight,
  Sparkle,
  X,
  ListChecks,
  Eye
} from "@phosphor-icons/react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Editorial {
  id: string
  authorId: string
  authorUsername: string
  authorAvatar: string
  pages: Array<{
    id: string
    canvasElements: Array<{
      id: string
      type: string
      x: number
      y: number
      width: number
      height: number
      rotation: number
      zIndex: number
      data: any
      isQuotedContent?: boolean
      originalContentId?: string
    }>
    backgroundColor: string
  }>
  assetReferences: string[]
  title?: string
  publishedAt: string
  type: "VizEdit"
  quotedContentCount?: number
}

interface EditorialCardProps {
  editorial: Editorial
}

export function EditorialCard({ editorial }: EditorialCardProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(Math.floor(Math.random() * 500) + 50)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [viewerPageIndex, setViewerPageIndex] = useState(0)
  const [selectedQuotedArea, setSelectedQuotedArea] = useState<string | null>(null)

  useEffect(() => {
    if (!isViewerOpen) {
      setViewerPageIndex(0)
      setSelectedQuotedArea(null)
    }
  }, [isViewerOpen])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isViewerOpen) return
      
      if (e.key === "ArrowLeft") {
        handleViewerPrevPage()
      } else if (e.key === "ArrowRight") {
        handleViewerNextPage()
      } else if (e.key === "Escape") {
        setIsViewerOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isViewerOpen, viewerPageIndex])

  const handleViewerPrevPage = () => {
    setViewerPageIndex((prev) => Math.max(0, prev - 1))
    setSelectedQuotedArea(null)
  }

  const handleViewerNextPage = () => {
    setViewerPageIndex((prev) => Math.min(editorial.pages.length - 1, prev + 1))
    setSelectedQuotedArea(null)
  }

  const handlePrevPage = () => {
    setCurrentPageIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPageIndex((prev) => Math.min(editorial.pages.length - 1, prev + 1))
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes((prev) => isLiked ? prev - 1 : prev + 1)
  }

  const handleQuotedAreaClick = (elementId: string) => {
    setSelectedQuotedArea(elementId)
  }

  const handleViewOriginal = () => {
    toast.success("Navigating to original content...")
    setIsViewerOpen(false)
  }

  const handleVizListQuoted = () => {
    toast.success("Added to your Viz.List!", {
      className: "bg-[#98D8AA] text-white"
    })
    setSelectedQuotedArea(null)
  }

  const currentPage = editorial.pages[currentPageIndex]
  const viewerCurrentPage = editorial.pages[viewerPageIndex]
  const quotedContentCount = editorial.quotedContentCount || editorial.assetReferences?.length || 0

  return (
    <>
      <Card className="w-full max-w-[470px] mx-auto overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAvatar 
              src={editorial.authorAvatar} 
              alt={editorial.authorUsername}
              size="small"
            />
            <div>
              <button className="font-semibold text-foreground hover:text-primary transition-colors">
                @{editorial.authorUsername}
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(editorial.publishedAt), { addSuffix: true })}
                </span>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs flex items-center gap-1">
                  <Sparkle size={12} weight="fill" />
                  VizEdit
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <DotsThree size={24} weight="bold" />
          </Button>
        </div>

        <div 
          className="relative aspect-square bg-muted cursor-pointer group"
          onClick={() => setIsViewerOpen(true)}
        >
          <div
            className="w-full h-full relative"
            style={{
              backgroundColor: currentPage.backgroundColor
            }}
          >
            {currentPage.canvasElements.map((element) => (
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
                    alt="Editorial element"
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

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Eye size={48} weight="fill" className="text-white drop-shadow-lg" />
            </div>
          </div>

          {editorial.pages.length > 1 && (
            <>
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrevPage()
                }}
                disabled={currentPageIndex === 0}
              >
                <CaretLeft size={24} weight="bold" />
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
                onClick={(e) => {
                  e.stopPropagation()
                  handleNextPage()
                }}
                disabled={currentPageIndex === editorial.pages.length - 1}
              >
                <CaretRight size={24} weight="bold" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {editorial.pages.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentPageIndex 
                        ? "bg-white w-6" 
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLike}
                className="hover:bg-transparent"
              >
                <Heart 
                  size={28} 
                  weight={isLiked ? "fill" : "regular"}
                  className={isLiked ? "text-[#FF6B6B]" : ""}
                />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-transparent">
                <ChatCircle size={28} />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-transparent">
                <PaperPlaneTilt size={28} />
              </Button>
            </div>
          </div>

          <p className="text-sm font-semibold">{likes} likes</p>

          {quotedContentCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {quotedContentCount} from Viz.Listings
            </p>
          )}

          {editorial.title && (
            <div>
              <span className="font-semibold text-foreground">
                @{editorial.authorUsername}{" "}
              </span>
              <span className="text-foreground">{editorial.title}</span>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            {new Date(editorial.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
        </div>
      </Card>

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full p-0 gap-0">
          <div className="relative w-full h-full bg-black/95 flex flex-col">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white"
              onClick={() => setIsViewerOpen(false)}
            >
              <X size={24} weight="bold" />
            </Button>

            <div className="flex-1 flex items-center justify-center p-8">
              <div className="relative max-w-[800px] max-h-[800px] w-full aspect-square">
                <div
                  className="w-full h-full relative rounded-lg overflow-hidden shadow-2xl"
                  style={{
                    backgroundColor: viewerCurrentPage.backgroundColor
                  }}
                >
                  {viewerCurrentPage.canvasElements.map((element) => {
                    const isQuoted = element.type === "image"
                    const isSelected = selectedQuotedArea === element.id

                    return (
                      <div
                        key={element.id}
                        className={cn(
                          "absolute",
                          isQuoted && "cursor-pointer"
                        )}
                        style={{
                          left: element.x,
                          top: element.y,
                          width: element.width,
                          height: element.height,
                          transform: `rotate(${element.rotation}deg)`,
                          zIndex: element.zIndex
                        }}
                        onClick={() => isQuoted && handleQuotedAreaClick(element.id)}
                      >
                        {element.type === "image" && (
                          <>
                            <img
                              src={element.data.src}
                              alt="Editorial element"
                              className="w-full h-full object-cover rounded"
                            />
                            <div className={cn(
                              "absolute inset-0 border-2 rounded pointer-events-none transition-all",
                              "border-primary/60",
                              isSelected && "border-primary shadow-[0_0_16px_rgba(255,182,193,0.8)]"
                            )} />
                          </>
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
                    )
                  })}
                </div>

                {editorial.pages.length > 1 && (
                  <>
                    <button
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleViewerPrevPage}
                      disabled={viewerPageIndex === 0}
                    >
                      <CaretLeft size={28} weight="bold" />
                    </button>
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleViewerNextPage}
                      disabled={viewerPageIndex === editorial.pages.length - 1}
                    >
                      <CaretRight size={28} weight="bold" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="py-6 flex justify-center gap-3">
              {editorial.pages.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    index === viewerPageIndex 
                      ? "bg-primary w-8" 
                      : "bg-white/50 hover:bg-white/70"
                  )}
                  onClick={() => {
                    setViewerPageIndex(index)
                    setSelectedQuotedArea(null)
                  }}
                />
              ))}
            </div>
          </div>

          {selectedQuotedArea && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-[0_0_24px_rgba(255,182,193,0.3)] p-4 flex gap-3 z-50">
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleViewOriginal}
              >
                View Original Reference
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-accent gap-2"
                onClick={handleVizListQuoted}
              >
                <ListChecks size={18} weight="bold" />
                Viz.List This
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
