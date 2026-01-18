interface FooterProps {
  onNavigate?: (page: string) => void
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="mt-12 border-t border-border bg-muted/30">
      <div className="container py-8 px-4">
        <div className="flex flex-col items-center gap-4">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <button 
              onClick={() => onNavigate?.("about")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => onNavigate?.("help")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Help
            </button>
            <button 
              onClick={() => onNavigate?.("terms")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Terms
            </button>
            <button 
              onClick={() => onNavigate?.("privacy")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy
            </button>
            <button 
              onClick={() => onNavigate?.("contact")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </button>
          </nav>
          <p className="text-sm text-muted-foreground">
            © 2026 Viz. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
