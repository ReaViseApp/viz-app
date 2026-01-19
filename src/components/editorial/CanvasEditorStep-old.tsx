import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  TextT,
  Shapes,
  Smiley,
  PencilSimple,
  PaintBucket,
  Plus,
  FloppyDisk,
  ArrowsClockwise,
  Trash
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { VizListItem, EditorialPage, CanvasElement } from "./EditorialCreationFlow"
import { toast } from "sonner"

interface CanvasEditorStepProps {
  selectedItems: VizListItem[]
  pages: EditorialPage[]
  setPages: (pages: EditorialPage[] | ((prev: EditorialPage[]) => EditorialPage[])) => void
  currentPageIndex: number
  setCurrentPageIndex: (index: number) => void
  onBack: () => void
  onPublish: () => void
}

export function CanvasEditorStep({
  selectedItems,
  pages,
  setPages,
  currentPageIndex,
  setCurrentPageIndex,
  onBack,
  onPublish
}: CanvasEditorStepProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF")
  const canvasRef = useRef<HTMLDivElement>(null)

  const currentPage = pages[currentPageIndex]

  const addTextBox = () => {
    const newElement: CanvasElement = {
      id: `text-${Date.now()}`,
      type: "text",
      x: 50,
      y: 50,
      width: 200,
      height: 50,
      rotation: 0,
      zIndex: currentPage.canvasElements.length,
      data: {
        text: "Double click to edit",
        fontSize: 24,
        fontFamily: "Plus Jakarta Sans",
        color: "#1A1A1A",
        fontWeight: "normal"
      }
    }

    setPages((prev) => {
      const updated = [...prev]
      updated[currentPageIndex] = {
        ...updated[currentPageIndex],
        canvasElements: [...updated[currentPageIndex].canvasElements, newElement]
      }
      return updated
    })
    
    toast.success("Text box added")
  }

  const addShape = (shapeType: string) => {
    const newElement: CanvasElement = {
      id: `shape-${Date.now()}`,
      type: "shape",
      x: 100,
      y: 100,
      width: 150,
      height: 150,
      rotation: 0,
      zIndex: currentPage.canvasElements.length,
      data: {
        shapeType,
        fillColor: "#FFB6C1",
        strokeColor: "#FF69B4",
        strokeWidth: 2
      }
    }

    setPages((prev) => {
      const updated = [...prev]
      updated[currentPageIndex] = {
        ...updated[currentPageIndex],
        canvasElements: [...updated[currentPageIndex].canvasElements, newElement]
      }
      return updated
    })
    
    toast.success(`${shapeType} added`)
  }

  const updatePageBackground = (color: string) => {
    setBackgroundColor(color)
    setPages((prev) => {
      const updated = [...prev]
      updated[currentPageIndex] = {
        ...updated[currentPageIndex],
        backgroundColor: color
      }
      return updated
    })
  }

  const addNewPage = () => {
    const newPage: EditorialPage = {
      id: `page-${Date.now()}`,
      canvasElements: [],
      backgroundColor: "#FFFFFF"
    }
    setPages((prev) => [...prev, newPage])
    setCurrentPageIndex(pages.length)
    toast.success("New page added")
  }

  const deletePage = (index: number) => {
    if (pages.length === 1) {
      toast.error("Cannot delete the only page")
      return
    }
    
    setPages((prev) => prev.filter((_, i) => i !== index))
    if (currentPageIndex >= index && currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1)
    }
    toast.success("Page deleted")
  }

  const addAssetToCanvas = (item: VizListItem) => {
    const newElement: CanvasElement = {
      id: `asset-${Date.now()}`,
      type: "image",
      x: 150,
      y: 150,
      width: 200,
      height: 200,
      rotation: 0,
      zIndex: currentPage.canvasElements.length,
      data: {
        src: item.contentThumbnail,
        selectionArea: item.selectionArea,
        originalItemId: item.id
      }
    }

    setPages((prev) => {
      const updated = [...prev]
      updated[currentPageIndex] = {
        ...updated[currentPageIndex],
        canvasElements: [...updated[currentPageIndex].canvasElements, newElement]
      }
      return updated
    })

    toast.success("Asset added to canvas")
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="bg-background border-b border-border p-4">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Button>

            <div className="flex-1 max-w-md mx-8">
              <h1 className="text-xl font-bold text-foreground mb-2 text-center">
                Step 2 of 3: Viz.Edit
              </h1>
              <Progress value={66.66} className="h-2" />
            </div>

            <div className="text-sm text-muted-foreground">
              Page {currentPageIndex + 1} of {pages.length}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-20 bg-muted border-r border-border flex flex-col items-center gap-2 py-4">
          <Button
            variant={activeTool === "text" ? "default" : "ghost"}
            size="icon"
            className={cn(
              "w-14 h-14",
              activeTool === "text" && "bg-primary text-primary-foreground hover:bg-primary"
            )}
            onClick={() => {
              setActiveTool("text")
              addTextBox()
            }}
          >
            <TextT size={24} weight="duotone" />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={activeTool === "shapes" ? "default" : "ghost"}
                size="icon"
                className={cn(
                  "w-14 h-14",
                  activeTool === "shapes" && "bg-primary text-primary-foreground hover:bg-primary"
                )}
              >
                <Shapes size={24} weight="duotone" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="right" className="w-48">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveTool("shapes")
                    addShape("rectangle")
                  }}
                >
                  Rectangle
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveTool("shapes")
                    addShape("circle")
                  }}
                >
                  Circle
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveTool("shapes")
                    addShape("triangle")
                  }}
                >
                  Triangle
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveTool("shapes")
                    addShape("line")
                  }}
                >
                  Line
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant={activeTool === "emoji" ? "default" : "ghost"}
            size="icon"
            className={cn(
              "w-14 h-14",
              activeTool === "emoji" && "bg-primary text-primary-foreground hover:bg-primary"
            )}
            onClick={() => {
              setActiveTool("emoji")
              toast.info("Emoji picker coming soon")
            }}
          >
            <Smiley size={24} weight="duotone" />
          </Button>

          <Button
            variant={activeTool === "draw" ? "default" : "ghost"}
            size="icon"
            className={cn(
              "w-14 h-14",
              activeTool === "draw" && "bg-primary text-primary-foreground hover:bg-primary"
            )}
            onClick={() => {
              setActiveTool("draw")
              toast.info("Drawing mode coming soon")
            }}
          >
            <PencilSimple size={24} weight="duotone" />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-14 h-14"
              >
                <PaintBucket size={24} weight="duotone" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="right" className="w-64">
              <div className="space-y-3">
                <p className="text-sm font-semibold">Background Color</p>
                <Input
                  type="color"
                  value={currentPage.backgroundColor}
                  onChange={(e) => updatePageBackground(e.target.value)}
                  className="h-12 cursor-pointer"
                />
                <div className="grid grid-cols-5 gap-2">
                  {["#FFFFFF", "#FFF0F3", "#FFB6C1", "#98D8AA", "#FFDAB3"].map((color) => (
                    <button
                      key={color}
                      className="w-full aspect-square rounded border-2 border-border hover:border-primary transition-colors"
                      style={{ backgroundColor: color }}
                      onClick={() => updatePageBackground(color)}
                    />
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex-1 bg-muted p-8 overflow-auto flex items-center justify-center">
          <div
            ref={canvasRef}
            className="relative bg-white shadow-2xl rounded-lg"
            style={{
              width: "600px",
              height: "600px",
              backgroundColor: currentPage.backgroundColor,
              backgroundImage: `
                linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px"
            }}
          >
            {currentPage.canvasElements.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                Drag assets here or use tools to start creating
              </div>
            ) : (
              currentPage.canvasElements.map((element) => (
                <div
                  key={element.id}
                  className="absolute border border-dashed border-primary/50 rounded cursor-move hover:border-primary transition-colors"
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
                      draggable={false}
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
              ))
            )}
          </div>
        </div>

        <div className="w-80 bg-background border-l border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Your Viz.List</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Drag items onto the canvas
            </p>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {selectedItems.map((item) => (
                <Card
                  key={item.id}
                  className="relative overflow-hidden cursor-grab active:cursor-grabbing hover:border-primary transition-all group"
                  onClick={() => addAssetToCanvas(item)}
                >
                  <div className="relative aspect-square">
                    <img
                      src={item.contentThumbnail}
                      alt={`Asset by ${item.creatorUsername}`}
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
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white text-sm font-semibold">Click to add</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="bg-background border-t border-border p-4">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex items-center justify-between gap-4">
            <ScrollArea className="flex-1 max-w-3xl">
              <div className="flex items-center gap-3">
                {pages.map((page, index) => (
                  <div
                    key={page.id}
                    className={cn(
                      "relative flex-shrink-0 w-20 h-20 border-2 rounded cursor-pointer hover:border-primary transition-all group",
                      currentPageIndex === index ? "border-primary ring-2 ring-primary/20" : "border-border"
                    )}
                    onClick={() => setCurrentPageIndex(index)}
                  >
                    <div
                      className="w-full h-full rounded"
                      style={{ backgroundColor: page.backgroundColor }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-muted-foreground">
                      {index + 1}
                    </div>
                    {pages.length > 1 && (
                      <button
                        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation()
                          deletePage(index)
                        }}
                      >
                        <Trash size={14} weight="bold" />
                      </button>
                    )}
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0 w-20 h-20 border-dashed"
                  onClick={addNewPage}
                >
                  <Plus size={24} weight="bold" />
                </Button>
              </div>
            </ScrollArea>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="lg"
                onClick={() => toast.success("Draft saved!")}
              >
                <FloppyDisk size={20} className="mr-2" weight="duotone" />
                Save Draft
              </Button>
              <Button
                size="lg"
                className="bg-primary hover:bg-accent text-primary-foreground"
                onClick={onPublish}
              >
                Publish
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
