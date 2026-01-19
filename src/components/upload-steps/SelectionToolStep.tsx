import { useState, useRef, useEffect, useCallback } from "react"
import * as fabric from 'fabric'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "@phosphor-icons/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { MediaFile, Selection } from "../ContentUploadFlow"
import { LassoToolbar, type LassoTool } from "./SelectionTools/LassoToolbar"
import { FreehandLasso } from "./SelectionTools/FreehandLasso"
import { PolygonalLasso } from "./SelectionTools/PolygonalLasso"
import { MagneticLasso } from "./SelectionTools/MagneticLasso"
import { useCanvasHistory } from "@/hooks/useCanvasHistory"

interface SelectionToolStepProps {
  media: MediaFile
  onComplete: (selections: Selection[]) => void
  onBack: () => void
}

export function SelectionToolStep({ media, onComplete, onBack }: SelectionToolStepProps) {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const [activeTool, setActiveTool] = useState<LassoTool>('freehand')
  const [selections, setSelections] = useState<Selection[]>([])
  const [magneticSensitivity, setMagneticSensitivity] = useState(50)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const freehandLassoRef = useRef<FreehandLasso | null>(null)
  const polygonalLassoRef = useRef<PolygonalLasso | null>(null)
  const magneticLassoRef = useRef<MagneticLasso | null>(null)
  const backgroundImageRef = useRef<fabric.FabricImage | null>(null)

  // History management
  const { saveState, undo, redo, canUndo, canRedo, initializeHistory } = useCanvasHistory(canvas)

  // Initialize Fabric canvas
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const container = containerRef.current
    const img = new Image()
    img.src = media.url

    img.onload = async () => {
      const containerWidth = container.clientWidth
      const scale = containerWidth / img.width
      const scaledHeight = img.height * scale

      // Create Fabric canvas
      const fabricCanvas = new fabric.Canvas(canvasRef.current!, {
        width: containerWidth,
        height: scaledHeight,
        selection: true,
        preserveObjectStacking: true
      })

      // Load background image
      const bgImage = await fabric.FabricImage.fromURL(media.url, {
        crossOrigin: 'anonymous'
      })

      bgImage.scaleToWidth(containerWidth)
      bgImage.set({
        selectable: false,
        evented: false
      })

      fabricCanvas.backgroundImage = bgImage
      backgroundImageRef.current = bgImage
      fabricCanvas.renderAll()

      setCanvas(fabricCanvas)
      initializeHistory()

      // Initialize lasso tools
      const onPathComplete = (path: fabric.Path) => {
        saveState()
      }

      freehandLassoRef.current = new FreehandLasso(fabricCanvas, onPathComplete)
      polygonalLassoRef.current = new PolygonalLasso(fabricCanvas, onPathComplete)
      
      const magneticLasso = new MagneticLasso(fabricCanvas, magneticSensitivity, onPathComplete)
      await magneticLasso.initialize(media.url)
      magneticLassoRef.current = magneticLasso
    }

    return () => {
      if (canvas) {
        canvas.dispose()
      }
    }
  }, [media.url])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const isCtrlOrCmd = isMac ? e.metaKey : e.ctrlKey

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

      // Escape: Cancel current selection
      if (e.key === 'Escape') {
        e.preventDefault()
        handleCancelCurrent()
      }

      // Backspace: Remove last point (polygonal/magnetic) or delete selected
      if (e.key === 'Backspace') {
        e.preventDefault()
        if (activeTool === 'polygonal' && polygonalLassoRef.current?.isDrawing()) {
          polygonalLassoRef.current.removeLastPoint()
        } else if (activeTool === 'magnetic' && magneticLassoRef.current?.isDrawing()) {
          magneticLassoRef.current.removeLastPoint()
        } else {
          handleDeleteSelected()
        }
      }

      // Delete: Delete selected object
      if (e.key === 'Delete') {
        e.preventDefault()
        handleDeleteSelected()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canvas, activeTool, undo, redo])

  // Handle mouse events based on active tool
  useEffect(() => {
    if (!canvas) return

    const handleMouseDown = (e: fabric.TMouseEvent) => {
      if (!e.pointer) return

      const pointer = e.pointer
      
      switch (activeTool) {
        case 'freehand':
          freehandLassoRef.current?.start(pointer.x, pointer.y)
          break
        case 'polygonal':
          polygonalLassoRef.current?.addPoint(pointer.x, pointer.y)
          break
        case 'magnetic':
          magneticLassoRef.current?.addPoint(pointer.x, pointer.y)
          break
      }
    }

    const handleMouseMove = (e: fabric.TMouseEvent) => {
      if (!e.pointer) return

      const pointer = e.pointer

      switch (activeTool) {
        case 'freehand':
          freehandLassoRef.current?.move(pointer.x, pointer.y)
          break
        case 'polygonal':
          polygonalLassoRef.current?.updatePreview(pointer.x, pointer.y)
          break
        case 'magnetic':
          magneticLassoRef.current?.updatePreview(pointer.x, pointer.y)
          break
      }
    }

    const handleMouseUp = () => {
      if (activeTool === 'freehand') {
        freehandLassoRef.current?.complete()
      }
    }

    canvas.on('mouse:down', handleMouseDown)
    canvas.on('mouse:move', handleMouseMove)
    canvas.on('mouse:up', handleMouseUp)

    return () => {
      canvas.off('mouse:down', handleMouseDown)
      canvas.off('mouse:move', handleMouseMove)
      canvas.off('mouse:up', handleMouseUp)
    }
  }, [canvas, activeTool])

  // Update magnetic sensitivity
  useEffect(() => {
    if (magneticLassoRef.current) {
      magneticLassoRef.current.setSensitivity(magneticSensitivity)
    }
  }, [magneticSensitivity])

  const handleToolChange = (tool: LassoTool) => {
    // Cancel current tool
    handleCancelCurrent()
    setActiveTool(tool)
  }

  const handleCancelCurrent = () => {
    freehandLassoRef.current?.cancel()
    polygonalLassoRef.current?.cancel()
    magneticLassoRef.current?.cancel()
  }

  const handleDeleteSelected = () => {
    if (!canvas) return

    const activeObjects = canvas.getActiveObjects()
    if (activeObjects.length === 0) return

    activeObjects.forEach((obj) => {
      canvas.remove(obj)
    })
    canvas.discardActiveObject()
    canvas.renderAll()
    saveState()
    toast.success('Selection deleted')
  }

  const hasActiveSelection = canvas?.getActiveObject() !== undefined

  const handleExportSelections = () => {
    if (!canvas) return

    const objects = canvas.getObjects().filter(obj => obj.type === 'path')
    
    if (objects.length === 0) {
      toast.error("Please create at least one selection")
      return
    }

    const exportedSelections: Selection[] = objects.map((obj, index) => {
      const bounds = obj.getBoundingRect()
      
      return {
        id: `sel-${Date.now()}-${index}`,
        x: bounds.left,
        y: bounds.top,
        width: bounds.width,
        height: bounds.height,
        points: [], // Simplified for export
        type: "open" // Default type
      }
    })

    setSelections(exportedSelections)
  }

  useEffect(() => {
    if (selections.length > 0) {
      onComplete(selections)
    }
  }, [selections])

  const handleComplete = () => {
    handleExportSelections()
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Advanced Selection Tools</h2>
        <p className="text-muted-foreground">Use lasso tools to precisely select areas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Toolbar */}
        <div className="lg:col-span-1">
          <LassoToolbar
            activeTool={activeTool}
            onToolChange={handleToolChange}
            onUndo={undo}
            onRedo={redo}
            onDelete={handleDeleteSelected}
            canUndo={canUndo}
            canRedo={canRedo}
            hasActiveSelection={hasActiveSelection}
            magneticSensitivity={magneticSensitivity}
            onSensitivityChange={setMagneticSensitivity}
          />
        </div>

        {/* Canvas */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-4">
              <div ref={containerRef} className="relative w-full">
                <canvas
                  id="selection-canvas"
                  ref={canvasRef}
                  className="w-full border border-border rounded-lg"
                  style={{ cursor: 'crosshair' }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleComplete}
          className="bg-primary text-primary-foreground hover:bg-accent"
        >
          Next: Add Details
        </Button>
      </div>
    </div>
  )
}
