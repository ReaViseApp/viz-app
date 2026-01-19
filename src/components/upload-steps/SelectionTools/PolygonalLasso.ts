import * as fabric from 'fabric'
import { isPointNear, applyCustomControls } from '@/lib/fabric-utils'

export class PolygonalLasso {
  private canvas: fabric.Canvas
  private points: { x: number; y: number }[] = []
  private circles: fabric.Circle[] = []
  private lines: fabric.Line[] = []
  private previewLine: fabric.Line | null = null
  private isActive = false
  private onComplete?: (path: fabric.Path) => void

  constructor(canvas: fabric.Canvas, onComplete?: (path: fabric.Path) => void) {
    this.canvas = canvas
    this.onComplete = onComplete
  }

  addPoint(x: number, y: number) {
    // Check if clicking near first point to close
    if (this.points.length >= 3 && isPointNear(this.points[0], { x, y }, 20)) {
      this.complete()
      return
    }

    this.points.push({ x, y })
    this.isActive = true

    // Add visual point indicator
    const circle = new fabric.Circle({
      left: x,
      top: y,
      radius: 5,
      fill: '#FF69B4',
      stroke: '#FFB6C1',
      strokeWidth: 2,
      selectable: false,
      evented: false,
      originX: 'center',
      originY: 'center'
    })

    this.circles.push(circle)
    this.canvas.add(circle)

    // Add line from previous point
    if (this.points.length > 1) {
      const prevPoint = this.points[this.points.length - 2]
      const line = new fabric.Line([prevPoint.x, prevPoint.y, x, y], {
        stroke: '#FF69B4',
        strokeWidth: 2,
        selectable: false,
        evented: false
      })

      this.lines.push(line)
      this.canvas.add(line)
    }

    this.canvas.renderAll()
  }

  updatePreview(x: number, y: number) {
    if (this.points.length === 0) return

    // Remove old preview line
    if (this.previewLine) {
      this.canvas.remove(this.previewLine)
    }

    const lastPoint = this.points[this.points.length - 1]
    
    this.previewLine = new fabric.Line([lastPoint.x, lastPoint.y, x, y], {
      stroke: '#FFB6C1',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false
    })

    this.canvas.add(this.previewLine)
    this.canvas.renderAll()
  }

  removeLastPoint() {
    if (this.points.length === 0) return

    this.points.pop()

    // Remove last circle
    if (this.circles.length > 0) {
      const circle = this.circles.pop()
      if (circle) this.canvas.remove(circle)
    }

    // Remove last line
    if (this.lines.length > 0) {
      const line = this.lines.pop()
      if (line) this.canvas.remove(line)
    }

    if (this.points.length === 0) {
      this.isActive = false
    }

    this.canvas.renderAll()
  }

  complete() {
    if (this.points.length < 3) {
      this.cancel()
      return
    }

    this.isActive = false

    // Clear temporary visual elements
    this.clearTemporaryElements()

    // Create final path
    const pathString = this.points.reduce((path, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`
      }
      return `${path} L ${point.x} ${point.y}`
    }, '')

    const finalPath = new fabric.Path(`${pathString} Z`, {
      fill: 'rgba(255, 182, 193, 0.3)',
      stroke: '#FF69B4',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      selectable: true,
      hasControls: true,
      hasBorders: true,
      objectCaching: false
    })

    applyCustomControls(finalPath)
    this.canvas.add(finalPath)
    this.canvas.setActiveObject(finalPath)
    this.canvas.renderAll()

    if (this.onComplete) {
      this.onComplete(finalPath)
    }

    this.reset()
  }

  cancel() {
    this.clearTemporaryElements()
    this.reset()
    this.canvas.renderAll()
  }

  private clearTemporaryElements() {
    // Remove preview line
    if (this.previewLine) {
      this.canvas.remove(this.previewLine)
      this.previewLine = null
    }

    // Remove all circles
    this.circles.forEach((circle) => this.canvas.remove(circle))
    this.circles = []

    // Remove all lines
    this.lines.forEach((line) => this.canvas.remove(line))
    this.lines = []
  }

  private reset() {
    this.isActive = false
    this.points = []
  }

  isDrawing(): boolean {
    return this.isActive
  }

  getPointCount(): number {
    return this.points.length
  }
}
