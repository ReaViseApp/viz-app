import { useState, useRef, useEffect } from "react"
import * as fabric from "fabric"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "@phosphor-icons/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useFabricCanvas } from "@/hooks/useFabricCanvas"
import { useCanvasHistory } from "@/hooks/useCanvasHistory"
import { fabricObjectToSelection } from "@/lib/fabric-utils"
import { LassoToolbar, LassoTool } from "./SelectionTools/LassoToolbar"
import { FreehandLasso } from "./SelectionTools/FreehandLasso"
import { PolygonalLasso } from "./SelectionTools/PolygonalLasso"
import { MagneticLasso } from "./SelectionTools/MagneticLasso"
import type { MediaFile, Selection } from "../ContentUploadFlow"

interface SelectionToolStepProps {
  media: MediaFile
  onComplete: (selections: Selection[]) => void
  onBack: () => void
}

export function SelectionToolStep({ media, onComplete, onBack }: SelectionToolStepProps) {
  const [selections, setSelections] = useState<Selection[]>([])
  const [activeTool, setActiveTool] = useState<LassoTool>('freehand')
  const [selectionObjects, setSelectionObjects] = useState<Map<string, fabric.Object>>(new Map())
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const freehandLassoRef = useRef<FreehandLasso | null>(null)
  const polygonalLassoRef = useRef<PolygonalLasso | null>(null)
  const magneticLassoRef = useRef<MagneticLasso | null>(null)
  const backgroundImageRef = useRef<fabric.Image | null>(null)

  const { canvas, isReady, addObject, removeSelected, getActiveObject } = useFabricCanvas(canvasRef, {
    width: 800,
    height: 600,
  })

  const { saveState, undo, redo, canUndo, canRedo } = useCanvasHistory(canvas)

  // Initialize lasso tools when canvas is ready
  useEffect(() => {
    if (!canvas || !isReady) return

    freehandLassoRef.current = new FreehandLasso(canvas)
    polygonalLassoRef.current = new PolygonalLasso(canvas)
    magneticLassoRef.current = new MagneticLasso(canvas)

    // Load background image
    fabric.Image.fromURL(media.url, (img) => {
      const container = containerRef.current
      if (!container || !canvas) return

      const containerWidth = container.clientWidth
      const imgWidth = img.width || 800
      const imgHeight = img.height || 600
      const scale = Math.min(containerWidth / imgWidth, 600 / imgHeight)
      
      img.set({
        scaleX: scale,
        scaleY: scale,
        selectable: false,
        evented: false,
      })

      canvas.setWidth(img.getScaledWidth())
      canvas.setHeight(img.getScaledHeight())
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas))
      
      backgroundImageRef.current = img

      // Initialize magnetic lasso edge detection
      if (magneticLassoRef.current) {
        magneticLassoRef.current.initializeEdgeDetection()
      }

      saveState()
    })
  }, [canvas, isReady, media.url])

  // Handle mouse/touch events for lasso tools
  const handleCanvasMouseDown = (e: fabric.IEvent) => {
    if (!canvas) return

    const pointer = canvas.getPointer(e.e)
    
    if (activeTool === 'freehand' && freehandLassoRef.current) {
      canvas.selection = false
      canvas.forEachObject(obj => obj.set({ selectable: false }))
      freehandLassoRef.current.startDrawing(pointer)
    } else if (activeTool === 'polygonal' && polygonalLassoRef.current) {
      canvas.selection = false
      canvas.forEachObject(obj => obj.set({ selectable: false }))
      if (!polygonalLassoRef.current.isActive()) {
        polygonalLassoRef.current.startDrawing(pointer)
      } else {
        const shouldClose = polygonalLassoRef.current.addPoint(pointer)
        if (shouldClose) {
          finishPolygonalSelection()
        }
      }
    } else if (activeTool === 'magnetic' && magneticLassoRef.current) {
      canvas.selection = false
      canvas.forEachObject(obj => obj.set({ selectable: false }))
      if (!magneticLassoRef.current.isActive()) {
        magneticLassoRef.current.startDrawing(pointer)
      } else {
        const shouldClose = magneticLassoRef.current.addPoint(pointer)
        if (shouldClose) {
          finishMagneticSelection()
        }
      }
    }
  }

  const handleCanvasMouseMove = (e: fabric.IEvent) => {
    if (!canvas) return

    const pointer = canvas.getPointer(e.e)
    
    if (activeTool === 'freehand' && freehandLassoRef.current?.isActive()) {
      freehandLassoRef.current.continueDrawing(pointer)
    } else if (activeTool === 'polygonal' && polygonalLassoRef.current?.isActive()) {
      polygonalLassoRef.current.updatePreview(pointer)
    }
  }

  const handleCanvasMouseUp = () => {
    if (activeTool === 'freehand' && freehandLassoRef.current?.isActive()) {
      finishFreehandSelection()
    }
  }

  const finishFreehandSelection = () => {
    if (!freehandLassoRef.current || !canvas) return

    const polygon = freehandLassoRef.current.finishDrawing()
    if (polygon) {
      addSelectionPolygon(polygon)
    }
    
    // Re-enable selection
    canvas.selection = true
    canvas.forEachObject(obj => {
      if (obj !== backgroundImageRef.current) {
        obj.set({ selectable: true })
      }
    })
  }

  const finishPolygonalSelection = () => {
    if (!polygonalLassoRef.current || !canvas) return

    const polygon = polygonalLassoRef.current.finishDrawing()
    if (polygon) {
      addSelectionPolygon(polygon)
    }
    
    // Re-enable selection
    canvas.selection = true
    canvas.forEachObject(obj => {
      if (obj !== backgroundImageRef.current) {
        obj.set({ selectable: true })
      }
    })
  }

  const finishMagneticSelection = () => {
    if (!magneticLassoRef.current || !canvas) return

    const polygon = magneticLassoRef.current.finishDrawing()
    if (polygon) {
      addSelectionPolygon(polygon)
    }
    
    // Re-enable selection
    canvas.selection = true
    canvas.forEachObject(obj => {
      if (obj !== backgroundImageRef.current) {
        obj.set({ selectable: true })
      }
    })
  }

  const addSelectionPolygon = (polygon: fabric.Polygon) => {
    if (!canvas) return

    const id = `sel-${Date.now()}`
    polygon.set({ id } as any)
    
    addObject(polygon)
    
    const selection = fabricObjectToSelection(polygon, id, 'open')
    setSelections(prev => [...prev, selection])
    setSelectionObjects(prev => new Map(prev).set(id, polygon))
    
    saveState()
    toast.success("Selection created")
  }

  // Set up canvas event listeners
  useEffect(() => {
    if (!canvas) return

    canvas.on('mouse:down', handleCanvasMouseDown)
    canvas.on('mouse:move', handleCanvasMouseMove)
    canvas.on('mouse:up', handleCanvasMouseUp)

    return () => {
      canvas.off('mouse:down', handleCanvasMouseDown)
      canvas.off('mouse:move', handleCanvasMouseMove)
      canvas.off('mouse:up', handleCanvasMouseUp)
    }
  }, [canvas, activeTool])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
      
      // Escape: Cancel current selection
      if (e.key === 'Escape') {
        if (freehandLassoRef.current?.isActive()) {
          freehandLassoRef.current.cancel()
        }
        if (polygonalLassoRef.current?.isActive()) {
          polygonalLassoRef.current.cancel()
        }
        if (magneticLassoRef.current?.isActive()) {
          magneticLassoRef.current.cancel()
        }
        if (canvas) {
          canvas.selection = true
          canvas.forEachObject(obj => {
            if (obj !== backgroundImageRef.current) {
              obj.set({ selectable: true })
            }
          })
        }
      }
      
      // Backspace/Delete: Remove last point in polygonal or remove selected object
      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault()
        if (polygonalLassoRef.current?.isActive()) {
          polygonalLassoRef.current.removeLastPoint()
        } else {
          handleDeleteSelected()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canvas, undo, redo])

  const handleDeleteSelection = (id: string) => {
    const obj = selectionObjects.get(id)
    if (obj && canvas) {
      canvas.remove(obj)
      setSelections(prev => prev.filter(s => s.id !== id))
      setSelectionObjects(prev => {
        const newMap = new Map(prev)
        newMap.delete(id)
        return newMap
      })
      saveState()
      toast.success("Selection deleted")
    }
  }

  const handleDeleteSelected = () => {
    const activeObj = getActiveObject()
    if (activeObj) {
      const id = (activeObj as any).id
      if (id) {
        handleDeleteSelection(id)
      }
    }
  }

  const handleTypeChange = (id: string, type: "open" | "approval") => {
    setSelections(prev =>
      prev.map(s => (s.id === id ? { ...s, type } : s))
    )
    
    const obj = selectionObjects.get(id)
    if (obj) {
      const color = type === "open" ? "#98D8AA" : "#FFDAB3"
      const fillColor = type === "open" ? "rgba(152, 216, 170, 0.3)" : "rgba(255, 218, 179, 0.3)"
      obj.set({
        stroke: color,
        fill: fillColor,
      })
      canvas?.renderAll()
      saveState()
    }
  }

  const handleToolChange = (tool: LassoTool) => {
    // Cancel any active drawing
    if (freehandLassoRef.current?.isActive()) {
      freehandLassoRef.current.cancel()
    }
    if (polygonalLassoRef.current?.isActive()) {
      polygonalLassoRef.current.cancel()
    }
    if (magneticLassoRef.current?.isActive()) {
      magneticLassoRef.current.cancel()
    }
    
    setActiveTool(tool)
    
    if (canvas) {
      canvas.selection = true
      canvas.forEachObject(obj => {
        if (obj !== backgroundImageRef.current) {
          obj.set({ selectable: true })
        }
      })
    }
  }

  const handleComplete = () => {
    if (selections.length === 0) {
      toast.error("Please draw at least one selection area")
      return
    }
    onComplete(selections)
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Draw Your Selections</h2>
        <p className="text-muted-foreground">Use the lasso tools to select areas you want to make Viz.Listed</p>
      </div>

      <div className="flex justify-center">
        <LassoToolbar
          activeTool={activeTool}
          onToolChange={handleToolChange}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          onDeleteSelection={handleDeleteSelected}
          hasSelection={!!getActiveObject()}
        />
      </div>

      <Card>
        <CardContent className="p-4">
          <div ref={containerRef} className="relative w-full flex justify-center">
            <canvas
              ref={canvasRef}
              className="border border-border rounded-lg"
              style={{ 
                cursor: activeTool === 'freehand' ? 'crosshair' : 
                        activeTool === 'polygonal' ? 'crosshair' : 
                        activeTool === 'magnetic' ? 'crosshair' : 'default' 
              }}
            />
          </div>
        </CardContent>
      </Card>

      {selections.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Your Selections</h3>
          {selections.map((selection, index) => (
            <Card key={selection.id} className={cn(
              "border-2",
              selection.type === "open" ? "border-mint" : "border-peach"
            )}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">Selection {index + 1}</span>
                    </div>
                    <Select
                      value={selection.type}
                      onValueChange={(value) => handleTypeChange(selection.id, value as "open" | "approval")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">
                          <span className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-mint"></span>
                            Open for Reference & Repost
                          </span>
                        </SelectItem>
                        <SelectItem value="approval">
                          <span className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-peach"></span>
                            Approval Required
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSelection(selection.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X size={20} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleComplete}
          disabled={selections.length === 0}
          className="bg-primary text-primary-foreground hover:bg-accent"
        >
          Next: Add Details
        </Button>
      </div>
    </div>
  )
}
