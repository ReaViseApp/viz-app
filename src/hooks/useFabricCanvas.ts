import { useEffect, useRef, useState } from 'react'
import * as fabric from 'fabric'
import { initializeFabricCanvas } from '@/lib/fabric-utils'

interface UseFabricCanvasOptions {
  width?: number
  height?: number
  backgroundColor?: string
  onObjectModified?: (obj: fabric.Object) => void
  onObjectAdded?: (obj: fabric.Object) => void
  onObjectRemoved?: (obj: fabric.Object) => void
  onSelectionCreated?: (selection: fabric.ActiveSelection | fabric.Object) => void
  onSelectionCleared?: () => void
}

export function useFabricCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  options?: UseFabricCanvasOptions
) {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const [isReady, setIsReady] = useState(false)
  const fabricInstanceRef = useRef<fabric.Canvas | null>(null)

  useEffect(() => {
    if (!canvasRef.current || fabricInstanceRef.current) return

    // Initialize Fabric canvas
    const fabricCanvas = initializeFabricCanvas(canvasRef.current, {
      width: options?.width,
      height: options?.height,
      backgroundColor: options?.backgroundColor
    })

    fabricInstanceRef.current = fabricCanvas
    setCanvas(fabricCanvas)
    setIsReady(true)

    // Set up event listeners
    if (options?.onObjectModified) {
      fabricCanvas.on('object:modified', (e) => {
        if (e.target) {
          options.onObjectModified?.(e.target)
        }
      })
    }

    if (options?.onObjectAdded) {
      fabricCanvas.on('object:added', (e) => {
        if (e.target) {
          options.onObjectAdded?.(e.target)
        }
      })
    }

    if (options?.onObjectRemoved) {
      fabricCanvas.on('object:removed', (e) => {
        if (e.target) {
          options.onObjectRemoved?.(e.target)
        }
      })
    }

    if (options?.onSelectionCreated) {
      fabricCanvas.on('selection:created', (e) => {
        if (e.selected && e.selected.length > 0) {
          options.onSelectionCreated?.(e.selected[0])
        }
      })
    }

    if (options?.onSelectionCleared) {
      fabricCanvas.on('selection:cleared', () => {
        options.onSelectionCleared?.()
      })
    }

    // Cleanup
    return () => {
      fabricCanvas.dispose()
      fabricInstanceRef.current = null
      setCanvas(null)
      setIsReady(false)
    }
  }, [canvasRef])

  const addObject = (obj: fabric.Object) => {
    if (!canvas) return
    canvas.add(obj)
    canvas.renderAll()
  }

  const removeObject = (obj: fabric.Object) => {
    if (!canvas) return
    canvas.remove(obj)
    canvas.renderAll()
  }

  const removeSelected = () => {
    if (!canvas) return
    const activeObjects = canvas.getActiveObjects()
    if (activeObjects.length > 0) {
      activeObjects.forEach(obj => canvas.remove(obj))
      canvas.discardActiveObject()
      canvas.renderAll()
    }
  }

  const clearCanvas = () => {
    if (!canvas) return
    canvas.clear()
    canvas.backgroundColor = options?.backgroundColor || '#ffffff'
    canvas.renderAll()
  }

  const setBackgroundColor = (color: string) => {
    if (!canvas) return
    canvas.backgroundColor = color
    canvas.renderAll()
  }

  const getObjects = () => {
    if (!canvas) return []
    return canvas.getObjects()
  }

  const bringForward = () => {
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (activeObject) {
      canvas.bringForward(activeObject)
      canvas.renderAll()
    }
  }

  const sendBackward = () => {
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (activeObject) {
      canvas.sendBackward(activeObject)
      canvas.renderAll()
    }
  }

  const bringToFront = () => {
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (activeObject) {
      canvas.bringToFront(activeObject)
      canvas.renderAll()
    }
  }

  const sendToBack = () => {
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (activeObject) {
      canvas.sendToBack(activeObject)
      canvas.renderAll()
    }
  }

  const getActiveObject = () => {
    if (!canvas) return null
    return canvas.getActiveObject()
  }

  const setActiveObject = (obj: fabric.Object) => {
    if (!canvas) return
    canvas.setActiveObject(obj)
    canvas.renderAll()
  }

  const discardActiveObject = () => {
    if (!canvas) return
    canvas.discardActiveObject()
    canvas.renderAll()
  }

  const renderAll = () => {
    if (!canvas) return
    canvas.renderAll()
  }

  return {
    canvas,
    isReady,
    addObject,
    removeObject,
    removeSelected,
    clearCanvas,
    setBackgroundColor,
    getObjects,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    getActiveObject,
    setActiveObject,
    discardActiveObject,
    renderAll
  }
}
