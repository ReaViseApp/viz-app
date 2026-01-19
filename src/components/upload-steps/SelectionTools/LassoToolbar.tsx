import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PencilSimple, Path, Magnet, ArrowCounterClockwise, ArrowClockwise, Trash } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

export type LassoTool = 'freehand' | 'polygonal' | 'magnetic'

interface LassoToolbarProps {
  activeTool: LassoTool
  onToolChange: (tool: LassoTool) => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onDeleteSelection: () => void
  hasSelection: boolean
}

export function LassoToolbar({
  activeTool,
  onToolChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onDeleteSelection,
  hasSelection
}: LassoToolbarProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-background border border-border rounded-lg shadow-sm">
      <div className="flex items-center gap-1 pr-2 border-r border-border">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeTool === 'freehand' ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  activeTool === 'freehand' && "bg-primary text-primary-foreground hover:bg-primary"
                )}
                onClick={() => onToolChange('freehand')}
              >
                <PencilSimple size={20} weight="duotone" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Freehand Lasso - Draw free-form selections</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeTool === 'polygonal' ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  activeTool === 'polygonal' && "bg-primary text-primary-foreground hover:bg-primary"
                )}
                onClick={() => onToolChange('polygonal')}
              >
                <Path size={20} weight="duotone" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Polygonal Lasso - Click to add points</p>
              <p className="text-xs text-muted-foreground">Backspace: Remove last point</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeTool === 'magnetic' ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  activeTool === 'magnetic' && "bg-primary text-primary-foreground hover:bg-primary"
                )}
                onClick={() => onToolChange('magnetic')}
              >
                <Magnet size={20} weight="duotone" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Magnetic Lasso - Snap to edges</p>
              <p className="text-xs text-muted-foreground">Auto-detects color boundaries</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center gap-1 pr-2 border-r border-border">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onUndo}
                disabled={!canUndo}
              >
                <ArrowCounterClockwise size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo (Ctrl+Z / Cmd+Z)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRedo}
                disabled={!canRedo}
              >
                <ArrowClockwise size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo (Ctrl+Shift+Z / Cmd+Shift+Z)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDeleteSelection}
                disabled={!hasSelection}
                className="text-destructive hover:text-destructive"
              >
                <Trash size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Selection (Delete/Backspace)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
