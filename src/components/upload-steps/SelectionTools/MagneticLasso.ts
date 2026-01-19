import * as fabric from 'fabric'
import { detectEdges, findNearestEdge, isNearStartPoint, applyCustomControlStyles } from '@/lib/fabric-utils'

export class MagneticLasso {
  private canvas: fabric.Canvas
  private isDrawing: boolean = false
  private points: { x: number; y: number }[] = []
  private edges: { x: number; y: number }[] = []
  private sensitivity: number = 30
  private lines: fabric.Line[] = []
  private circles: fabric.Circle[] = []
  private startCircle: fabric.Circle | null = null
  private imageData: ImageData | null = null

  constructor(canvas: fabric.Canvas, sensitivity: number = 30) {
    this.canvas = canvas
    this.sensitivity = sensitivity
  }

  async initializeEdgeDetection() {
    // Get image data from canvas for edge detection
    const canvasElement = this.canvas.getElement() as HTMLCanvasElement
    const ctx = canvasElement.getContext('2d')
    
    if (ctx) {
      this.imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height)
      this.edges = detectEdges(this.imageData, this.sensitivity)
    }
  }

  startDrawing(point: { x: number; y: number }) {
    this.isDrawing = true
    
    // Snap to nearest edge if available
    const snappedPoint = this.snapToEdge(point)
    this.points = [snappedPoint]

    // Add start point indicator
    this.startCircle = new fabric.Circle({
      left: snappedPoint.x - 5,
      top: snappedPoint.y - 5,
      radius: 5,
      fill: '#FF69B4',
      stroke: '#FFB6C1',
      strokeWidth: 2,
      selectable: false,
      evented: false,
    })

    this.canvas.add(this.startCircle)
    this.canvas.renderAll()
  }

  addPoint(point: { x: number; y: number }): boolean {
    if (!this.isDrawing) return false

    // Check if clicking near start point to close
    if (this.points.length >= 3 && isNearStartPoint(point, this.points[0], 15)) {
      return true // Signal to finish drawing
    }

    const lastPoint = this.points[this.points.length - 1]
    
    // Snap to nearest edge
    const snappedPoint = this.snapToEdge(point)

    // Trace path from last point to snapped point along edges
    const pathPoints = this.tracePath(lastPoint, snappedPoint)
    
    pathPoints.forEach((p, index) => {
      if (index === 0) return // Skip first point (already added)
      
      const prevPoint = this.points[this.points.length - 1]
      
      // Add line segment
      const line = new fabric.Line(
        [prevPoint.x, prevPoint.y, p.x, p.y],
        {
          stroke: '#FFB6C1',
          strokeWidth: 2,
          selectable: false,
          evented: false,
        }
      )

      this.lines.push(line)
      this.canvas.add(line)
      this.points.push(p)
    })

    // Add point indicator
    const circle = new fabric.Circle({
      left: snappedPoint.x - 4,
      top: snappedPoint.y - 4,
      radius: 4,
      fill: '#FF69B4',
      selectable: false,
      evented: false,
    })

    this.circles.push(circle)
    this.canvas.add(circle)
    this.canvas.renderAll()

    return false
  }

  private snapToEdge(point: { x: number; y: number }): { x: number; y: number } {
    if (this.edges.length === 0) return point

    const nearestEdge = findNearestEdge(point, this.edges, 20)
    return nearestEdge || point
  }

  private tracePath(
    start: { x: number; y: number },
    end: { x: number; y: number }
  ): { x: number; y: number }[] {
    // Simple path tracing - can be improved with A* algorithm
    const points: { x: number; y: number }[] = []
    
    // For now, just return start and end with some intermediate snapped points
    const steps = 5
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const x = start.x + (end.x - start.x) * t
      const y = start.y + (end.y - start.y) * t
      
      const snapped = this.snapToEdge({ x, y })
      points.push(snapped)
    }

    return points
  }

  finishDrawing(): fabric.Polygon | null {
    if (!this.isDrawing || this.points.length < 3) {
      this.cancel()
      return null
    }

    // Clean up temporary objects
    this.cleanup()

    // Create polygon from points
    const fabricPoints = this.points.map(p => new fabric.Point(p.x, p.y))
    const polygon = new fabric.Polygon(fabricPoints, {
      fill: 'rgba(152, 216, 170, 0.3)', // mint color with transparency
      stroke: '#98D8AA',
      strokeWidth: 3,
      strokeDashArray: [10, 5],
      selectable: true,
      hasControls: true,
      hasBorders: true,
    })

    // Apply custom control styles
    applyCustomControlStyles(polygon)

    this.reset()
    return polygon
  }

  cancel() {
    this.cleanup()
    this.reset()
  }

  private cleanup() {
    // Remove all temporary objects
    this.lines.forEach(line => this.canvas.remove(line))
    this.circles.forEach(circle => this.canvas.remove(circle))
    
    if (this.startCircle) {
      this.canvas.remove(this.startCircle)
    }

    this.canvas.renderAll()
  }

  private reset() {
    this.isDrawing = false
    this.points = []
    this.lines = []
    this.circles = []
    this.startCircle = null
  }

  isActive(): boolean {
    return this.isDrawing
  }

  setSensitivity(value: number) {
    this.sensitivity = value
    if (this.imageData) {
      this.edges = detectEdges(this.imageData, this.sensitivity)
    }
  }

  getPoints(): { x: number; y: number }[] {
    return [...this.points]
  }
}
