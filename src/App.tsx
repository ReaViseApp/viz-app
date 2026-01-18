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
import { TermsOfServicePage, PrivacyPolicyPage, AboutPage, HelpPage, ContactPage } from "@/components/LegalPages"
import { Toaster } from "@/components/ui/sonner"
import { motion, AnimatePresence } from "framer-motion"

type Page = "feed" | "viz-it" | "approval" | "viz-list" | "viz-let" | "profile" | "settings" | "terms" | "privacy" | "about" | "help" | "contact"

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("feed")

  const handlePageChange = (page: Page | string) => {
    setCurrentPage(page as Page)
  }

  const renderPage = () => {
    switch (currentPage) {
      case "feed":
        return <Feed />
      case "viz-it":
        return <VizItPage />
      case "approval":
        return <ApprovalStatusPage />
      case "viz-list":
        return <VizListPage />
      case "profile":
        return <ProfilePage />
      case "viz-let":
        return <VizLetPage onNavigateToSettings={() => setCurrentPage("settings")} />
      case "settings":
        return <SettingsPage />
      case "terms":
        return <TermsOfServicePage />
      case "privacy":
        return <PrivacyPolicyPage />
      case "about":
        return <AboutPage />
      case "help":
        return <HelpPage />
      case "contact":
        return <ContactPage />
      default:
        return <Feed />
    }
  }

  const isLegalPage = ["terms", "privacy", "about", "help", "contact"].includes(currentPage)

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <Header 
        onNavigateToProfile={() => setCurrentPage("profile")}
        onNavigateToSettings={() => setCurrentPage("settings")}
        onNavigateToHome={() => setCurrentPage("feed")}
      />
      
      <div className="flex">
        {!isLegalPage && (
          <Sidebar 
            activePage={(currentPage === "settings" ? "feed" : currentPage) as any}
            onPageChange={handlePageChange}
          />
        )}
        
        <main className={`flex-1 ${!isLegalPage ? "lg:ml-64" : ""} pb-20 lg:pb-0`}>
          <div className={`container ${!isLegalPage ? "max-w-[600px]" : "max-w-[900px]"} mx-auto px-4 py-8`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      
      {!isLegalPage && (
        <BottomNav 
          activePage={(currentPage === "settings" ? "feed" : currentPage) as any}
          onPageChange={handlePageChange}
        />
      )}
      <Footer onNavigate={handlePageChange} />
    </div>
  )
}

export default App