import prisma from "@/lib/client"
import CommentList from "./CommentList";
export default async function Comments({ postId, onCommentAdded }: { postId: number, onCommentAdded?: () => void }) {
  const comments = await prisma.comment.findMany({
    where: {
      postId
    },
    include: {
      user: true
    }
  })

  return <>
    <div className="">
      {/* write */}
      <CommentList postId={postId} comments={comments} onCommentAdded={onCommentAdded}></CommentList>
    </div>
  </>
}
