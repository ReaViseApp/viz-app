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
import { VizLetPage } from "@/components/VizLetPage"
import { SettingsPage } from "@/components/SettingsPage"
import { Toaster } from "@/components/ui/sonner"

type Page = "feed" | "viz-it" | "approval" | "viz-list" | "viz-let" | "profile" | "settings"

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("feed")

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <Header 
        onNavigateToProfile={() => setCurrentPage("profile")}
        onNavigateToSettings={() => setCurrentPage("settings")}
      />
      
      <div className="flex">
        <Sidebar 
          activePage={currentPage === "settings" ? "feed" : currentPage}
          onPageChange={(page) => setCurrentPage(page as Page)}
        />
        
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
          <div className="container max-w-[600px] mx-auto px-4 py-8">
            {currentPage === "feed" && <Feed />}
            {currentPage === "viz-it" && <VizItPage />}
            {currentPage === "approval" && <ApprovalStatusPage />}
            {currentPage === "viz-list" && <VizListPage />}
            {currentPage === "profile" && <ProfilePage />}
            {currentPage === "viz-let" && <VizLetPage onNavigateToSettings={() => setCurrentPage("settings")} />}
            {currentPage === "settings" && <SettingsPage />}
          </div>
        </main>
      </div>
      
      <BottomNav 
        activePage={currentPage === "settings" ? "feed" : currentPage}
        onPageChange={(page) => setCurrentPage(page as Page)}
      />
      <Footer />
    </div>
  )
}

export default App