import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShieldAvatar } from "./ShieldAvatar"
import { 
  DotsThree, 
  Heart, 
  ChatCircle, 
  PaperPlaneTilt, 
  CaretLeft, 
  CaretRight,
  Sparkle
} from "@phosphor-icons/react"
import { formatDistanceToNow } from "date-fns"

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
    }>
    backgroundColor: string
  }>
  assetReferences: string[]
  title?: string
  publishedAt: string
  type: "VizEdit"
}

interface EditorialCardProps {
  editorial: Editorial
}

export function EditorialCard({ editorial }: EditorialCardProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(Math.floor(Math.random() * 500) + 50)

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

  const currentPage = editorial.pages[currentPageIndex]

  return (
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

      <div className="relative aspect-square bg-muted">
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

        {editorial.pages.length > 1 && (
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
  )
}
