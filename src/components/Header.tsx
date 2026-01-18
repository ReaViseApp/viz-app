import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl md:text-[32px] font-bold tracking-tight text-foreground">Viz.</h1>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
          <Button 
            variant="outline" 
            size="sm"
            className="border-primary text-primary hover:bg-primary/10 text-xs md:text-sm"
          >
            Log In
          </Button>
          <Button 
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-accent text-xs md:text-sm whitespace-nowrap"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  )
}
