"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { ProjectComment } from "@/hooks/use-collaboration"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, Send, Reply } from "lucide-react"

interface CommentSectionProps {
  comments: ProjectComment[]
  currentSection?: string
  onAddComment: (content: string, section?: string, parentId?: string) => Promise<void>
  isLoading?: boolean
}

export function CommentSection({ comments, currentSection, onAddComment, isLoading = false }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    await onAddComment(newComment, currentSection)
    setNewComment("")
    setIsSubmitting(false)
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return

    setIsSubmitting(true)
    await onAddComment(replyContent, currentSection, parentId)
    setReplyContent("")
    setReplyingTo(null)
    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Comments {currentSection ? `for ${currentSection}` : ""}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="resize-none"
            disabled={isSubmitting}
          />
          <Button
            size="icon"
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || isSubmitting}
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="py-4 text-center text-sm text-gray-500">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="py-4 text-center text-sm text-gray-500">No comments yet</div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-2">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user?.avatar_url || undefined} />
                    <AvatarFallback>
                      {comment.user?.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{comment.user?.full_name}</span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      >
                        <Reply className="h-3 w-3 mr-1" />
                        Reply
                      </Button>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>

                {/* Reply form */}
                {replyingTo === comment.id && (
                  <div className="ml-11 mt-2 flex space-x-2">
                    <Textarea
                      placeholder="Write a reply..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="resize-none text-sm"
                      disabled={isSubmitting}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={!replyContent.trim() || isSubmitting}
                      className="self-end"
                    >
                      Reply
                    </Button>
                  </div>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-11 space-y-3 pt-2">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start space-x-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={reply.user?.avatar_url || undefined} />
                          <AvatarFallback>
                            {reply.user?.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{reply.user?.full_name}</span>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Separator className="my-4" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
