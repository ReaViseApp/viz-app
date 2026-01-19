import { useState, useCallback, useRef } from 'react'
import * as fabric from 'fabric'

interface HistoryState {
  state: string
  timestamp: number
}

const MAX_HISTORY_SIZE = 50

/**
 * Hook for managing canvas undo/redo history
 */
export function useCanvasHistory(canvas: fabric.Canvas | null) {
  const [history, setHistory] = useState<HistoryState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const isUndoRedoRef = useRef(false)

  /**
   * Save current canvas state to history
   */
  const saveState = useCallback(() => {
    if (!canvas || isUndoRedoRef.current) return

    const state = JSON.stringify(canvas.toJSON())
    const timestamp = Date.now()

    setHistory((prev) => {
      // Remove any states after current index (user made changes after undo)
      const newHistory = prev.slice(0, historyIndex + 1)
      
      // Add new state
      newHistory.push({ state, timestamp })
      
      // Limit history size
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift()
        setHistoryIndex((idx) => Math.max(0, idx - 1))
        return newHistory
      }
      
      setHistoryIndex(newHistory.length - 1)
      return newHistory
    })
  }, [canvas, historyIndex])

  /**
   * Undo last action
   */
  const undo = useCallback(async () => {
    if (!canvas || historyIndex <= 0) return

    isUndoRedoRef.current = true
    const newIndex = historyIndex - 1
    
    try {
      const historyState = history[newIndex]
      const stateObj = JSON.parse(historyState.state)
      await canvas.loadFromJSON(stateObj)
      canvas.renderAll()
      setHistoryIndex(newIndex)
    } catch (error) {
      console.error('Undo failed:', error)
    } finally {
      isUndoRedoRef.current = false
    }
  }, [canvas, history, historyIndex])

  /**
   * Redo previously undone action
   */
  const redo = useCallback(async () => {
    if (!canvas || historyIndex >= history.length - 1) return

    isUndoRedoRef.current = true
    const newIndex = historyIndex + 1
    
    try {
      const historyState = history[newIndex]
      const stateObj = JSON.parse(historyState.state)
      await canvas.loadFromJSON(stateObj)
      canvas.renderAll()
      setHistoryIndex(newIndex)
    } catch (error) {
      console.error('Redo failed:', error)
    } finally {
      isUndoRedoRef.current = false
    }
  }, [canvas, history, historyIndex])

  /**
   * Clear history
   */
  const clearHistory = useCallback(() => {
    setHistory([])
    setHistoryIndex(-1)
  }, [])

  /**
   * Initialize history with current canvas state
   */
  const initializeHistory = useCallback(() => {
    if (!canvas) return
    
    const state = JSON.stringify(canvas.toJSON())
    const timestamp = Date.now()
    
    setHistory([{ state, timestamp }])
    setHistoryIndex(0)
  }, [canvas])

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  return {
    saveState,
    undo,
    redo,
    clearHistory,
    initializeHistory,
    canUndo,
    canRedo,
    historySize: history.length,
    currentIndex: historyIndex
  }
}
