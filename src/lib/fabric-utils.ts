import { fabric } from 'fabric'

/**
 * Initialize a Fabric.js canvas with default settings
 */
export function initializeFabricCanvas(
  canvasElement: HTMLCanvasElement,
  options?: {
    width?: number
    height?: number
    backgroundColor?: string
  }
): fabric.Canvas {
  const canvas = new fabric.Canvas(canvasElement, {
    width: options?.width || 600,
    height: options?.height || 600,
    backgroundColor: options?.backgroundColor || '#ffffff',
    preserveObjectStacking: true,
    selection: true,
    ...options
  })

  // Customize control handles to match app theme (pink/primary color)
  fabric.Object.prototype.set({
    borderColor: '#FFB6C1',
    cornerColor: '#FF69B4',
    cornerSize: 10,
    transparentCorners: false,
    cornerStyle: 'circle' as 'circle',
  })

  return canvas
}

/**
 * Convert selection points to Fabric.js polygon
 */
export function pointsToFabricPolygon(
  points: { x: number; y: number }[],
  options?: fabric.IPolygonOptions
): fabric.Polygon {
  const fabricPoints = points.map(p => new fabric.Point(p.x, p.y))
  
  return new fabric.Polygon(fabricPoints, {
    fill: 'rgba(152, 216, 170, 0.3)', // mint color with transparency
    stroke: '#98D8AA',
    strokeWidth: 3,
    strokeDashArray: [10, 5],
    selectable: true,
    hasControls: true,
    ...options
  })
}

/**
 * Detect edges in an image for magnetic lasso
 */
export function detectEdges(
  imageData: ImageData,
  threshold: number = 30
): { x: number; y: number }[] {
  const edges: { x: number; y: number }[] = []
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height

  // Simple edge detection using Sobel operator
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4
      
      // Get neighboring pixels
      const tl = data[(y - 1) * width * 4 + (x - 1) * 4]
      const t = data[(y - 1) * width * 4 + x * 4]
      const tr = data[(y - 1) * width * 4 + (x + 1) * 4]
      const l = data[idx - 4]
      const r = data[idx + 4]
      const bl = data[(y + 1) * width * 4 + (x - 1) * 4]
      const b = data[(y + 1) * width * 4 + x * 4]
      const br = data[(y + 1) * width * 4 + (x + 1) * 4]

      // Sobel kernels
      const gx = -tl - 2 * l - bl + tr + 2 * r + br
      const gy = -tl - 2 * t - tr + bl + 2 * b + br
      const magnitude = Math.sqrt(gx * gx + gy * gy)

      if (magnitude > threshold) {
        edges.push({ x, y })
      }
    }
  }

  return edges
}

/**
 * Find nearest edge point for magnetic lasso snapping
 */
export function findNearestEdge(
  point: { x: number; y: number },
  edges: { x: number; y: number }[],
  maxDistance: number = 20
): { x: number; y: number } | null {
  let nearest: { x: number; y: number } | null = null
  let minDist = maxDistance

  for (const edge of edges) {
    const dist = Math.sqrt(
      Math.pow(edge.x - point.x, 2) + Math.pow(edge.y - point.y, 2)
    )
    if (dist < minDist) {
      minDist = dist
      nearest = edge
    }
  }

  return nearest
}

/**
 * Smooth curve using Catmull-Rom spline
 */
export function smoothCurve(
  points: { x: number; y: number }[],
  tension: number = 0.5
): { x: number; y: number }[] {
  if (points.length < 3) return points

  const smoothed: { x: number; y: number }[] = []
  
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(points.length - 1, i + 2)]

    for (let t = 0; t < 1; t += 0.1) {
      const t2 = t * t
      const t3 = t2 * t

      const x = 0.5 * (
        (2 * p1.x) +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
      )

      const y = 0.5 * (
        (2 * p1.y) +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
      )

      smoothed.push({ x, y })
    }
  }

  return smoothed
}

/**
 * Check if a point is near the start point (for auto-closing paths)
 */
export function isNearStartPoint(
  currentPoint: { x: number; y: number },
  startPoint: { x: number; y: number },
  threshold: number = 20
): boolean {
  const dist = Math.sqrt(
    Math.pow(currentPoint.x - startPoint.x, 2) +
    Math.pow(currentPoint.y - startPoint.y, 2)
  )
  return dist < threshold
}

/**
 * Serialize canvas to JSON (for saving/loading)
 */
export function serializeCanvas(canvas: fabric.Canvas): string {
  return JSON.stringify(canvas.toJSON(['selectable', 'hasControls', 'id']))
}

/**
 * Deserialize canvas from JSON
 */
export function deserializeCanvas(
  canvas: fabric.Canvas,
  json: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      canvas.loadFromJSON(json, () => {
        canvas.renderAll()
        resolve()
      })
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Convert Fabric.js object bounds to Selection interface format
 */
export function fabricObjectToSelection(
  obj: fabric.Object,
  id: string,
  type: 'open' | 'approval'
): {
  id: string
  x: number
  y: number
  width: number
  height: number
  points: { x: number; y: number }[]
  type: 'open' | 'approval'
} {
  const bounds = obj.getBoundingRect()
  const points: { x: number; y: number }[] = []

  // Extract points if it's a polygon
  if (obj.type === 'polygon') {
    const polygon = obj as fabric.Polygon
    polygon.points?.forEach((point) => {
      points.push({ x: point.x, y: point.y })
    })
  }

  return {
    id,
    x: bounds.left,
    y: bounds.top,
    width: bounds.width,
    height: bounds.height,
    points,
    type
  }
}

/**
 * Add snap-to-grid functionality
 */
export function snapToGrid(
  value: number,
  gridSize: number = 20
): number {
  return Math.round(value / gridSize) * gridSize
}

/**
 * Add snap-to-angle functionality for rotation
 */
export function snapToAngle(
  angle: number,
  snapAngle: number = 15
): number {
  return Math.round(angle / snapAngle) * snapAngle
}
