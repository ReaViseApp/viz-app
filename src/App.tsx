import { useState, useEffect } from "react"
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
import { FollowerManagement } from "@/components/FollowerManagement"
import { TrendingPage } from "@/components/TrendingPage"
import { TermsOfServicePage, PrivacyPolicyPage, AboutPage, HelpPage, ContactPage } from "@/components/LegalPages"
import { Toaster } from "@/components/ui/sonner"
import { motion, AnimatePresence } from "framer-motion"
import { useInitializeBijoufi } from "@/hooks/use-initialize-bijoufi"
import { useInitializeInteractions } from "@/hooks/use-initialize-interactions"
import { useInitializeFollowerData } from "@/hooks/use-initialize-follower-data"
import { useKV } from "@github/spark/hooks"

type Page = "feed" | "viz-it" | "approval" | "viz-list" | "viz-let" | "profile" | "settings" | "manage-followers" | "trending" | "terms" | "privacy" | "about" | "help" | "contact"

interface SearchResult {
  type: "hashtag" | "user" | "post"
  id: string
  label: string
  username?: string
  avatar?: string
  hashtag?: string
  postId?: string
}

function App() {
  useInitializeBijoufi()
  useInitializeInteractions()
  useInitializeFollowerData()
  const [currentPage, setCurrentPage] = useState<Page>("feed")
  const [searchFilter, setSearchFilter] = useState<SearchResult | null>(null)
  const [allPosts] = useKV<any[]>("viz-posts", [])

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash === "manage-followers") {
        setCurrentPage("manage-followers")
      }
    }

    const handleSearchHashtag = (event: CustomEvent) => {
      const hashtag = event.detail
      setSearchFilter({
        type: "hashtag",
        id: hashtag,
        label: `#${hashtag}`,
        hashtag: hashtag
      })
      setCurrentPage("feed")
    }

    window.addEventListener("hashchange", handleHashChange)
    window.addEventListener("search-hashtag", handleSearchHashtag as EventListener)
    handleHashChange()

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
      window.removeEventListener("search-hashtag", handleSearchHashtag as EventListener)
    }
  }, [])

  const handlePageChange = (page: Page | string) => {
    setCurrentPage(page as Page)
    setSearchFilter(null)
    if (page === "manage-followers") {
      window.location.hash = "#manage-followers"
    } else {
      window.location.hash = ""
    }
  }

  const handleSearch = (results: SearchResult[]) => {
    if (results.length > 0) {
      setSearchFilter(results[0])
      setCurrentPage("feed")
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case "feed":
        return <Feed searchFilter={searchFilter} onClearSearch={() => setSearchFilter(null)} />
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
      case "manage-followers":
        return <FollowerManagement />
      case "trending":
        return <TrendingPage />
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
        return <Feed searchFilter={searchFilter} onClearSearch={() => setSearchFilter(null)} />
    }
  }

  const isLegalPage = ["terms", "privacy", "about", "help", "contact"].includes(currentPage)
  const isFullWidthPage = ["manage-followers", "trending"].includes(currentPage)

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <Header 
        onNavigateToProfile={() => setCurrentPage("profile")}
        onNavigateToSettings={() => setCurrentPage("settings")}
        onNavigateToHome={() => {
          setCurrentPage("feed")
          setSearchFilter(null)
        }}
        onSearch={handleSearch}
      />
      
      <div className="flex">
        {!isLegalPage && (
          <Sidebar 
            activePage={(currentPage === "settings" || currentPage === "manage-followers" || currentPage === "trending" ? "feed" : currentPage) as any}
            onPageChange={handlePageChange}
          />
        )}
        
        <main className={`flex-1 ${!isLegalPage ? "lg:ml-64" : ""} pb-20 lg:pb-0`}>
          <div className={`container ${!isLegalPage && !isFullWidthPage ? "max-w-[600px]" : "max-w-[900px]"} mx-auto px-4 py-8`}>
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
          activePage={(currentPage === "settings" || currentPage === "manage-followers" || currentPage === "trending" ? "feed" : currentPage) as any}
          onPageChange={handlePageChange}
        />
      )}
      <Footer onNavigate={handlePageChange} />
    </div>
  )
}

export default App