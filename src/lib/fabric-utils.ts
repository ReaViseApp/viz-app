import * as fabric from 'fabric'

/**
 * Utility functions for Fabric.js canvas operations
 */

// Custom pink-themed control handles
const CONTROL_COLORS = {
  corner: '#FFB6C1',
  cornerStroke: '#FF69B4',
  mtr: '#FFB6C1',
  mtrStroke: '#FF69B4'
}

/**
 * Apply custom pink-themed control styling to a Fabric.js object
 */
export function applyCustomControls(obj: fabric.FabricObject) {
  obj.set({
    borderColor: '#FF69B4',
    cornerColor: CONTROL_COLORS.corner,
    cornerStrokeColor: CONTROL_COLORS.cornerStroke,
    cornerStyle: 'circle' as const,
    cornerSize: 12,
    transparentCorners: false,
    borderScaleFactor: 2,
    padding: 5
  })
}

/**
 * Calculate Catmull-Rom spline interpolation for smooth curves
 * @param points - Array of points to interpolate
 * @param tension - Curve tension (0-1, default 0.5)
 * @returns Array of interpolated points
 */
export function catmullRomSpline(
  points: { x: number; y: number }[],
  tension: number = 0.5
): { x: number; y: number }[] {
  if (points.length < 2) return points
  if (points.length === 2) return points

  const result: { x: number; y: number }[] = []
  const numSegments = 10 // Number of points between each control point

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1]

    for (let t = 0; t < numSegments; t++) {
      const tt = t / numSegments
      const tt2 = tt * tt
      const tt3 = tt2 * tt

      const q1 = -tension * tt3 + 2 * tension * tt2 - tension * tt
      const q2 = (2 - tension) * tt3 + (tension - 3) * tt2 + 1
      const q3 = (tension - 2) * tt3 + (3 - 2 * tension) * tt2 + tension * tt
      const q4 = tension * tt3 - tension * tt2

      const x = p0.x * q1 + p1.x * q2 + p2.x * q3 + p3.x * q4
      const y = p0.y * q1 + p1.y * q2 + p2.y * q3 + p3.y * q4

      result.push({ x, y })
    }
  }

  result.push(points[points.length - 1])
  return result
}

/**
 * Calculate gradient magnitude using Sobel operator for edge detection
 * @param imageData - Canvas ImageData
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns Gradient magnitude (0-255)
 */
export function calculateGradientMagnitude(
  imageData: ImageData,
  x: number,
  y: number
): number {
  const width = imageData.width
  const height = imageData.height

  if (x < 1 || x >= width - 1 || y < 1 || y >= height - 1) {
    return 0
  }

  const getGrayscale = (px: number, py: number): number => {
    const index = (py * width + px) * 4
    const r = imageData.data[index]
    const g = imageData.data[index + 1]
    const b = imageData.data[index + 2]
    return 0.299 * r + 0.587 * g + 0.114 * b
  }

  // Sobel kernels
  const tl = getGrayscale(x - 1, y - 1)
  const t = getGrayscale(x, y - 1)
  const tr = getGrayscale(x + 1, y - 1)
  const l = getGrayscale(x - 1, y)
  const r = getGrayscale(x + 1, y)
  const bl = getGrayscale(x - 1, y + 1)
  const b = getGrayscale(x, y + 1)
  const br = getGrayscale(x + 1, y + 1)

  // Gradient calculation using Sobel operator
  const gx = -tl - 2 * l - bl + tr + 2 * r + br
  const gy = -tl - 2 * t - tr + bl + 2 * b + br
  const magnitude = Math.sqrt(gx * gx + gy * gy)

  return Math.min(255, magnitude)
}

/**
 * Find the nearest edge point within a search radius
 * @param imageData - Canvas ImageData
 * @param x - Starting X coordinate
 * @param y - Starting Y coordinate
 * @param searchRadius - Search radius in pixels
 * @param threshold - Edge detection threshold (0-255)
 * @returns Nearest edge point or original point
 */
export function findNearestEdge(
  imageData: ImageData,
  x: number,
  y: number,
  searchRadius: number = 10,
  threshold: number = 50
): { x: number; y: number } {
  let maxGradient = 0
  let edgePoint = { x, y }

  for (let dy = -searchRadius; dy <= searchRadius; dy++) {
    for (let dx = -searchRadius; dx <= searchRadius; dx++) {
      const px = Math.round(x + dx)
      const py = Math.round(y + dy)

      const gradient = calculateGradientMagnitude(imageData, px, py)

      if (gradient > maxGradient && gradient > threshold) {
        maxGradient = gradient
        edgePoint = { x: px, y: py }
      }
    }
  }

  return edgePoint
}

/**
 * Check if a point is near another point (within threshold)
 */
export function isPointNear(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  threshold: number = 20
): boolean {
  const dx = p1.x - p2.x
  const dy = p1.y - p2.y
  return Math.sqrt(dx * dx + dy * dy) <= threshold
}

/**
 * Create a path from points and return as Fabric.js Path
 */
export function createFabricPath(
  points: { x: number; y: number }[],
  options: Partial<fabric.PathProps> = {}
): fabric.Path | null {
  if (points.length < 2) return null

  const pathString = points.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`
    }
    return `${path} L ${point.x} ${point.y}`
  }, '')

  return new fabric.Path(`${pathString} Z`, {
    fill: 'rgba(255, 182, 193, 0.3)',
    stroke: '#FF69B4',
    strokeWidth: 2,
    strokeDashArray: [5, 5],
    selectable: true,
    hasControls: true,
    hasBorders: true,
    ...options
  })
}

/**
 * Serialize canvas state to JSON
 */
export function serializeCanvas(canvas: fabric.Canvas): string {
  return JSON.stringify(canvas.toJSON())
}

/**
 * Deserialize canvas state from JSON
 */
export async function deserializeCanvas(
  canvas: fabric.Canvas,
  json: string
): Promise<void> {
  try {
    const data = JSON.parse(json)
    await canvas.loadFromJSON(data)
    canvas.renderAll()
  } catch (error) {
    console.error('Failed to deserialize canvas:', error)
    throw error
  }
}

/**
 * Get canvas bounds (used for alignment operations)
 */
export function getCanvasBounds(canvas: fabric.Canvas) {
  return {
    width: canvas.getWidth(),
    height: canvas.getHeight()
  }
}

/**
 * Align objects on canvas
 */
export function alignObjects(
  canvas: fabric.Canvas,
  alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'
) {
  const activeObjects = canvas.getActiveObjects()
  if (activeObjects.length === 0) return

  const bounds = getCanvasBounds(canvas)

  activeObjects.forEach((obj) => {
    switch (alignment) {
      case 'left':
        obj.set({ left: 0 })
        break
      case 'center':
        obj.set({ left: (bounds.width - (obj.width || 0) * (obj.scaleX || 1)) / 2 })
        break
      case 'right':
        obj.set({ left: bounds.width - (obj.width || 0) * (obj.scaleX || 1) })
        break
      case 'top':
        obj.set({ top: 0 })
        break
      case 'middle':
        obj.set({ top: (bounds.height - (obj.height || 0) * (obj.scaleY || 1)) / 2 })
        break
      case 'bottom':
        obj.set({ top: bounds.height - (obj.height || 0) * (obj.scaleY || 1) })
        break
    }
    obj.setCoords()
  })

  canvas.renderAll()
}
