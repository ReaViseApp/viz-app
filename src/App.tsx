import { useState } from "react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { BottomNav } from "@/components/BottomNav"
import { Footer } from "@/components/Footer"
import { Feed } from "@/components/Feed"
import { VizItPage } from "@/components/VizItPage"
import { Toaster } from "@/components/ui/sonner"

type Page = "feed" | "viz-it" | "approval" | "viz-list" | "viz-let"

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("feed")

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <Header />
      
      <div className="flex">
        <Sidebar 
          activePage={currentPage}
          onPageChange={(page) => setCurrentPage(page as Page)}
        />
        
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
          <div className="container max-w-[600px] mx-auto px-4 py-8">
            {currentPage === "feed" && <Feed />}
            {currentPage === "viz-it" && <VizItPage />}
            {currentPage === "approval" && <div className="text-center py-20 text-muted-foreground">Approval Status - Coming Soon</div>}
            {currentPage === "viz-list" && <div className="text-center py-20 text-muted-foreground">Viz.List - Coming Soon</div>}
          </div>
        </main>
      </div>
      
      <BottomNav 
        activePage={currentPage}
        onPageChange={(page) => setCurrentPage(page as Page)}
      />
      <Footer />
    </div>
  )
}

export default App