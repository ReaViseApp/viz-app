import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  PencilSimple,
  Polygon,
  Magnet,
  ArrowCounterClockwise,
  ArrowClockwise,
  Trash
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

export type LassoTool = 'freehand' | 'polygonal' | 'magnetic'

interface LassoToolbarProps {
  activeTool: LassoTool
  onToolChange: (tool: LassoTool) => void
  onUndo: () => void
  onRedo: () => void
  onDelete: () => void
  canUndo: boolean
  canRedo: boolean
  hasActiveSelection: boolean
  magneticSensitivity: number
  onSensitivityChange: (value: number) => void
}

export function LassoToolbar({
  activeTool,
  onToolChange,
  onUndo,
  onRedo,
  onDelete,
  canUndo,
  canRedo,
  hasActiveSelection,
  magneticSensitivity,
  onSensitivityChange
}: LassoToolbarProps) {
  return (
    <TooltipProvider>
      <Card className="p-4">
        <div className="space-y-4">
          {/* Tool Selection */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Selection Tools</p>
            <div className="grid grid-cols-3 gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeTool === 'freehand' ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => onToolChange('freehand')}
                    className={cn(
                      "w-full",
                      activeTool === 'freehand' && "bg-primary text-primary-foreground"
                    )}
                  >
                    <PencilSimple size={24} weight="duotone" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Freehand Lasso</p>
                  <p className="text-xs text-muted-foreground">Draw smooth curves</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeTool === 'polygonal' ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => onToolChange('polygonal')}
                    className={cn(
                      "w-full",
                      activeTool === 'polygonal' && "bg-primary text-primary-foreground"
                    )}
                  >
                    <Polygon size={24} weight="duotone" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Polygonal Lasso</p>
                  <p className="text-xs text-muted-foreground">Click points to create selection</p>
                  <p className="text-xs text-muted-foreground">Backspace to remove last point</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeTool === 'magnetic' ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => onToolChange('magnetic')}
                    className={cn(
                      "w-full",
                      activeTool === 'magnetic' && "bg-primary text-primary-foreground"
                    )}
                  >
                    <Magnet size={24} weight="duotone" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Magnetic Lasso</p>
                  <p className="text-xs text-muted-foreground">Automatically snaps to edges</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Magnetic Lasso Sensitivity */}
          {activeTool === 'magnetic' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Edge Sensitivity</p>
                <span className="text-xs text-muted-foreground">{magneticSensitivity}</span>
              </div>
              <Slider
                value={[magneticSensitivity]}
                onValueChange={(values) => onSensitivityChange(values[0])}
                min={10}
                max={100}
                step={10}
                className="w-full"
              />
            </div>
          )}

          {/* History Controls */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">History</p>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onUndo}
                    disabled={!canUndo}
                    className="flex-1"
                  >
                    <ArrowCounterClockwise size={20} weight="duotone" className="mr-2" />
                    Undo
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Undo (Ctrl+Z / Cmd+Z)</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRedo}
                    disabled={!canRedo}
                    className="flex-1"
                  >
                    <ArrowClockwise size={20} weight="duotone" className="mr-2" />
                    Redo
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Redo (Ctrl+Shift+Z / Cmd+Shift+Z)</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Delete Selection */}
          {hasActiveSelection && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onDelete}
                  className="w-full"
                >
                  <Trash size={20} weight="duotone" className="mr-2" />
                  Delete Selection
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete (Delete / Backspace)</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </Card>
    </TooltipProvider>
  )
}
