import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ListChecks, X } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface SelectionArea {
  id: string
  left: number
  top: number
  width: number
  height: number
  type: "open" | "approval"
  thumbnail?: string
}

interface SelectionOverlayProps {
  imageUrl: string
  selections: SelectionArea[]
  authorUsername: string
  authorAvatar?: string
  contentId: string
  onAddToList?: (selectionId: string, selectionArea: SelectionArea) => void
  onRequestApproval?: (selectionId: string, selectionArea: SelectionArea) => void
}

export function SelectionOverlay({ 
  imageUrl, 
  selections, 
  authorUsername,
  authorAvatar,
  contentId,
  onAddToList,
  onRequestApproval 
}: SelectionOverlayProps) {
  const [openPopover, setOpenPopover] = useState<string | null>(null)

  const handleVizListClick = (selection: SelectionArea) => {
    if (selection.type === "open") {
      onAddToList?.(selection.id, selection)
      toast.success("Added to your Viz.List!", {
        className: "bg-[#98D8AA] text-white"
      })
    } else {
      onRequestApproval?.(selection.id, selection)
      toast.success(`Approval request sent to @${authorUsername}`, {
        className: "bg-[#FFDAB3] text-[#1A1A1A]"
      })
    }
    setOpenPopover(null)
  }

  return (
    <div className="relative w-full">
      <img src={imageUrl} alt="Post content" className="w-full h-auto rounded-lg" />
      
      {selections.map((selection) => (
        <Popover 
          key={selection.id} 
          open={openPopover === selection.id}
          onOpenChange={(open) => setOpenPopover(open ? selection.id : null)}
        >
          <PopoverTrigger asChild>
            <button
              className={cn(
                "absolute cursor-pointer border-2 rounded-md selection-overlay",
                selection.type === "open" 
                  ? "border-mint shadow-[0_0_12px_rgba(152,216,170,0.5)]" 
                  : "border-peach shadow-[0_0_12px_rgba(255,218,179,0.5)]"
              )}
              style={{
                left: `${selection.left}%`,
                top: `${selection.top}%`,
                width: `${selection.width}%`,
                height: `${selection.height}%`,
              }}
            />
          </PopoverTrigger>
          <PopoverContent 
            className="w-64 p-4" 
            side="top"
            align="center"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <Badge 
                  className={cn(
                    "text-xs font-semibold",
                    selection.type === "open" 
                      ? "bg-mint text-mint-foreground" 
                      : "bg-peach text-peach-foreground"
                  )}
                >
                  {selection.type === "open" ? "Open to Repost" : "Approval Required"}
                </Badge>
                <button 
                  onClick={() => setOpenPopover(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="relative w-full aspect-square bg-muted rounded-md overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt="Selection preview"
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: `${selection.left}% ${selection.top}%`,
                  }}
                />
              </div>
              
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-accent gap-2"
                onClick={() => handleVizListClick(selection)}
              >
                <ListChecks size={18} weight="bold" />
                Viz.List This
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setOpenPopover(null)}
              >
                Cancel
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  )
}
