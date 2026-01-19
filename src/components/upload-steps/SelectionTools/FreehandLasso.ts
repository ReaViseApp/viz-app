import * as fabric from 'fabric'
import { smoothCurve, isNearStartPoint, applyCustomControlStyles } from '@/lib/fabric-utils'

export class FreehandLasso {
  private canvas: fabric.Canvas
  private isDrawing: boolean = false
  private points: { x: number; y: number }[] = []
  private currentPath: fabric.Path | null = null
  private startPoint: { x: number; y: number } | null = null
  private pathString: string = ''

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas
  }

  startDrawing(point: { x: number; y: number }) {
    this.isDrawing = true
    this.points = [point]
    this.startPoint = point
    this.pathString = `M ${point.x} ${point.y}`

    // Create temporary path for visual feedback
    this.currentPath = new fabric.Path(this.pathString, {
      fill: '',
      stroke: '#FFB6C1',
      strokeWidth: 3,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
    })

    this.canvas.add(this.currentPath)
    this.canvas.renderAll()
  }

  continueDrawing(point: { x: number; y: number }) {
    if (!this.isDrawing || !this.currentPath) return

    this.points.push(point)
    this.pathString += ` L ${point.x} ${point.y}`

    // Update the path
    this.currentPath.set({ path: this.pathString })
    this.canvas.renderAll()
  }

  finishDrawing(autoClose: boolean = true): fabric.Polygon | null {
    if (!this.isDrawing || this.points.length < 3) {
      this.cancel()
      return null
    }

    // Remove temporary path
    if (this.currentPath) {
      this.canvas.remove(this.currentPath)
      this.currentPath = null
    }

    // Check if we should auto-close
    if (autoClose && this.startPoint) {
      const lastPoint = this.points[this.points.length - 1]
      if (isNearStartPoint(lastPoint, this.startPoint, 20)) {
        // Close the path
        this.points.push(this.startPoint)
      }
    }

    // Smooth the curve for better aesthetics
    const smoothedPoints = smoothCurve(this.points, 0.5)

    // Create polygon from points
    const fabricPoints = smoothedPoints.map(p => new fabric.Point(p.x, p.y))
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
    if (this.currentPath) {
      this.canvas.remove(this.currentPath)
    }
    this.reset()
    this.canvas.renderAll()
  }

  private reset() {
    this.isDrawing = false
    this.points = []
    this.currentPath = null
    this.startPoint = null
    this.pathString = ''
  }

  isActive(): boolean {
    return this.isDrawing
  }

  getPoints(): { x: number; y: number }[] {
    return [...this.points]
  }
}
