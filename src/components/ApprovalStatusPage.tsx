import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldAvatar } from "./ShieldAvatar"
import { Stamp, Tray } from "@phosphor-icons/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ApprovalRequest {
  id: string
  requesterId: string
  requesterUsername: string
  requesterAvatar: string
  creatorId: string
  creatorUsername: string
  creatorAvatar: string
  contentId: string
  contentThumbnail: string
  selectionArea: {
    left: number
    top: number
    width: number
    height: number
  }
  requestDate: string
  status: "pending" | "approved" | "declined"
}

export function ApprovalStatusPage() {
  const [approvalRequests, setApprovalRequests] = useKV<ApprovalRequest[]>("approval-requests", [])
  const [currentUser] = useKV<{ id?: string; username: string; avatar: string; vizBizId?: string } | null>("viz-current-user", null)

  const seedDemoRequests = () => {
    if (!currentUser) {
      toast.error("Please log in to see demo requests")
      return
    }

    const userId = currentUser.id || currentUser.vizBizId || currentUser.username

    const demoRequests: ApprovalRequest[] = [
      {
        id: `demo-request-1-${Date.now()}`,
        requesterId: "user-123",
        requesterUsername: "artlover99",
        requesterAvatar: "https://i.pravatar.cc/150?img=10",
        creatorId: userId,
        creatorUsername: currentUser.username,
        creatorAvatar: currentUser.avatar,
        contentId: "post-demo-1",
        contentThumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop",
        selectionArea: {
          left: 20,
          top: 30,
          width: 40,
          height: 35
        },
        requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending"
      },
      {
        id: `demo-request-2-${Date.now()}`,
        requesterId: "user-456",
        requesterUsername: "creative_minds",
        requesterAvatar: "https://i.pravatar.cc/150?img=14",
        creatorId: userId,
        creatorUsername: currentUser.username,
        creatorAvatar: currentUser.avatar,
        contentId: "post-demo-2",
        contentThumbnail: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&h=800&fit=crop",
        selectionArea: {
          left: 30,
          top: 30,
          width: 40,
          height: 40
        },
        requestDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        status: "pending"
      }
    ]

    setApprovalRequests((current) => [...(current || []), ...demoRequests])
    toast.success("Demo requests added!")
  }

  const handleApprove = (requestId: string) => {
    setApprovalRequests((current) =>
      (current || []).map((req) =>
        req.id === requestId ? { ...req, status: "approved" as const } : req
      )
    )
    toast.success("Request approved!")
  }

  const handleDecline = (requestId: string) => {
    setApprovalRequests((current) =>
      (current || []).map((req) =>
        req.id === requestId ? { ...req, status: "declined" as const } : req
      )
    )
    toast.success("Request declined")
  }

  const incomingRequests = (approvalRequests || []).filter(
    (req) => req.creatorId === (currentUser?.id || currentUser?.vizBizId || currentUser?.username)
  )
  const pendingIncoming = incomingRequests.filter((req) => req.status === "pending")

  const myRequests = (approvalRequests || []).filter(
    (req) => req.requesterId === (currentUser?.id || currentUser?.vizBizId || currentUser?.username)
  )

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
    } else {
      return "Just now"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-[#FFDAB3] text-[#1A1A1A]"
      case "approved":
        return "bg-[#98D8AA] text-[#1A1A1A]"
      case "declined":
        return "bg-[#FF6B6B] text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="w-full max-w-[800px] mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Stamp size={32} weight="fill" className="text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Approval Status</h1>
          </div>
          {currentUser && (
            <Button
              size="sm"
              variant="outline"
              onClick={seedDemoRequests}
              className="text-xs"
            >
              Add Demo Requests
            </Button>
          )}
        </div>
        <p className="text-muted-foreground">Manage requests for your quotable content</p>
      </div>

      <Tabs defaultValue="incoming" className="w-full">
        <TabsList className="w-full border-b border-border rounded-none h-auto p-0 bg-transparent mb-6">
          <TabsTrigger
            value="incoming"
            className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
          >
            <span className="font-semibold">Incoming Requests</span>
            {pendingIncoming.length > 0 && (
              <Badge className="ml-2 bg-[#FF6B6B] text-white rounded-full px-2 py-0 text-xs">
                {pendingIncoming.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="my-requests"
            className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
          >
            <span className="font-semibold">My Requests</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="mt-0">
          {pendingIncoming.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Tray size={80} className="text-muted-foreground mb-4" weight="thin" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No pending requests</h3>
              <p className="text-muted-foreground max-w-md">
                When someone wants to Viz.List your content, you'll see it here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingIncoming.map((request) => (
                <Card key={request.id} className="p-4 border border-border">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <ShieldAvatar
                        src={request.requesterAvatar}
                        alt={request.requesterUsername}
                        size="medium"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-foreground">
                            {request.requesterUsername}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Requested {getRelativeTime(request.requestDate)}
                          </p>
                        </div>
                      </div>

                      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4 bg-muted">
                        <img
                          src={request.contentThumbnail}
                          alt="Content"
                          className="w-full h-full object-cover"
                        />
                        <div
                          className="absolute border-2 border-[#FFDAB3] pointer-events-none"
                          style={{
                            left: `${request.selectionArea.left}%`,
                            top: `${request.selectionArea.top}%`,
                            width: `${request.selectionArea.width}%`,
                            height: `${request.selectionArea.height}%`,
                          }}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApprove(request.id)}
                          className="flex-1 bg-[#98D8AA] hover:bg-[#88c89a] text-white font-semibold"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleDecline(request.id)}
                          className="flex-1 bg-[#FF6B6B] hover:bg-[#ff5555] text-white font-semibold"
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-requests" className="mt-0">
          {myRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Tray size={80} className="text-muted-foreground mb-4" weight="thin" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                You haven't made any requests yet
              </h3>
              <p className="text-muted-foreground max-w-md">
                Browse the feed and tap on content to add to your Viz.List
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map((request) => (
                <Card key={request.id} className="p-4 border border-border">
                  <div className="flex gap-4">
                    <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={request.contentThumbnail}
                        alt="Content"
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute border-2 border-[#FFDAB3] pointer-events-none"
                        style={{
                          left: `${request.selectionArea.left}%`,
                          top: `${request.selectionArea.top}%`,
                          width: `${request.selectionArea.width}%`,
                          height: `${request.selectionArea.height}%`,
                        }}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <ShieldAvatar
                            src={request.creatorAvatar}
                            alt={request.creatorUsername}
                            size="small"
                          />
                          <p className="font-semibold text-foreground">
                            {request.creatorUsername}
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            "font-semibold capitalize",
                            getStatusBadgeColor(request.status)
                          )}
                        >
                          {request.status}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4">
                        Requested {getRelativeTime(request.requestDate)}
                      </p>

                      {request.status === "approved" && (
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          Use in Viz.It
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
