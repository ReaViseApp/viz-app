import { useState, useCallback } from 'react'
import * as fabric from 'fabric'
import { serializeCanvas, deserializeCanvas } from '@/lib/fabric-utils'

interface HistoryState {
  json: string
  timestamp: number
}

export function useCanvasHistory(canvas: fabric.Canvas | null, maxHistorySize: number = 50) {
  const [history, setHistory] = useState<HistoryState[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isSaving, setIsSaving] = useState(false)

  const saveState = useCallback(() => {
    if (!canvas || isSaving) return

    setIsSaving(true)
    
    try {
      const json = serializeCanvas(canvas)
      const newState: HistoryState = {
        json,
        timestamp: Date.now()
      }

      setHistory(prev => {
        // Remove any states after current index (for redo invalidation)
        const newHistory = prev.slice(0, currentIndex + 1)
        newHistory.push(newState)
        
        // Limit history size
        if (newHistory.length > maxHistorySize) {
          return newHistory.slice(newHistory.length - maxHistorySize)
        }
        
        return newHistory
      })
      
      setCurrentIndex(prev => {
        const newIndex = Math.min(prev + 1, maxHistorySize - 1)
        return newIndex
      })
    } finally {
      setIsSaving(false)
    }
  }, [canvas, currentIndex, isSaving, maxHistorySize])

  const undo = useCallback(async () => {
    if (!canvas || currentIndex <= 0) return

    const newIndex = currentIndex - 1
    const state = history[newIndex]
    
    if (state) {
      try {
        await deserializeCanvas(canvas, state.json)
        setCurrentIndex(newIndex)
      } catch (error) {
        console.error('Failed to undo:', error)
      }
    }
  }, [canvas, currentIndex, history])

  const redo = useCallback(async () => {
    if (!canvas || currentIndex >= history.length - 1) return

    const newIndex = currentIndex + 1
    const state = history[newIndex]
    
    if (state) {
      try {
        await deserializeCanvas(canvas, state.json)
        setCurrentIndex(newIndex)
      } catch (error) {
        console.error('Failed to redo:', error)
      }
    }
  }, [canvas, currentIndex, history])

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1

  const clearHistory = useCallback(() => {
    setHistory([])
    setCurrentIndex(-1)
  }, [])

  return {
    saveState,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    historySize: history.length,
    currentIndex
  }
}
