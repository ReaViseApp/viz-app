import { useState, useEffect } from "react"
import { useKV } from "@github/spark/hooks"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Check } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { VizListItem } from "./EditorialCreationFlow"

interface SelectContentStepProps {
  onNext: (selectedItems: VizListItem[]) => void
  onBack: () => void
}

export function SelectContentStep({ onNext, onBack }: SelectContentStepProps) {
  const [vizList] = useKV<VizListItem[]>("viz-list-items", [])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const approvedItems = (vizList || []).filter((item) => item.status === "approved")

  const toggleSelection = (itemId: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const handleNext = () => {
    const selectedItems = approvedItems.filter((item) => selectedIds.has(item.id))
    onNext(selectedItems)
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-background border-b border-border p-6 sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Button>
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Step 1 of 3: Select From Viz.List
          </h1>
          
          <Progress value={33.33} className="h-2 mb-2" />
          <p className="text-sm text-muted-foreground">
            Choose approved items to use in your editorial
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto p-6">
          {approvedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No approved items in your Viz.List
              </h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Add approved content to your Viz.List to create editorials
              </p>
              <Button 
                className="bg-primary hover:bg-accent text-primary-foreground"
                onClick={onBack}
              >
                Back to options
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {approvedItems.map((item) => {
                const isSelected = selectedIds.has(item.id)
                
                return (
                  <Card
                    key={item.id}
                    className={cn(
                      "relative overflow-hidden cursor-pointer transition-all duration-200",
                      isSelected 
                        ? "border-primary border-2 ring-2 ring-primary/20 scale-[1.02]" 
                        : "hover:border-primary/50"
                    )}
                    onClick={() => toggleSelection(item.id)}
                  >
                    <div className="relative aspect-square">
                      <img
                        src={item.contentThumbnail}
                        alt={`Content by ${item.creatorUsername}`}
                        className="w-full h-full object-cover"
                      />
                      
                      <div
                        className="absolute border-2 border-primary/60 pointer-events-none"
                        style={{
                          left: `${item.selectionArea.left}%`,
                          top: `${item.selectionArea.top}%`,
                          width: `${item.selectionArea.width}%`,
                          height: `${item.selectionArea.height}%`,
                        }}
                      />

                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                          <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <Check size={20} weight="bold" className="text-primary-foreground" />
                          </div>
                        </div>
                      )}

                      <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md">
                        <span className="text-white text-xs font-semibold">
                          @{item.creatorUsername}
                        </span>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-background border-t border-border p-4 sticky bottom-0">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {selectedIds.size} item{selectedIds.size !== 1 ? "s" : ""} selected
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-accent text-primary-foreground"
            onClick={handleNext}
            disabled={selectedIds.size === 0}
          >
            Next
            <ArrowRight size={20} className="ml-2" weight="bold" />
          </Button>
        </div>
      </div>
    </div>
  )
}
