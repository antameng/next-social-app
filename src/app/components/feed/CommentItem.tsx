"use client"
import { addComment, getReplies } from "@/lib/actions"
import { useUser } from "@clerk/nextjs"
import { User, Comment } from "@prisma/client"
import Image from "next/image"
import { useState, useTransition, useRef, useEffect } from "react"

type CommentWithUser = Comment & {
  user: User
  replyToUser?: User | null
}

type CommentItemProps = {
  comment: CommentWithUser
  postId: number
  onCommentAdded?: () => void
}

const CommentItem = ({ comment, postId, onCommentAdded }: CommentItemProps) => {
  const { user } = useUser()
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [replies, setReplies] = useState<CommentWithUser[]>([])
  const [showReplies, setShowReplies] = useState(false)
  const [replyPage, setReplyPage] = useState(1)
  const [hasMoreReplies, setHasMoreReplies] = useState(false)
  const [totalReplies, setTotalReplies] = useState(comment.replyCount)
  const [isPending, startTransition] = useTransition()

  // 添加引用
  const replyFormRef = useRef<HTMLDivElement>(null)
  const replyInputRef = useRef<HTMLInputElement>(null)

  // 点击外部区域隐藏回复框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (replyFormRef.current && !replyFormRef.current.contains(event.target as Node)) {
        setShowReplyForm(false)
        setReplyText("") // 重置文本
      }
    }

    if (showReplyForm) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showReplyForm])

  // 当打开回复框时自动聚焦
  useEffect(() => {
    if (showReplyForm && replyInputRef.current) {
      replyInputRef.current.focus()
    }
  }, [showReplyForm])

  const loadReplies = async (page: number = 1) => {
    try {
      const result = await getReplies(comment.id, page, 9)
      if (page === 1) {
        setReplies(result.replies as CommentWithUser[])
      } else {
        setReplies(prev => [...prev, ...(result.replies as CommentWithUser[])])
      }
      setHasMoreReplies(result.hasMore)
      setTotalReplies(result.total)
      setReplyPage(page)
    } catch (error) {
      console.error('Failed to load replies:', error)
    }
  }

  const handleShowReplies = async () => {
    if (!showReplies && replies.length === 0) {
      await loadReplies(1)
    }
    setShowReplies(!showReplies)
  }

  const handleLoadMore = async () => {
    await loadReplies(replyPage + 1)
  }

  const handleReply = async () => {
    if (!user || !replyText.trim()) return

    startTransition(async () => {
      try {
        const createdReply = await addComment(postId, replyText, comment.id, comment.userId)
        setReplyText("")
        setShowReplyForm(false)

        // Add the new reply to the list
        setReplies(prev => [createdReply as CommentWithUser, ...prev])
        setTotalReplies(prev => prev + 1)
        setShowReplies(true)

        if (onCommentAdded) {
          onCommentAdded()
        }
      } catch (error) {
        console.error('Failed to add reply:', error)
      }
    })
  }

  const displayName = comment.user.name && comment.user.surname
    ? `${comment.user.name} ${comment.user.surname}`
    : comment.user.username

  // Show first 2 replies by default when expanded
  const visibleReplies = showReplies ? replies : replies.slice(0, 2)
  const hiddenRepliesCount = replies.length - visibleReplies.length

  return (
    <div className="flex gap-4 justify-between mt-6">
      {/* Avatar */}
      <Image
        className="w-10 h-10 rounded-full"
        alt=''
        width={40}
        height={40}
        src={comment.user.avatar || '/noAvatar.png'}
      />

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{displayName}</span>
          {comment.user.isVerified && (
            <span className="bg-red-500 text-white text-xs px-1 rounded">UP主</span>
          )}
        </div>

        {comment.replyToUser && (
          <p className="text-sm">
            <span className="text-gray-500">回复 </span>
            <span className="text-blue-500">@{comment.replyToUser.username}</span>
            <span className="ml-2">{comment.content}</span>
          </p>
        )}

        {!comment.replyToUser && <p>{comment.content}</p>}

        <div className="flex items-center gap-8 text-xs text-gray-500 mt-2">
          <span>{new Date(comment.createdAt).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>

          <div className="flex items-center gap-4 cursor-pointer">
            <Image src='/like.png' alt="" width={12} height={12} />
            <span className="text-gray-500">{comment.likeCount}</span>
          </div>

          <div
            className="cursor-pointer hover:text-blue-500"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            回复
          </div>
        </div>

        {/* Reply Input Form */}
        {showReplyForm && user && (
          <div ref={replyFormRef} className="flex items-center gap-2 mt-2">
            <Image
              className="w-8 h-8 rounded-full"
              alt=''
              width={32}
              height={32}
              src={user.imageUrl || '/noAvatar.png'}
            />
            <div className="flex-1 flex items-center justify-between bg-slate-100 rounded-xl text-sm px-4 py-2">
              <input
                ref={replyInputRef}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                type="text"
                placeholder={`回复 @${comment.user.username}...`}
                className="bg-transparent outline-none flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleReply()
                  }
                }}
              />
              <button
                onClick={handleReply}
                disabled={isPending || !replyText.trim()}
                className="text-blue-500 text-sm disabled:opacity-50"
              >
                {isPending ? '发送中...' : '发送'}
              </button>
            </div>
          </div>
        )}

        {/* Show Replies Toggle */}
        {totalReplies > 0 && (
          <div className="mt-2">
            <button
              onClick={handleShowReplies}
              className="text-blue-500 text-sm flex items-center gap-1"
            >
              {showReplies ? '收起' : `共${totalReplies}条回复`}
              {!showReplies && totalReplies > 0 && <span>, 点击查看</span>}
            </button>
          </div>
        )}

        {/* Nested Replies */}
        {showReplies && replies.length > 0 && (
          <div className="mt-4 space-y-4 border-l-2 border-gray-200 pl-4">
            {visibleReplies.map(reply => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                onCommentAdded={onCommentAdded}
              />
            ))}

            {hasMoreReplies && (
              <button
                onClick={handleLoadMore}
                className="text-blue-500 text-sm hover:underline"
              >
                加载更多回复...
              </button>
            )}
          </div>
        )}

        {/* Show hidden replies count when collapsed */}
        {!showReplies && replies.length > 2 && (
          <button
            onClick={handleShowReplies}
            className="text-blue-500 text-sm mt-2"
          >
            还有{hiddenRepliesCount}条回复，点击查看
          </button>
        )}
      </div>

      {/* More Options Icon */}
      <Image
        src='/more.png'
        alt=""
        width={16}
        height={16}
        className="cursor-pointer w-4 h-4"
      />
    </div>
  )
}

export default CommentItem
