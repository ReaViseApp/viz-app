import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CaretLeft, CaretRight, Play, Pause, SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

export interface MediaItem {
  url: string
  type: "image" | "video"
}

interface MediaCarouselProps {
  media: MediaItem[]
  className?: string
  onDoubleTap?: () => void
}

export function MediaCarousel({ media, className, onDoubleTap }: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({})
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [lastTap, setLastTap] = useState(0)

  const currentMedia = media[currentIndex]
  const isVideo = currentMedia.type === "video"
  const hasMultiple = media.length > 1

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoElement = entry.target as HTMLVideoElement
          if (entry.isIntersecting) {
            videoElement.play().catch(() => {})
            setIsPlaying(true)
          } else {
            videoElement.pause()
            setIsPlaying(false)
          }
        })
      },
      { threshold: 0.5 }
    )

    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex]
    if (currentVideo && observerRef.current) {
      observerRef.current.observe(currentVideo)
      return () => {
        if (currentVideo && observerRef.current) {
          observerRef.current.unobserve(currentVideo)
        }
      }
    }
  }, [currentIndex])

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1))
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1))
  }

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation()
    const video = videoRefs.current[currentIndex]
    if (video) {
      if (isPlaying) {
        video.pause()
        setIsPlaying(false)
      } else {
        video.play()
        setIsPlaying(true)
      }
    }
  }

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    const video = videoRefs.current[currentIndex]
    if (video) {
      video.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleMediaClick = () => {
    const now = Date.now()
    const DOUBLE_TAP_DELAY = 300
    
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      onDoubleTap?.()
    }
    setLastTap(now)
  }

  return (
    <div className={cn("relative w-full bg-black", className)}>
      <div 
        className="relative w-full h-full flex items-center justify-center cursor-pointer"
        onClick={handleMediaClick}
      >
        {media.map((item, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-300",
              index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            {item.type === "image" ? (
              <img
                src={item.url}
                alt={`Media ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                ref={(el) => {
                  videoRefs.current[index] = el
                }}
                src={item.url}
                className="w-full h-full object-cover"
                loop
                muted={isMuted}
                playsInline
              />
            )}
          </div>
        ))}
      </div>

      {hasMultiple && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full h-8 w-8 z-10"
            onClick={handlePrevious}
          >
            <CaretLeft size={20} weight="bold" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full h-8 w-8 z-10"
            onClick={handleNext}
          >
            <CaretRight size={20} weight="bold" />
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {media.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex(index)
                }}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  index === currentIndex
                    ? "bg-white w-6"
                    : "bg-white/50 hover:bg-white/70"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {isVideo && (
        <div className="absolute bottom-4 right-4 flex gap-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/50 hover:bg-black/70 text-white rounded-full h-8 w-8"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <Pause size={16} weight="fill" />
            ) : (
              <Play size={16} weight="fill" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="bg-black/50 hover:bg-black/70 text-white rounded-full h-8 w-8"
            onClick={handleMuteToggle}
          >
            {isMuted ? (
              <SpeakerSlash size={16} weight="fill" />
            ) : (
              <SpeakerHigh size={16} weight="fill" />
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
