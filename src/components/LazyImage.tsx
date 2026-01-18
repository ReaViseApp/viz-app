import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  aspectRatio?: string
  onLoad?: () => void
}

export function LazyImage({ src, alt, className, aspectRatio = "1/1", onLoad }: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    setHasError(false)
  }, [src])

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  return (
    <div className={cn("relative overflow-hidden", className)} style={{ aspectRatio }}>
      {isLoading && (
        <Skeleton className="absolute inset-0 animate-shimmer" />
      )}
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
          Failed to load image
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
        />
      )}
    </div>
  )
}
