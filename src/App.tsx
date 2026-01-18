import { useState } from "react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { BottomNav } from "@/components/BottomNav"
import { Footer } from "@/components/Footer"
import { Feed } from "@/components/Feed"
import { VizItPage } from "@/components/VizItPage"
import { ApprovalStatusPage } from "@/components/ApprovalStatusPage"
import { VizListPage } from "@/components/VizListPage"
import { ProfilePage } from "@/components/ProfilePage"
import { Toaster } from "@/components/ui/sonner"

type Page = "feed" | "viz-it" | "approval" | "viz-list" | "viz-let" | "profile"

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("feed")

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <Header onNavigateToProfile={() => setCurrentPage("profile")} />
      
      <div className="flex">
        <Sidebar 
          activePage={currentPage}
          onPageChange={(page) => setCurrentPage(page as Page)}
        />
        
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
          <div className="container max-w-[600px] mx-auto px-4 py-8">
            {currentPage === "feed" && <Feed />}
            {currentPage === "viz-it" && <VizItPage />}
            {currentPage === "approval" && <ApprovalStatusPage />}
            {currentPage === "viz-list" && <VizListPage />}
            {currentPage === "profile" && <ProfilePage />}
            {currentPage === "viz-let" && <div className="text-center py-20 text-muted-foreground">Viz.Let - Coming Soon</div>}
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