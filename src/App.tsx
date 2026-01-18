import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { BottomNav } from "@/components/BottomNav"
import { Footer } from "@/components/Footer"
import { Feed } from "@/components/Feed"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
          <div className="container max-w-[600px] mx-auto px-4 py-8">
            <Feed />
          </div>
        </main>
      </div>
      
      <BottomNav />
      <Footer />
    </div>
  )
}

export default App