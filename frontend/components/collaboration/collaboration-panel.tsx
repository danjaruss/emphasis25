"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { UserPresence } from "./user-presence"
import { CommentSection } from "./comment-section"
import { ActivityFeed } from "./activity-feed"
import { useCollaboration } from "@/hooks/use-collaboration"
import { Users, MessageSquare, Activity, X } from "lucide-react"

interface CollaborationPanelProps {
  projectId: string
  currentSection?: string
}

export function CollaborationPanel({ projectId, currentSection }: CollaborationPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("comments")

  const { activeUsers, comments, activities, isLoading, addComment } = useCollaboration({
    projectId,
    currentSection,
  })

  return (
    <>
      <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full bg-white shadow-md border-gray-200 hover:bg-gray-100"
          onClick={() => setIsOpen(true)}
        >
          <Users className="h-5 w-5 mr-2" />
          {activeUsers.length} Online
        </Button>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] p-0">
          <SheetHeader className="p-6 pb-2">
            <div className="flex items-center justify-between">
              <SheetTitle>Project Collaboration</SheetTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <UserPresence users={activeUsers} />
          </SheetHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6 pt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="comments" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Comments
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comments" className="mt-4">
              <CommentSection
                comments={comments}
                currentSection={currentSection}
                onAddComment={addComment}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="activity" className="mt-4">
              <ActivityFeed activities={activities} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  )
}
