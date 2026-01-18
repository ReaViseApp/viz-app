import { useState, useEffect } from "react"
import { useKV } from "@github/spark/hooks"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  Sparkle, 
  Info, 
  Eye, 
  ListChecks, 
  PencilSimple, 
  Pencil, 
  Trash, 
  ChartLine,
  ShoppingBag,
  Stamp
} from "@phosphor-icons/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Selection {
  id: string
  coordinates: {
    left: number
    top: number
    width: number
    height: number
  }
  type: "approval-required" | "open-to-repost"
  publishedBy?: {
    username: string
    editorialId: string
    publishDate: string
  }[]
}

interface MyVizItem {
  id: string
  mediaUrl: string
  mediaType: "photo" | "video"
  title: string
  hashtags: string[]
  creatorId: string
  selections: Selection[]
  createdDate: string
  stats: {
    views: number
    vizListCount: number
    vizItCount: number
  }
}

interface VizLetModalProps {
  item: MyVizItem
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

function VizLetModal({ item, isOpen, onClose, onConfirm }: VizLetModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <div className="relative -mt-6 mb-4 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Stamp size={48} weight="fill" className="text-primary" />
          </div>
        </div>
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Would you like to sell this on Viz.Let?</DialogTitle>
        </DialogHeader>
        <div className="py-4 text-center">
          <p className="text-muted-foreground mb-4">
            Transform your Viz.Listable into a product that others can purchase.
          </p>
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted mb-4">
            <img
              src={item.mediaUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="font-semibold text-foreground">{item.title}</p>
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            className="w-full bg-primary hover:bg-accent text-primary-foreground"
            onClick={onConfirm}
          >
            Yes, Viz.Let it!
          </Button>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            Not Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface MyVizDetailModalProps {
  item: MyVizItem
  isOpen: boolean
  onClose: () => void
  onVizLet: () => void
  onEdit: () => void
  onDelete: () => void
  onViewAnalytics: () => void
}

function MyVizDetailModal({ 
  item, 
  isOpen, 
  onClose, 
  onVizLet, 
  onEdit, 
  onDelete, 
  onViewAnalytics 
}: MyVizDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
            <img
              src={item.mediaUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {item.selections.map((selection) => (
              <div
                key={selection.id}
                className={cn(
                  "absolute border-2 pointer-events-none",
                  selection.type === "open-to-repost" 
                    ? "border-[#98D8AA]" 
                    : "border-[#FFDAB3]"
                )}
                style={{
                  left: `${selection.coordinates.left}%`,
                  top: `${selection.coordinates.top}%`,
                  width: `${selection.coordinates.width}%`,
                  height: `${selection.coordinates.height}%`,
                }}
              />
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Created {new Date(item.createdDate).toLocaleDateString()}
            </p>
            {item.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.hashtags.map((tag, index) => (
                  <span key={index} className="text-sm text-primary">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Eye size={24} className="mx-auto mb-2 text-primary" weight="fill" />
              <p className="text-2xl font-bold text-foreground">{item.stats.views}</p>
              <p className="text-xs text-muted-foreground">Views</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <ListChecks size={24} className="mx-auto mb-2 text-primary" weight="fill" />
              <p className="text-2xl font-bold text-foreground">{item.stats.vizListCount}</p>
              <p className="text-xs text-muted-foreground">Viz.Listed</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <PencilSimple size={24} className="mx-auto mb-2 text-primary" weight="fill" />
              <p className="text-2xl font-bold text-foreground">{item.stats.vizItCount}</p>
              <p className="text-xs text-muted-foreground">Viz.It'd</p>
            </div>
          </div>

          {item.selections.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Selections on this content</h3>
              {item.selections.map((selection, index) => (
                <Card key={selection.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">Selection {index + 1}</p>
                    <Badge 
                      className={cn(
                        "text-xs",
                        selection.type === "open-to-repost" 
                          ? "bg-[#98D8AA] text-[#1A1A1A]" 
                          : "bg-[#FFDAB3] text-[#1A1A1A]"
                      )}
                    >
                      {selection.type === "open-to-repost" ? "Open to Repost" : "Approval Required"}
                    </Badge>
                  </div>
                  
                  {selection.publishedBy && selection.publishedBy.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Published by:</p>
                      {selection.publishedBy.map((pub, pubIndex) => (
                        <div key={pubIndex} className="flex items-center justify-between text-xs">
                          <span className="font-medium text-foreground">@{pub.username}</span>
                          <button className="text-primary hover:underline">
                            View Editorial
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-accent text-primary-foreground"
              onClick={onVizLet}
            >
              <ShoppingBag size={18} className="mr-2" weight="fill" />
              Viz.Let?
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onEdit}
            >
              <Pencil size={18} className="mr-2" />
              Edit
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onViewAnalytics}
            >
              <ChartLine size={18} className="mr-2" />
              View Analytics
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-[#FF6B6B] hover:bg-[#FF6B6B]/10"
              onClick={onDelete}
            >
              <Trash size={18} className="mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function MyVizPage() {
  const [myVizItems, setMyVizItems] = useKV<MyVizItem[]>("my-viz-items", [])
  const [currentUser] = useKV<{ id?: string; username: string; avatar: string; vizBizId?: string } | null>("viz-current-user", null)
  const [selectedItem, setSelectedItem] = useState<MyVizItem | null>(null)
  const [vizLetItem, setVizLetItem] = useState<MyVizItem | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!initialized && currentUser && (!myVizItems || myVizItems.length === 0)) {
      const sampleItems: MyVizItem[] = [
        {
          id: "myviz-sample-1",
          mediaUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=600&fit=crop",
          mediaType: "photo",
          title: "Abstract Watercolor Collection",
          hashtags: ["watercolor", "abstract", "art"],
          creatorId: currentUser.id || currentUser.vizBizId || currentUser.username,
          selections: [
            {
              id: "sel-1",
              coordinates: { left: 10, top: 20, width: 40, height: 35 },
              type: "open-to-repost",
              publishedBy: [
                {
                  username: "artlover_23",
                  editorialId: "edit-1",
                  publishDate: new Date(Date.now() - 86400000).toISOString()
                }
              ]
            },
            {
              id: "sel-2",
              coordinates: { left: 55, top: 40, width: 35, height: 40 },
              type: "approval-required",
              publishedBy: []
            }
          ],
          createdDate: new Date(Date.now() - 172800000).toISOString(),
          stats: {
            views: 342,
            vizListCount: 12,
            vizItCount: 3
          }
        },
        {
          id: "myviz-sample-2",
          mediaUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&h=600&fit=crop",
          mediaType: "photo",
          title: "Geometric Patterns Study",
          hashtags: ["geometric", "design", "minimal"],
          creatorId: currentUser.id || currentUser.vizBizId || currentUser.username,
          selections: [
            {
              id: "sel-3",
              coordinates: { left: 25, top: 25, width: 50, height: 50 },
              type: "open-to-repost",
              publishedBy: []
            }
          ],
          createdDate: new Date(Date.now() - 259200000).toISOString(),
          stats: {
            views: 528,
            vizListCount: 18,
            vizItCount: 5
          }
        }
      ]
      setMyVizItems(sampleItems)
      setInitialized(true)
    }
  }, [initialized, currentUser, myVizItems, setMyVizItems])

  const userVizItems = (myVizItems || []).filter(
    (item) => item.creatorId === (currentUser?.id || currentUser?.vizBizId || currentUser?.username)
  )

  const handleVizLet = (item: MyVizItem) => {
    setSelectedItem(null)
    setVizLetItem(item)
  }

  const handleVizLetConfirm = () => {
    toast.success("Proceeding to Viz.Let listing form...")
    setVizLetItem(null)
  }

  const handleEdit = (item: MyVizItem) => {
    toast.info("Edit functionality coming soon")
    setSelectedItem(null)
  }

  const handleDelete = (item: MyVizItem) => {
    setMyVizItems((current) => (current || []).filter((i) => i.id !== item.id))
    toast.success("Viz.Listable deleted")
    setSelectedItem(null)
  }

  const handleViewAnalytics = (item: MyVizItem) => {
    toast.info("Analytics view coming soon")
    setSelectedItem(null)
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sparkle size={32} weight="fill" className="text-primary" />
          <h1 className="text-3xl font-bold text-foreground">MyViz</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Info size={20} weight="fill" />
                </button>
              </TooltipTrigger>
              <TooltipContent 
                side="right" 
                className="max-w-sm bg-[#FFF0F3] text-foreground border-primary/20 p-4"
              >
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-bold">MyViz:</span> Your original creations that you can sell on Viz.Let
                  </p>
                  <p>
                    <span className="font-bold">Viz.List:</span> Content you've saved from any creator for use in editorials
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-muted-foreground mb-2">Your Viz.Listables</p>
        <p className="text-sm text-muted-foreground">
          {userVizItems.length} Viz.Listable{userVizItems.length !== 1 ? "s" : ""}
        </p>
      </div>

      {userVizItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Sparkle size={80} className="text-muted-foreground mb-4" weight="thin" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No Viz.Listables yet
          </h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Create your first Viz.It with quotable selections to start building your MyViz collection!
          </p>
          <Button 
            className="bg-primary hover:bg-accent text-primary-foreground"
            onClick={() => window.history.back()}
          >
            Create Viz.It
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userVizItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden cursor-pointer group hover:border-primary hover:shadow-lg transition-all"
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative aspect-video">
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {item.selections.map((selection) => (
                  <div
                    key={selection.id}
                    className={cn(
                      "absolute border-2 pointer-events-none",
                      selection.type === "open-to-repost" 
                        ? "border-[#98D8AA]" 
                        : "border-[#FFDAB3]"
                    )}
                    style={{
                      left: `${selection.coordinates.left}%`,
                      top: `${selection.coordinates.top}%`,
                      width: `${selection.coordinates.width}%`,
                      height: `${selection.coordinates.height}%`,
                    }}
                  />
                ))}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                    {item.title}
                  </h3>
                  <Badge className="bg-primary/80 text-white text-xs">
                    {item.selections.length} Selection{item.selections.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                <p className="text-xs text-muted-foreground">
                  Created {new Date(item.createdDate).toLocaleDateString()}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye size={14} weight="fill" />
                    <span>{item.stats.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ListChecks size={14} weight="fill" />
                    <span>{item.stats.vizListCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <PencilSimple size={14} weight="fill" />
                    <span>{item.stats.vizItCount}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedItem && (
        <MyVizDetailModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          onVizLet={() => handleVizLet(selectedItem)}
          onEdit={() => handleEdit(selectedItem)}
          onDelete={() => handleDelete(selectedItem)}
          onViewAnalytics={() => handleViewAnalytics(selectedItem)}
        />
      )}

      {vizLetItem && (
        <VizLetModal
          item={vizLetItem}
          isOpen={!!vizLetItem}
          onClose={() => setVizLetItem(null)}
          onConfirm={handleVizLetConfirm}
        />
      )}
    </div>
  )
}
