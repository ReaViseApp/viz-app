import * as fabric from 'fabric'
import { findNearestEdge, isPointNear, applyCustomControls } from '@/lib/fabric-utils'

export class MagneticLasso {
  private canvas: fabric.Canvas
  private points: { x: number; y: number }[] = []
  private circles: fabric.Circle[] = []
  private lines: fabric.Line[] = []
  private previewLine: fabric.Line | null = null
  private isActive = false
  private imageData: ImageData | null = null
  private sensitivity: number
  private searchRadius: number = 10
  private onComplete?: (path: fabric.Path) => void
  
  // Configuration constants
  private static readonly LINES_TO_REMOVE_PER_POINT = 10
  private static readonly INTERMEDIATE_POINT_SPACING = 5

  constructor(
    canvas: fabric.Canvas,
    sensitivity: number = 50,
    onComplete?: (path: fabric.Path) => void
  ) {
    this.canvas = canvas
    this.sensitivity = sensitivity
    this.onComplete = onComplete
  }

  /**
   * Initialize with image data for edge detection
   */
  async initialize(imageUrl: string) {
    return new Promise<void>((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      img.onload = () => {
        // Create temporary canvas to extract image data
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = this.canvas.getWidth()
        tempCanvas.height = this.canvas.getHeight()
        const ctx = tempCanvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }

        ctx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height)
        this.imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
        resolve()
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = imageUrl
    })
  }

  setSensitivity(sensitivity: number) {
    this.sensitivity = sensitivity
  }

  addPoint(x: number, y: number) {
    if (!this.imageData) return

    // Snap to nearest edge
    const snappedPoint = findNearestEdge(
      this.imageData,
      x,
      y,
      this.searchRadius,
      this.sensitivity
    )

    // Check if clicking near first point to close
    if (this.points.length >= 3 && isPointNear(this.points[0], snappedPoint, 20)) {
      this.complete()
      return
    }

    this.points.push(snappedPoint)
    this.isActive = true

    // Add visual point indicator
    const circle = new fabric.Circle({
      left: snappedPoint.x,
      top: snappedPoint.y,
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

    // Add line from previous point with intermediate snapped points
    if (this.points.length > 1) {
      const prevPoint = this.points[this.points.length - 2]
      
      // Create intermediate points along the path for better edge snapping
      const intermediatePoints = this.createIntermediatePoints(prevPoint, snappedPoint)
      
      // Draw line through all intermediate points
      for (let i = 0; i < intermediatePoints.length - 1; i++) {
        const line = new fabric.Line(
          [
            intermediatePoints[i].x,
            intermediatePoints[i].y,
            intermediatePoints[i + 1].x,
            intermediatePoints[i + 1].y
          ],
          {
            stroke: '#FF69B4',
            strokeWidth: 2,
            selectable: false,
            evented: false
          }
        )

        this.lines.push(line)
        this.canvas.add(line)
      }
    }

    this.canvas.renderAll()
  }

  updatePreview(x: number, y: number) {
    if (this.points.length === 0 || !this.imageData) return

    // Remove old preview line
    if (this.previewLine) {
      this.canvas.remove(this.previewLine)
    }

    // Snap preview point to edge
    const snappedPoint = findNearestEdge(
      this.imageData,
      x,
      y,
      this.searchRadius,
      this.sensitivity
    )

    const lastPoint = this.points[this.points.length - 1]
    
    this.previewLine = new fabric.Line([lastPoint.x, lastPoint.y, snappedPoint.x, snappedPoint.y], {
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

    // Remove lines associated with last point (could be multiple)
    const linesToRemove = this.lines.length > 0 
      ? Math.min(MagneticLasso.LINES_TO_REMOVE_PER_POINT, this.lines.length) 
      : 0
    for (let i = 0; i < linesToRemove; i++) {
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

  private createIntermediatePoints(
    start: { x: number; y: number },
    end: { x: number; y: number }
  ): { x: number; y: number }[] {
    if (!this.imageData) return [start, end]

    const points = [start]
    const distance = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    )
    const numPoints = Math.max(2, Math.floor(distance / MagneticLasso.INTERMEDIATE_POINT_SPACING))

    for (let i = 1; i < numPoints; i++) {
      const t = i / numPoints
      const x = start.x + (end.x - start.x) * t
      const y = start.y + (end.y - start.y) * t
      
      const snappedPoint = findNearestEdge(
        this.imageData,
        x,
        y,
        this.searchRadius,
        this.sensitivity
      )
      points.push(snappedPoint)
    }

    points.push(end)
    return points
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
