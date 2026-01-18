import { WarningCircle, WifiSlash, ArrowClockwise } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ErrorMessageProps {
  message?: string
  onRetry?: () => void
}

export function ErrorMessage({ message = "Something went wrong", onRetry }: ErrorMessageProps) {
  return (
    <Alert className="bg-coral/10 border-coral text-foreground">
      <WarningCircle className="h-5 w-5 text-coral" weight="fill" />
      <AlertDescription className="flex items-center justify-between gap-4">
        <span>{message}</span>
        {onRetry && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={onRetry}
            className="border-coral text-coral hover:bg-coral/10"
          >
            <ArrowClockwise className="w-4 h-4 mr-1" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

export function OfflineIndicator() {
  return (
    <Alert className="bg-peach/10 border-peach text-foreground mb-4">
      <WifiSlash className="h-5 w-5 text-peach" weight="fill" />
      <AlertDescription>
        You're offline. Some features may be unavailable.
      </AlertDescription>
    </Alert>
  )
}

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="mb-4 text-muted-foreground opacity-30">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          {description}
        </p>
      )}
      {action && (
        <Button 
          onClick={action.onClick}
          className="bg-primary text-primary-foreground hover:bg-accent"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
