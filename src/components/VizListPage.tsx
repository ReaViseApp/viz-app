import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ListChecks, MagnifyingGlass, Tray, Check, Clock, X as XIcon, Sparkle } from "@phosphor-icons/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { MyVizPage } from "@/components/MyVizPage"

interface VizListItem {
  id: string
  contentId: string
  contentThumbnail: string
  selectionArea: {
    left: number
    top: number
    width: number
    height: number
  }
  creatorUsername: string
  creatorAvatar: string
  status: "approved" | "pending" | "declined"
  addedDate: string
  approvalRequestId?: string
}

export function VizListPage() {
  const [vizList, setVizList] = useKV<VizListItem[]>("viz-list-items", [])
  const [currentUser] = useKV<{ id?: string; username: string; avatar: string; vizBizId?: string } | null>("viz-current-user", null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<VizListItem | null>(null)
  const [mainTab, setMainTab] = useState<"viz-list" | "my-viz">("viz-list")

  const filteredItems = (tab: string) => {
    let items = vizList || []
    
    if (tab !== "all") {
      items = items.filter((item) => item.status === tab)
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      items = items.filter(
        (item) => item.creatorUsername.toLowerCase().includes(query)
      )
    }
    
    return items
  }

  const getTabCount = (status: string) => {
    if (status === "all") return (vizList || []).length
    return (vizList || []).filter((item) => item.status === status).length
  }

  const handleRemove = (itemId: string) => {
    setVizList((current) => (current || []).filter((item) => item.id !== itemId))
    toast.success("Removed from Viz.List")
    setSelectedItem(null)
  }

  const handleUseInVizIt = (item: VizListItem) => {
    toast.success("Added to editorial selection!")
    setSelectedItem(null)
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <Tabs value={mainTab} onValueChange={(value) => setMainTab(value as "viz-list" | "my-viz")} className="w-full mb-6">
        <TabsList className="w-full border-b border-border rounded-none h-auto p-0 bg-transparent mb-0 grid grid-cols-2">
          <TabsTrigger
            value="viz-list"
            className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
          >
            <ListChecks size={20} className="mr-2" weight="fill" />
            <span className="font-semibold">Viz.List</span>
          </TabsTrigger>
          <TabsTrigger
            value="my-viz"
            className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
          >
            <Sparkle size={20} className="mr-2" weight="fill" />
            <span className="font-semibold">Only MyViz</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-viz" className="mt-6">
          <MyVizPage />
        </TabsContent>

        <TabsContent value="viz-list" className="mt-0">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <ListChecks size={32} weight="fill" className="text-primary" />
              <h1 className="text-3xl font-bold text-foreground">My Viz.List</h1>
            </div>
            <p className="text-muted-foreground mb-2">Your Favorites</p>
            <p className="text-sm text-muted-foreground">
              {(vizList || []).length} item{(vizList || []).length !== 1 ? "s" : ""} Viz.Listed
            </p>
          </div>

          <div className="mb-6">
            <div className="relative">
              <MagnifyingGlass 
                size={20} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" 
              />
              <Input
                placeholder="Search by creator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full border-b border-border rounded-none h-auto p-0 bg-transparent mb-6 grid grid-cols-4">
              <TabsTrigger
                value="all"
                className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
              >
                <span className="font-semibold">All</span>
                {getTabCount("all") > 0 && (
                  <Badge className="ml-2 bg-muted text-foreground rounded-full px-2 py-0 text-xs">
                    {getTabCount("all")}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="approved"
                className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
              >
                <span className="font-semibold">Approved</span>
                {getTabCount("approved") > 0 && (
                  <Badge className="ml-2 bg-muted text-foreground rounded-full px-2 py-0 text-xs">
                    {getTabCount("approved")}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
              >
                <span className="font-semibold">Pending</span>
                {getTabCount("pending") > 0 && (
                  <Badge className="ml-2 bg-muted text-foreground rounded-full px-2 py-0 text-xs">
                    {getTabCount("pending")}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="declined"
                className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
              >
                <span className="font-semibold">Declined</span>
                {getTabCount("declined") > 0 && (
                  <Badge className="ml-2 bg-muted text-foreground rounded-full px-2 py-0 text-xs">
                    {getTabCount("declined")}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {["all", "approved", "pending", "declined"].map((tabValue) => (
              <TabsContent key={tabValue} value={tabValue} className="mt-0">
                {filteredItems(tabValue).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Tray size={80} className="text-muted-foreground mb-4" weight="thin" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Your Viz.List is empty
                    </h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                      Browse the feed and Viz.List your favorites!
                    </p>
                    <Button 
                      className="bg-primary hover:bg-accent text-primary-foreground"
                      onClick={() => window.history.back()}
                    >
                      Explore Feed
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredItems(tabValue).map((item) => (
                      <Dialog key={item.id} open={selectedItem?.id === item.id} onOpenChange={(open) => !open && setSelectedItem(null)}>
                        <DialogTrigger asChild>
                          <Card
                            className={cn(
                              "relative overflow-hidden cursor-pointer group transition-all",
                              item.status === "approved" 
                                ? "hover:border-primary hover:shadow-lg" 
                                : "cursor-default",
                              item.status === "pending" || item.status === "declined" 
                                ? "grayscale" 
                                : ""
                            )}
                            onClick={() => {
                              if (item.status === "approved") {
                                setSelectedItem(item)
                              }
                            }}
                          >
                            <div className="relative aspect-square">
                              <img
                                src={item.contentThumbnail}
                                alt={`Content by ${item.creatorUsername}`}
                                className="w-full h-full object-cover"
                              />
                              <div
                                className={cn(
                                  "absolute border-2 pointer-events-none",
                                  item.status === "approved" 
                                    ? "border-primary/60" 
                                    : "border-border"
                                )}
                                style={{
                                  left: `${item.selectionArea.left}%`,
                                  top: `${item.selectionArea.top}%`,
                                  width: `${item.selectionArea.width}%`,
                                  height: `${item.selectionArea.height}%`,
                                }}
                              />
                              
                              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md">
                                <span className="text-white text-xs font-semibold">
                                  @{item.creatorUsername}
                                </span>
                              </div>
                              
                              <div className="absolute top-2 right-2">
                                {item.status === "approved" && (
                                  <Badge className="bg-[#98D8AA] text-[#1A1A1A] flex items-center gap-1">
                                    <Check size={14} weight="bold" />
                                    <span className="text-xs">Approved</span>
                                  </Badge>
                                )}
                                {item.status === "pending" && (
                                  <Badge className="bg-[#FFDAB3] text-[#1A1A1A] flex items-center gap-1">
                                    <Clock size={14} weight="bold" />
                                    <span className="text-xs">Pending</span>
                                  </Badge>
                                )}
                                {item.status === "declined" && (
                                  <Badge className="bg-[#FF6B6B] text-white flex items-center gap-1">
                                    <XIcon size={14} weight="bold" />
                                    <span className="text-xs">Declined</span>
                                  </Badge>
                                )}
                              </div>

                              {item.status === "declined" && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleRemove(item.id)
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              )}
                            </div>
                          </Card>
                        </DialogTrigger>

                        {item.status === "approved" && (
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Viz.Listed Content</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                                <img
                                  src={item.contentThumbnail}
                                  alt={`Content by ${item.creatorUsername}`}
                                  className="w-full h-full object-cover"
                                />
                                <div
                                  className="absolute border-2 border-primary pointer-events-none"
                                  style={{
                                    left: `${item.selectionArea.left}%`,
                                    top: `${item.selectionArea.top}%`,
                                    width: `${item.selectionArea.width}%`,
                                    height: `${item.selectionArea.height}%`,
                                  }}
                                />
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Created by</span>
                                <span className="font-semibold text-foreground">
                                  @{item.creatorUsername}
                                </span>
                              </div>

                              <div className="flex flex-col gap-2">
                                <Button
                                  className="w-full bg-primary hover:bg-accent text-primary-foreground"
                                  onClick={() => handleUseInVizIt(item)}
                                >
                                  Use in Viz.It
                                </Button>
                                <Button
                                  variant="outline"
                                  className="w-full"
                                  onClick={() => setSelectedItem(null)}
                                >
                                  View Original
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="w-full text-muted-foreground hover:text-foreground"
                                  onClick={() => handleRemove(item.id)}
                                >
                                  Remove from Viz.List
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        )}
                      </Dialog>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}
