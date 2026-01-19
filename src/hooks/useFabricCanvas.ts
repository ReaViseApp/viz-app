import { useEffect, useRef, useState, useCallback } from 'react'
import * as fabric from 'fabric'
import { applyCustomControls } from '@/lib/fabric-utils'

// Module-scoped clipboard for security
let clipboard: fabric.FabricObject | null = null

/**
 * Hook for managing Fabric.js canvas
 */
export function useFabricCanvas(canvasId: string) {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const [isDrawingMode, setIsDrawingMode] = useState(false)
  const canvasRef = useRef<fabric.Canvas | null>(null)

  /**
   * Initialize Fabric.js canvas
   */
  useEffect(() => {
    const canvasEl = document.getElementById(canvasId) as HTMLCanvasElement
    if (!canvasEl) return

    const fabricCanvas = new fabric.Canvas(canvasEl, {
      width: 600,
      height: 600,
      backgroundColor: '#FFFFFF',
      selection: true,
      preserveObjectStacking: true
    })

    // Configure default brush
    fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas)
    fabricCanvas.freeDrawingBrush.color = '#FF69B4'
    fabricCanvas.freeDrawingBrush.width = 5

    canvasRef.current = fabricCanvas
    setCanvas(fabricCanvas)

    return () => {
      fabricCanvas.dispose()
    }
  }, [canvasId])

  /**
   * Add text to canvas
   */
  const addText = useCallback(
    (text: string = 'Double click to edit') => {
      if (!canvas) return

      const textObj = new fabric.IText(text, {
        left: 100,
        top: 100,
        fontSize: 24,
        fontFamily: 'Plus Jakarta Sans',
        fill: '#1A1A1A'
      })

      applyCustomControls(textObj)
      canvas.add(textObj)
      canvas.setActiveObject(textObj)
      canvas.renderAll()
    },
    [canvas]
  )

  /**
   * Add shape to canvas
   */
  const addShape = useCallback(
    (shapeType: 'rectangle' | 'circle' | 'triangle' | 'line') => {
      if (!canvas) return

      let shape: fabric.FabricObject

      switch (shapeType) {
        case 'rectangle':
          shape = new fabric.Rect({
            left: 100,
            top: 100,
            width: 150,
            height: 100,
            fill: '#FFB6C1',
            stroke: '#FF69B4',
            strokeWidth: 2
          })
          break
        case 'circle':
          shape = new fabric.Circle({
            left: 100,
            top: 100,
            radius: 50,
            fill: '#FFB6C1',
            stroke: '#FF69B4',
            strokeWidth: 2
          })
          break
        case 'triangle':
          shape = new fabric.Triangle({
            left: 100,
            top: 100,
            width: 100,
            height: 100,
            fill: '#FFB6C1',
            stroke: '#FF69B4',
            strokeWidth: 2
          })
          break
        case 'line':
          shape = new fabric.Line([50, 50, 200, 50], {
            stroke: '#FF69B4',
            strokeWidth: 3
          })
          break
        default:
          return
      }

      applyCustomControls(shape)
      canvas.add(shape)
      canvas.setActiveObject(shape)
      canvas.renderAll()
    },
    [canvas]
  )

  /**
   * Add image to canvas
   */
  const addImage = useCallback(
    async (url: string) => {
      if (!canvas) return

      try {
        const img = await fabric.FabricImage.fromURL(url, {
          crossOrigin: 'anonymous'
        })
        
        // Scale image if too large
        const maxWidth = 300
        const maxHeight = 300
        if (img.width && img.height) {
          const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1)
          img.scale(scale)
        }

        img.set({
          left: 150,
          top: 150
        })

        applyCustomControls(img)
        canvas.add(img)
        canvas.setActiveObject(img)
        canvas.renderAll()
      } catch (error) {
        console.error('Failed to load image:', error)
        throw error
      }
    },
    [canvas]
  )

  /**
   * Toggle drawing mode
   */
  const toggleDrawingMode = useCallback(() => {
    if (!canvas) return

    const newMode = !isDrawingMode
    canvas.isDrawingMode = newMode
    setIsDrawingMode(newMode)
  }, [canvas, isDrawingMode])

  /**
   * Set brush properties
   */
  const setBrushProperties = useCallback(
    (color?: string, width?: number) => {
      if (!canvas || !canvas.freeDrawingBrush) return

      if (color) canvas.freeDrawingBrush.color = color
      if (width) canvas.freeDrawingBrush.width = width
    },
    [canvas]
  )

  /**
   * Copy selected object(s)
   */
  const copy = useCallback(() => {
    if (!canvas) return

    const activeObject = canvas.getActiveObject()
    if (!activeObject) return

    activeObject.clone().then((cloned: fabric.FabricObject) => {
      clipboard = cloned
    })
  }, [canvas])

  /**
   * Paste clipboard object
   */
  const paste = useCallback(() => {
    if (!canvas || !clipboard) return

    clipboard.clone().then((cloned: fabric.FabricObject) => {
      canvas.discardActiveObject()
      
      cloned.set({
        left: (cloned.left || 0) + 10,
        top: (cloned.top || 0) + 10,
        evented: true
      })

      if (cloned.type === 'activeSelection') {
        // Handle group paste
        cloned.canvas = canvas
        ;(cloned as fabric.ActiveSelection).forEachObject((obj) => {
          canvas.add(obj)
        })
        cloned.setCoords()
      } else {
        canvas.add(cloned)
      }

      applyCustomControls(cloned)
      canvas.setActiveObject(cloned)
      canvas.requestRenderAll()
    })
  }, [canvas])

  /**
   * Duplicate selected object(s)
   */
  const duplicate = useCallback(() => {
    copy()
    setTimeout(() => paste(), 0)
  }, [copy, paste])

  /**
   * Delete selected object(s)
   */
  const deleteSelected = useCallback(() => {
    if (!canvas) return

    const activeObjects = canvas.getActiveObjects()
    if (activeObjects.length === 0) return

    activeObjects.forEach((obj) => {
      canvas.remove(obj)
    })
    canvas.discardActiveObject()
    canvas.renderAll()
  }, [canvas])

  /**
   * Clear canvas
   */
  const clearCanvas = useCallback(() => {
    if (!canvas) return
    canvas.clear()
  }, [canvas])

  return {
    canvas,
    isDrawingMode,
    addText,
    addShape,
    addImage,
    toggleDrawingMode,
    setBrushProperties,
    copy,
    paste,
    duplicate,
    deleteSelected,
    clearCanvas
  }
}
