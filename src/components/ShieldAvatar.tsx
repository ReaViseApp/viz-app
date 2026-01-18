import { cn } from "@/lib/utils"

interface ShieldAvatarProps {
  src: string
  alt: string
  size?: "small" | "medium" | "large"
  className?: string
}

export function ShieldAvatar({ src, alt, size = "small", className }: ShieldAvatarProps) {
  const sizeClasses = {
    small: "w-8 h-[38px]",
    medium: "w-11 h-[52px]",
    large: "w-[120px] h-[140px]"
  }

  return (
    <div className={cn("shield-avatar relative border-2 border-primary overflow-hidden", sizeClasses[size], className)}>
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover"
      />
    </div>
  )
}
