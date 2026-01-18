import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "@phosphor-icons/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { MediaFile, Selection } from "../ContentUploadFlow"

interface SelectionToolStepProps {
  media: MediaFile
  onComplete: (selections: Selection[]) => void
  onBack: () => void
}

export function SelectionToolStep({ media, onComplete, onBack }: SelectionToolStepProps) {
  const [selections, setSelections] = useState<Selection[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPoints, setCurrentPoints] = useState<{ x: number; y: number }[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const img = new Image()
    img.src = media.url
    img.onload = () => {
      const containerWidth = container.clientWidth
      const scale = containerWidth / img.width
      const scaledHeight = img.height * scale

      canvas.width = containerWidth
      canvas.height = scaledHeight
      setImageDimensions({ width: containerWidth, height: scaledHeight })

      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(img, 0, 0, containerWidth, scaledHeight)
      }
    }
  }, [media.url])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    setCurrentPoints([{ x, y }])
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    setIsDrawing(true)
    setCurrentPoints([{ x, y }])
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setCurrentPoints(prev => [...prev, { x, y }])
    
    const ctx = canvas.getContext("2d")
    if (ctx && currentPoints.length > 0) {
      redrawCanvas()
      
      ctx.strokeStyle = "#FFB6C1"
      ctx.lineWidth = 3
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.beginPath()
      ctx.moveTo(currentPoints[0].x, currentPoints[0].y)
      currentPoints.forEach(point => {
        ctx.lineTo(point.x, point.y)
      })
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    setCurrentPoints(prev => [...prev, { x, y }])
    
    const ctx = canvas.getContext("2d")
    if (ctx && currentPoints.length > 0) {
      redrawCanvas()
      
      ctx.strokeStyle = "#FFB6C1"
      ctx.lineWidth = 3
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.beginPath()
      ctx.moveTo(currentPoints[0].x, currentPoints[0].y)
      currentPoints.forEach(point => {
        ctx.lineTo(point.x, point.y)
      })
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }

  const handleMouseUp = () => {
    if (!isDrawing || currentPoints.length < 3) {
      setIsDrawing(false)
      setCurrentPoints([])
      return
    }

    const xs = currentPoints.map(p => p.x)
    const ys = currentPoints.map(p => p.y)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)

    const newSelection: Selection = {
      id: `sel-${Date.now()}`,
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      points: currentPoints,
      type: "open"
    }

    setSelections(prev => [...prev, newSelection])
    setIsDrawing(false)
    setCurrentPoints([])
    redrawCanvas()
  }

  const handleTouchEnd = () => {
    handleMouseUp()
  }

  const redrawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.src = media.url
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      selections.forEach(selection => {
        drawSelection(ctx, selection)
      })
    }
  }

  const drawSelection = (ctx: CanvasRenderingContext2D, selection: Selection) => {
    const color = selection.type === "open" ? "#98D8AA" : "#FFDAB3"
    
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.setLineDash([10, 5])
    ctx.beginPath()
    
    if (selection.points.length > 0) {
      ctx.moveTo(selection.points[0].x, selection.points[0].y)
      selection.points.forEach(point => {
        ctx.lineTo(point.x, point.y)
      })
      ctx.closePath()
    } else {
      ctx.rect(selection.x, selection.y, selection.width, selection.height)
    }
    
    ctx.stroke()
    ctx.setLineDash([])
  }

  useEffect(() => {
    redrawCanvas()
  }, [selections])

  const handleDeleteSelection = (id: string) => {
    setSelections(prev => prev.filter(s => s.id !== id))
  }

  const handleTypeChange = (id: string, type: "open" | "approval") => {
    setSelections(prev =>
      prev.map(s => (s.id === id ? { ...s, type } : s))
    )
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
        <p className="text-muted-foreground">Draw on areas you want to make Viz.Listed</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div ref={containerRef} className="relative w-full">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="w-full cursor-crosshair border border-border rounded-lg"
              style={{ touchAction: "none" }}
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
