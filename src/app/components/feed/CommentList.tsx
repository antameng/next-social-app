"use client"
import { addComment } from "@/lib/actions"
import { useUser } from "@clerk/nextjs"
import { User, Comment } from "@prisma/client"
import Image from "next/image"
import { useOptimistic, useState } from "react"
import CommentItem from "./CommentItem"

type CommentWithUser = Comment & {
  user: User
  replyToUser?: User | null
}
const CommentList = ({ postId, comments, onCommentAdded }: { postId: number, comments: CommentWithUser[], onCommentAdded?: () => void }) => {

  const { user } = useUser() // 获取当前登录用户信息
  const [commentState, setCommentState] = useState(comments); // 初始化评论状态
  const [desc, setDesc] = useState<string>(""); // 初始化评论输入框状态  受控组件


  const [optimisticComments, addOptimisticComments] = useOptimistic(commentState, (state, value: CommentWithUser) => { // state是以前的状态
    return [value, ...state]; // 新评论添加到最前面
  });


  const add = async () => {
    if (!user || !desc.trim()) return;
    // 创建一个临时的评论对象 用于乐观更新
    addOptimisticComments({
      id: Math.random(), // 临时ID
      content: desc,
      postId: postId,
      userId: user.id,
      parentId: null,
      rootId: null,
      replyToUserId: null,
      status: 'VISIBLE' as const,
      likeCount: 0,
      replyCount: 0,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      user: {
        id: user.id,
        username: 'Sending Please wait...',
        email: null,
        phone: null,
        password: null,
        avatar: user.imageUrl || '/noAvatar.png',
        cover: '/noCover.png',
        name: null,
        surname: null,
        bio: null,
        website: null,
        location: null,
        birthday: null,
        isPrivate: false,
        isVerified: false,
        role: 'USER' as const,
        status: 'ACTIVE' as const,
        postCount: 0,
        followerCount: 0,
        followingCount: 0,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
      }
    })
    try {
      const createdComment = await addComment(postId, desc); // 调用后端函数添加评论
      setDesc(""); // 清空输入框
      // 更新真实状态，使用 Clerk 的最新头像覆盖数据库返回的头像
      setCommentState((prev) => [{
        ...createdComment,
        user: {
          ...createdComment.user,
          avatar: user.imageUrl || createdComment.user.avatar
        }
      } as CommentWithUser, ...prev]);
      // Call the callback to update the comment count
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {

    }

  }
  return (
    <>
      {user && (<div className="flex items-center gap-4">
        <Image className="w-8 h-8 rounded-full" alt=''
          width={32} height={32}
          src={user?.imageUrl || '/noAvatar.png'}
        ></Image>
        <form action={add} className="flex-1 flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full">
          <input onChange={(e) => setDesc(e.target.value)} value={desc} type="text" placeholder="write a comment..." className="bg-transparent outline-none flex-1"></input>
          <Image src='/emoji.png' className="cursor-pointer"
            alt="" width={16} height={16}></Image>
        </form>
      </div>)}

      <div className="">
        {optimisticComments.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postId={postId}
            onCommentAdded={onCommentAdded}
          />
        ))}
      </div>
    </>
  );
}

export default CommentList;

