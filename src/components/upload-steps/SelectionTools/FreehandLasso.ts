import * as fabric from 'fabric'
import { catmullRomSpline, isPointNear, applyCustomControls } from '@/lib/fabric-utils'

export class FreehandLasso {
  private canvas: fabric.Canvas
  private points: { x: number; y: number }[] = []
  private isDrawing = false
  private tempPath: fabric.Path | null = null
  private onComplete?: (path: fabric.Path) => void

  constructor(canvas: fabric.Canvas, onComplete?: (path: fabric.Path) => void) {
    this.canvas = canvas
    this.onComplete = onComplete
  }

  start(x: number, y: number) {
    this.isDrawing = true
    this.points = [{ x, y }]
  }

  move(x: number, y: number) {
    if (!this.isDrawing) return

    this.points.push({ x, y })

    // Draw temporary path
    this.drawTempPath()

    // Check if near starting point for auto-close
    if (this.points.length > 10 && isPointNear(this.points[0], { x, y }, 20)) {
      this.complete()
    }
  }

  complete() {
    if (!this.isDrawing || this.points.length < 3) {
      this.cancel()
      return
    }

    this.isDrawing = false

    // Remove temporary path
    if (this.tempPath) {
      this.canvas.remove(this.tempPath)
      this.tempPath = null
    }

    // Apply Catmull-Rom spline smoothing
    const smoothedPoints = catmullRomSpline(this.points, 0.5)

    // Create final path
    const pathString = smoothedPoints.reduce((path, point, index) => {
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
    if (this.tempPath) {
      this.canvas.remove(this.tempPath)
      this.tempPath = null
    }
    this.reset()
    this.canvas.renderAll()
  }

  private drawTempPath() {
    // Remove old temporary path
    if (this.tempPath) {
      this.canvas.remove(this.tempPath)
    }

    if (this.points.length < 2) return

    // Create path string
    const pathString = this.points.reduce((path, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`
      }
      return `${path} L ${point.x} ${point.y}`
    }, '')

    this.tempPath = new fabric.Path(pathString, {
      fill: '',
      stroke: '#FFB6C1',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      objectCaching: false
    })

    this.canvas.add(this.tempPath)
    this.canvas.renderAll()
  }

  private reset() {
    this.isDrawing = false
    this.points = []
  }
}
