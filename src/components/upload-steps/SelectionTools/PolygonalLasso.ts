import * as fabric from 'fabric'
import { isNearStartPoint } from '@/lib/fabric-utils'

export class PolygonalLasso {
  private canvas: fabric.Canvas
  private isDrawing: boolean = false
  private points: { x: number; y: number }[] = []
  private lines: fabric.Line[] = []
  private circles: fabric.Circle[] = []
  private previewLine: fabric.Line | null = null
  private startCircle: fabric.Circle | null = null

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas
  }

  startDrawing(point: { x: number; y: number }) {
    this.isDrawing = true
    this.points = [point]

    // Add start point indicator
    this.startCircle = new fabric.Circle({
      left: point.x - 5,
      top: point.y - 5,
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

    // Add line from last point to new point
    const line = new fabric.Line(
      [lastPoint.x, lastPoint.y, point.x, point.y],
      {
        stroke: '#FFB6C1',
        strokeWidth: 2,
        selectable: false,
        evented: false,
      }
    )

    // Add point indicator
    const circle = new fabric.Circle({
      left: point.x - 4,
      top: point.y - 4,
      radius: 4,
      fill: '#FFB6C1',
      selectable: false,
      evented: false,
    })

    this.lines.push(line)
    this.circles.push(circle)
    this.points.push(point)

    this.canvas.add(line)
    this.canvas.add(circle)
    this.canvas.renderAll()

    return false
  }

  removeLastPoint() {
    if (!this.isDrawing || this.points.length <= 1) return

    // Remove last point, line, and circle
    this.points.pop()
    
    if (this.lines.length > 0) {
      const lastLine = this.lines.pop()
      if (lastLine) this.canvas.remove(lastLine)
    }
    
    if (this.circles.length > 0) {
      const lastCircle = this.circles.pop()
      if (lastCircle) this.canvas.remove(lastCircle)
    }

    this.canvas.renderAll()
  }

  updatePreview(point: { x: number; y: number }) {
    if (!this.isDrawing || this.points.length === 0) return

    // Remove old preview line
    if (this.previewLine) {
      this.canvas.remove(this.previewLine)
    }

    const lastPoint = this.points[this.points.length - 1]
    
    // Create preview line
    this.previewLine = new fabric.Line(
      [lastPoint.x, lastPoint.y, point.x, point.y],
      {
        stroke: '#FFB6C1',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
      }
    )

    this.canvas.add(this.previewLine)
    this.canvas.renderAll()
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
      cornerColor: '#FF69B4',
      cornerSize: 10,
      transparentCorners: false,
      cornerStyle: 'circle' as 'circle',
    })

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
    
    if (this.previewLine) {
      this.canvas.remove(this.previewLine)
    }

    this.canvas.renderAll()
  }

  private reset() {
    this.isDrawing = false
    this.points = []
    this.lines = []
    this.circles = []
    this.previewLine = null
    this.startCircle = null
  }

  isActive(): boolean {
    return this.isDrawing
  }

  getPoints(): { x: number; y: number }[] {
    return [...this.points]
  }

  getPointCount(): number {
    return this.points.length
  }
}
