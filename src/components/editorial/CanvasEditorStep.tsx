import { useState, useRef, useEffect, useCallback } from "react"
import * as fabric from 'fabric'
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
  PencilSimple,
  PaintBucket,
  Plus,
  FloppyDisk,
  Trash,
  Copy,
  ArrowCounterClockwise,
  ArrowClockwise,
  ArrowLineUp,
  ArrowUp,
  ArrowDown,
  ArrowLineDown,
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
import { applyCustomControls, alignObjects } from "@/lib/fabric-utils"

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
  const canvasId = 'editorial-canvas'
  const {
    canvas,
    isDrawingMode,
    addText,
    addShape,
    addImage,
    toggleDrawingMode,
    setBrushProperties,
    copy,
    paste,
    duplicate,
    deleteSelected
  } = useFabricCanvas(canvasId)

  const { saveState, undo, redo, canUndo, canRedo, initializeHistory } = useCanvasHistory(canvas)

  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF")
  const [brushColor, setBrushColor] = useState("#FF69B4")
  const [brushWidth, setBrushWidth] = useState(5)

  const currentPage = pages[currentPageIndex]

  // Initialize history and load page state
  useEffect(() => {
    if (!canvas) return

    initializeHistory()

    // Load page state if exists
    if (currentPage.canvasElements && currentPage.canvasElements.length > 0) {
      loadPageState()
    }

    // Set background color
    canvas.backgroundColor = currentPage.backgroundColor || '#FFFFFF'
    canvas.renderAll()
  }, [canvas])

  // Update canvas background when page background changes
  useEffect(() => {
    if (!canvas) return
    canvas.backgroundColor = currentPage.backgroundColor || '#FFFFFF'
    canvas.renderAll()
  }, [canvas, currentPage.backgroundColor])

  // Handle canvas modifications for history
  useEffect(() => {
    if (!canvas) return

    const handleObjectModified = () => {
      saveState()
      syncCanvasToPage()
    }

    const handleObjectAdded = () => {
      saveState()
      syncCanvasToPage()
    }

    const handleObjectRemoved = () => {
      saveState()
      syncCanvasToPage()
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

  // Keyboard shortcuts
  useEffect(() => {
    if (!canvas) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const isCtrlOrCmd = isMac ? e.metaKey : e.ctrlKey

      // Prevent default for all shortcuts
      if (isCtrlOrCmd || e.key === 'Delete' || e.key === 'Backspace') {
        const activeElement = document.activeElement
        const isTyping = activeElement?.tagName === 'INPUT' || 
                        activeElement?.tagName === 'TEXTAREA' ||
                        (activeElement as HTMLElement)?.contentEditable === 'true'
        
        if (isTyping) return
      }

      // Copy: Ctrl+C / Cmd+C
      if (isCtrlOrCmd && e.key === 'c') {
        e.preventDefault()
        copy()
        toast.success('Copied to clipboard')
      }

      // Paste: Ctrl+V / Cmd+V
      if (isCtrlOrCmd && e.key === 'v') {
        e.preventDefault()
        paste()
        toast.success('Pasted from clipboard')
      }

      // Duplicate: Ctrl+D / Cmd+D
      if (isCtrlOrCmd && e.key === 'd') {
        e.preventDefault()
        duplicate()
        toast.success('Object duplicated')
      }

      // Undo: Ctrl+Z / Cmd+Z
      if (isCtrlOrCmd && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }

      // Redo: Ctrl+Shift+Z / Cmd+Shift+Z
      if (isCtrlOrCmd && e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        redo()
      }

      // Delete: Delete or Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        deleteSelected()
        toast.success('Object deleted')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canvas, copy, paste, duplicate, deleteSelected, undo, redo])

  const syncCanvasToPage = useCallback(() => {
    if (!canvas) return

    const canvasJSON = canvas.toJSON()
    
    setPages((prev) => {
      const updated = [...prev]
      updated[currentPageIndex] = {
        ...updated[currentPageIndex],
        canvasElements: canvasJSON.objects || []
      }
      return updated
    })
  }, [canvas, currentPageIndex, setPages])

  const loadPageState = useCallback(async () => {
    if (!canvas || !currentPage.canvasElements) return

    try {
      await canvas.loadFromJSON({ objects: currentPage.canvasElements })
      canvas.renderAll()
    } catch (error) {
      console.error('Failed to load page state:', error)
    }
  }, [canvas, currentPage])

  const handleAddText = () => {
    addText()
    toast.success("Text box added")
  }

  const handleAddShape = (shapeType: 'rectangle' | 'circle' | 'triangle' | 'line') => {
    addShape(shapeType)
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

    if (canvas) {
      canvas.backgroundColor = color
      canvas.renderAll()
    }
  }

  const addNewPage = () => {
    syncCanvasToPage()
    
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

  const addAssetToCanvas = async (item: VizListItem) => {
    if (!canvas) return

    try {
      await addImage(item.contentThumbnail)
      toast.success("Asset added to canvas")
    } catch (error) {
      toast.error("Failed to load asset")
    }
  }

  const handleToggleDrawing = () => {
    toggleDrawingMode()
    toast.info(isDrawingMode ? "Drawing mode disabled" : "Drawing mode enabled")
  }

  const handleBrushColorChange = (color: string) => {
    setBrushColor(color)
    setBrushProperties(color, brushWidth)
  }

  const handleBrushWidthChange = (width: number) => {
    setBrushWidth(width)
    setBrushProperties(brushColor, width)
  }

  // Layer management
  const bringToFront = () => {
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (!activeObject) return
    canvas.bringToFront(activeObject)
    canvas.renderAll()
    saveState()
    toast.success("Brought to front")
  }

  const bringForward = () => {
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (!activeObject) return
    canvas.bringForward(activeObject)
    canvas.renderAll()
    saveState()
    toast.success("Brought forward")
  }

  const sendBackward = () => {
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (!activeObject) return
    canvas.sendBackwards(activeObject)
    canvas.renderAll()
    saveState()
    toast.success("Sent backward")
  }

  const sendToBack = () => {
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (!activeObject) return
    canvas.sendToBack(activeObject)
    canvas.renderAll()
    saveState()
    toast.success("Sent to back")
  }

  // Alignment
  const handleAlign = (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (!canvas) return
    alignObjects(canvas, alignment)
    saveState()
    toast.success(`Aligned ${alignment}`)
  }

  const handleSaveDraft = () => {
    syncCanvasToPage()
    toast.success("Draft saved!")
  }

  const handlePublish = () => {
    syncCanvasToPage()
    onPublish()
  }

  const hasActiveObject = canvas?.getActiveObject() !== undefined

  return (
    <TooltipProvider>
      <div className="w-full h-screen flex flex-col">
        {/* Header */}
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

              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={undo}
                      disabled={!canUndo}
                    >
                      <ArrowCounterClockwise size={20} weight="duotone" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={redo}
                      disabled={!canRedo}
                    >
                      <ArrowClockwise size={20} weight="duotone" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Toolbar */}
          <div className="w-20 bg-muted border-r border-border flex flex-col items-center gap-2 py-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-14 h-14"
                  onClick={handleAddText}
                >
                  <TextT size={24} weight="duotone" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Add Text</TooltipContent>
            </Tooltip>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-14 h-14"
                >
                  <Shapes size={24} weight="duotone" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="right" className="w-48">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddShape('rectangle')}
                  >
                    Rectangle
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddShape('circle')}
                  >
                    Circle
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddShape('triangle')}
                  >
                    Triangle
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddShape('line')}
                  >
                    Line
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={isDrawingMode ? "default" : "ghost"}
                  size="icon"
                  className={cn(
                    "w-14 h-14",
                    isDrawingMode && "bg-primary text-primary-foreground"
                  )}
                >
                  <PencilSimple size={24} weight="duotone" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="right" className="w-64">
                <div className="space-y-3">
                  <p className="text-sm font-semibold">Drawing Tool</p>
                  <Button
                    variant={isDrawingMode ? "default" : "outline"}
                    size="sm"
                    onClick={handleToggleDrawing}
                    className="w-full"
                  >
                    {isDrawingMode ? 'Exit Drawing Mode' : 'Enable Drawing Mode'}
                  </Button>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold">Brush Color</p>
                    <Input
                      type="color"
                      value={brushColor}
                      onChange={(e) => handleBrushColorChange(e.target.value)}
                      className="h-10 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold">Brush Width: {brushWidth}px</p>
                    <Input
                      type="range"
                      min="1"
                      max="20"
                      value={brushWidth}
                      onChange={(e) => handleBrushWidthChange(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>

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

            <div className="h-px bg-border w-12 my-2" />

            {/* Layer Controls */}
            {hasActiveObject && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-14 h-14"
                      onClick={bringToFront}
                    >
                      <ArrowLineUp size={24} weight="duotone" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Bring to Front</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-14 h-14"
                      onClick={bringForward}
                    >
                      <ArrowUp size={24} weight="duotone" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Bring Forward</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-14 h-14"
                      onClick={sendBackward}
                    >
                      <ArrowDown size={24} weight="duotone" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Send Backward</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-14 h-14"
                      onClick={sendToBack}
                    >
                      <ArrowLineDown size={24} weight="duotone" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Send to Back</TooltipContent>
                </Tooltip>

                <div className="h-px bg-border w-12 my-2" />

                {/* Alignment Controls */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-14 h-14"
                      onClick={() => handleAlign('left')}
                    >
                      <AlignLeft size={24} weight="duotone" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Align Left</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-14 h-14"
                      onClick={() => handleAlign('center')}
                    >
                      <AlignCenterHorizontal size={24} weight="duotone" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Align Center</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-14 h-14"
                      onClick={() => handleAlign('right')}
                    >
                      <AlignRight size={24} weight="duotone" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Align Right</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-14 h-14"
                      onClick={() => handleAlign('top')}
                    >
                      <AlignTop size={24} weight="duotone" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Align Top</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-14 h-14"
                      onClick={() => handleAlign('middle')}
                    >
                      <AlignCenterVertical size={24} weight="duotone" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Align Middle</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-14 h-14"
                      onClick={() => handleAlign('bottom')}
                    >
                      <AlignBottom size={24} weight="duotone" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Align Bottom</TooltipContent>
                </Tooltip>

                <div className="h-px bg-border w-12 my-2" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-14 h-14"
                      onClick={() => {
                        duplicate()
                        toast.success('Duplicated')
                      }}
                    >
                      <Copy size={24} weight="duotone" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Duplicate (Ctrl+D)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-14 h-14 text-destructive hover:text-destructive"
                      onClick={() => {
                        deleteSelected()
                        toast.success('Deleted')
                      }}
                    >
                      <Trash size={24} weight="duotone" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Delete (Delete/Backspace)</TooltipContent>
                </Tooltip>
              </>
            )}
          </div>

          {/* Canvas Area */}
          <div className="flex-1 bg-muted p-8 overflow-auto flex items-center justify-center">
            <canvas
              id={canvasId}
              className="shadow-2xl rounded-lg"
              style={{
                maxWidth: '100%',
                maxHeight: '100%'
              }}
            />
          </div>

          {/* Right Sidebar - Asset Library */}
          <div className="w-80 bg-background border-l border-border flex flex-col">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Your Viz.List</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Click to add items to canvas
              </p>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                {selectedItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No items selected.<br />Go back to select content.
                  </p>
                ) : (
                  selectedItems.map((item) => (
                    <Card
                      key={item.id}
                      className="relative overflow-hidden cursor-pointer hover:border-primary transition-all group"
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
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer - Page Management */}
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
                      onClick={() => {
                        syncCanvasToPage()
                        setCurrentPageIndex(index)
                      }}
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
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="flex-shrink-0 w-20 h-20 border-dashed"
                        onClick={addNewPage}
                      >
                        <Plus size={24} weight="bold" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add New Page</TooltipContent>
                  </Tooltip>
                </div>
              </ScrollArea>

              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleSaveDraft}
                    >
                      <FloppyDisk size={20} className="mr-2" weight="duotone" />
                      Save Draft
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save your work as a draft</TooltipContent>
                </Tooltip>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-accent text-primary-foreground"
                  onClick={handlePublish}
                >
                  Next: Preview & Publish
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
