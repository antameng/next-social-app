import prisma from "@/lib/client"
import CommentList from "./CommentList";
export default async function Comments({ postId, onCommentAdded }: { postId: number, onCommentAdded?: () => void }) {
  // Only fetch root comments (parentId is null)
  const comments = await prisma.comment.findMany({
    where: {
      postId,
      parentId: null, // Only root comments
    },
    include: {
      user: true,
      replyToUser: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return <>
    <div className="">
      {/* write */}
      <CommentList postId={postId} comments={comments} onCommentAdded={onCommentAdded}></CommentList>
    </div>
  </>
}
