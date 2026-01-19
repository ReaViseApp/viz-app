import { useState, useRef, useEffect } from "react"
import * as fabric from "fabric"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
  Trash,
  ArrowCounterClockwise,
  ArrowClockwise,
  ArrowUp,
  ArrowDown,
  ArrowLineUp,
  ArrowLineDown,
  Copy,
  AlignLeft,
  AlignCenterHorizontal,
  AlignRight,
  AlignTop,
  AlignCenterVertical,
  AlignBottom
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { VizListItem, EditorialPage, CanvasElement } from "./EditorialCreationFlow"
import { toast } from "sonner"
import { useFabricCanvas } from "@/hooks/useFabricCanvas"
import { useCanvasHistory } from "@/hooks/useCanvasHistory"
import { serializeCanvas, deserializeCanvas, snapToAngle } from "@/lib/fabric-utils"

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
  const [isDrawingMode, setIsDrawingMode] = useState(false)
  const canvasElementRef = useRef<HTMLCanvasElement>(null)

  const { 
    canvas, 
    isReady, 
    addObject, 
    removeSelected, 
    setBackgroundColor,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    getActiveObject,
    getObjects,
    renderAll
  } = useFabricCanvas(canvasElementRef, {
    width: 600,
    height: 600,
    backgroundColor: pages[currentPageIndex]?.backgroundColor || '#FFFFFF',
  })

  const { saveState, undo, redo, canUndo, canRedo, clearHistory } = useCanvasHistory(canvas)

  const currentPage = pages[currentPageIndex]

  // Initialize canvas with saved state when ready or page changes
  useEffect(() => {
    if (!canvas || !isReady) return

    // Clear canvas
    canvas.clear()
    setBackgroundColor(currentPage.backgroundColor)
    
    // Save initial state
    setTimeout(() => saveState(), 100)
  }, [canvas, isReady, currentPageIndex])

  // Set up keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!canvas) return

      // Undo: Ctrl+Z / Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      
      // Redo: Ctrl+Shift+Z / Cmd+Shift+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        redo()
      }
      
      // Delete: Delete/Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isDrawingMode) {
        e.preventDefault()
        removeSelected()
        saveState()
      }
      
      // Copy: Ctrl+C / Cmd+C
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault()
        handleCopy()
      }
      
      // Paste: Ctrl+V / Cmd+V
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault()
        handlePaste()
      }
      
      // Duplicate: Ctrl+D / Cmd+D
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault()
        handleDuplicate()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canvas, undo, redo, isDrawingMode])

  // Handle object modifications
  useEffect(() => {
    if (!canvas) return

    const handleObjectModified = () => {
      saveState()
    }

    const handleObjectAdded = () => {
      saveState()
    }

    const handleObjectRemoved = () => {
      saveState()
    }

    canvas.on('object:modified', handleObjectModified)
    canvas.on('object:added', handleObjectAdded)
    canvas.on('object:removed', handleObjectRemoved)

    return () => {
      canvas.off('object:modified', handleObjectModified)
      canvas.off('object:added', handleObjectAdded)
      canvas.off('object:removed', handleObjectRemoved)
    }
  }, [canvas, saveState])

  // Handle rotation snapping
  useEffect(() => {
    if (!canvas) return

    const handleObjectRotating = (e: fabric.IEvent) => {
      if (!e.target) return
      
      const obj = e.target
      const currentAngle = obj.angle || 0
      
      // Check if Shift is pressed for snap to 15 degrees
      if (e.e && (e.e as any).shiftKey) {
        const snapped = snapToAngle(currentAngle, 15)
        obj.set({ angle: snapped })
      }
    }

    canvas.on('object:rotating', handleObjectRotating)
    
    return () => {
      canvas.off('object:rotating', handleObjectRotating)
    }
  }, [canvas])

  const addTextBox = () => {
    if (!canvas) return

    const text = new fabric.IText('Double click to edit', {
      left: 50,
      top: 50,
      fontSize: 24,
      fontFamily: 'Plus Jakarta Sans',
      fill: '#1A1A1A',
      fontWeight: 'normal',
    })

    addObject(text)
    canvas.setActiveObject(text)
    saveState()
    toast.success("Text box added")
  }

  const addShape = (shapeType: string) => {
    if (!canvas) return

    let shape: fabric.Object

    switch (shapeType) {
      case 'rectangle':
        shape = new fabric.Rect({
          left: 100,
          top: 100,
          width: 150,
          height: 150,
          fill: '#FFB6C1',
          stroke: '#FF69B4',
          strokeWidth: 2,
        })
        break
      case 'circle':
        shape = new fabric.Circle({
          left: 100,
          top: 100,
          radius: 75,
          fill: '#FFB6C1',
          stroke: '#FF69B4',
          strokeWidth: 2,
        })
        break
      case 'triangle':
        shape = new fabric.Triangle({
          left: 100,
          top: 100,
          width: 150,
          height: 150,
          fill: '#FFB6C1',
          stroke: '#FF69B4',
          strokeWidth: 2,
        })
        break
      case 'line':
        shape = new fabric.Line([100, 100, 250, 100], {
          stroke: '#FF69B4',
          strokeWidth: 3,
        })
        break
      default:
        return
    }

    addObject(shape)
    canvas.setActiveObject(shape)
    saveState()
    toast.success(`${shapeType} added`)
  }

  const updatePageBackground = (color: string) => {
    if (!canvas) return
    
    setBackgroundColor(color)
    setPages((prev) => {
      const updated = [...prev]
      updated[currentPageIndex] = {
        ...updated[currentPageIndex],
        backgroundColor: color
      }
      return updated
    })
    saveState()
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
    if (!canvas) return

    fabric.Image.fromURL(item.contentThumbnail, (img) => {
      img.set({
        left: 150,
        top: 150,
        scaleX: 200 / (img.width || 200),
        scaleY: 200 / (img.height || 200),
      })

      addObject(img)
      canvas.setActiveObject(img)
      saveState()
    })

    toast.success("Asset added to canvas")
  }

  const handleCopy = () => {
    const activeObj = getActiveObject()
    if (!activeObj) return

    activeObj.clone((cloned: fabric.Object) => {
      (window as any)._clipboard = cloned
    })
    toast.success("Copied to clipboard")
  }

  const handlePaste = () => {
    if (!canvas) return

    const clipboard = (window as any)._clipboard
    if (!clipboard) {
      toast.error("Nothing to paste")
      return
    }

    clipboard.clone((clonedObj: fabric.Object) => {
      clonedObj.set({
        left: (clonedObj.left || 0) + 10,
        top: (clonedObj.top || 0) + 10,
      })
      
      addObject(clonedObj)
      canvas.setActiveObject(clonedObj)
      saveState()
      toast.success("Pasted")
    })
  }

  const handleDuplicate = () => {
    const activeObj = getActiveObject()
    if (!activeObj || !canvas) return

    activeObj.clone((cloned: fabric.Object) => {
      cloned.set({
        left: (cloned.left || 0) + 10,
        top: (cloned.top || 0) + 10,
      })
      
      addObject(cloned)
      canvas.setActiveObject(cloned)
      saveState()
      toast.success("Duplicated")
    })
  }

  const handleAlign = (alignment: string) => {
    const activeObj = getActiveObject()
    if (!activeObj || !canvas) return

    const canvasWidth = canvas.getWidth()
    const canvasHeight = canvas.getHeight()
    const objWidth = (activeObj.width || 0) * (activeObj.scaleX || 1)
    const objHeight = (activeObj.height || 0) * (activeObj.scaleY || 1)

    switch (alignment) {
      case 'left':
        activeObj.set({ left: 0 })
        break
      case 'center':
        activeObj.set({ left: (canvasWidth - objWidth) / 2 })
        break
      case 'right':
        activeObj.set({ left: canvasWidth - objWidth })
        break
      case 'top':
        activeObj.set({ top: 0 })
        break
      case 'middle':
        activeObj.set({ top: (canvasHeight - objHeight) / 2 })
        break
      case 'bottom':
        activeObj.set({ top: canvasHeight - objHeight })
        break
    }

    activeObj.setCoords()
    canvas.renderAll()
    saveState()
  }

  const toggleDrawingMode = () => {
    if (!canvas) return

    const newMode = !isDrawingMode
    setIsDrawingMode(newMode)
    canvas.isDrawingMode = newMode

    if (newMode) {
      canvas.freeDrawingBrush.color = '#FFB6C1'
      canvas.freeDrawingBrush.width = 5
      toast.success("Drawing mode enabled")
    } else {
      toast.success("Drawing mode disabled")
    }
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
            variant={isDrawingMode ? "default" : "ghost"}
            size="icon"
            className={cn(
              "w-14 h-14",
              isDrawingMode && "bg-primary text-primary-foreground hover:bg-primary"
            )}
            onClick={() => {
              setActiveTool("draw")
              toggleDrawingMode()
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

          <div className="w-full h-px bg-border my-2" />

          {/* Undo/Redo */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-14 h-14"
                  onClick={undo}
                  disabled={!canUndo}
                >
                  <ArrowCounterClockwise size={24} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Undo (Ctrl+Z)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-14 h-14"
                  onClick={redo}
                  disabled={!canRedo}
                >
                  <ArrowClockwise size={24} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Redo (Ctrl+Shift+Z)</p>
              </TooltipContent>
            </Tooltip>

            {/* Layer controls */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-14 h-14"
                  onClick={bringToFront}
                  disabled={!getActiveObject()}
                >
                  <ArrowLineUp size={24} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Bring to Front</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-14 h-14"
                  onClick={bringForward}
                  disabled={!getActiveObject()}
                >
                  <ArrowUp size={24} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Bring Forward</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-14 h-14"
                  onClick={sendBackward}
                  disabled={!getActiveObject()}
                >
                  <ArrowDown size={24} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Send Backward</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-14 h-14"
                  onClick={sendToBack}
                  disabled={!getActiveObject()}
                >
                  <ArrowLineDown size={24} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Send to Back</p>
              </TooltipContent>
            </Tooltip>

            {/* Copy/Duplicate/Delete */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-14 h-14"
                  onClick={handleCopy}
                  disabled={!getActiveObject()}
                >
                  <Copy size={24} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Copy (Ctrl+C)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-14 h-14 text-destructive hover:text-destructive"
                  onClick={() => {
                    removeSelected()
                    saveState()
                  }}
                  disabled={!getActiveObject()}
                >
                  <Trash size={24} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Delete (Delete)</p>
              </TooltipContent>
            </Tooltip>

            {/* Alignment tools */}
            <div className="w-full h-px bg-border my-2" />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-14 h-14"
                  onClick={() => handleAlign('left')}
                  disabled={!getActiveObject()}
                >
                  <AlignLeft size={24} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Align Left</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-14 h-14"
                  onClick={() => handleAlign('center')}
                  disabled={!getActiveObject()}
                >
                  <AlignCenterHorizontal size={24} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Align Center</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-14 h-14"
                  onClick={() => handleAlign('right')}
                  disabled={!getActiveObject()}
                >
                  <AlignRight size={24} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Align Right</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-14 h-14"
                  onClick={() => handleAlign('top')}
                  disabled={!getActiveObject()}
                >
                  <AlignTop size={24} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Align Top</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-14 h-14"
                  onClick={() => handleAlign('middle')}
                  disabled={!getActiveObject()}
                >
                  <AlignCenterVertical size={24} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Align Middle</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-14 h-14"
                  onClick={() => handleAlign('bottom')}
                  disabled={!getActiveObject()}
                >
                  <AlignBottom size={24} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Align Bottom</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex-1 bg-muted p-8 overflow-auto flex items-center justify-center">
          <div className="relative">
            <canvas
              ref={canvasElementRef}
              className="shadow-2xl rounded-lg"
            />
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
