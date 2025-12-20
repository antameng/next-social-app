"use client"
import { addComment } from "@/lib/actions"
import { useUser } from "@clerk/nextjs"
import { User, Comment } from "@prisma/client"
import Image from "next/image"
import { useOptimistic, useState } from "react"

type CommentWithUser = Comment & {
  user: User
}
const CommentList = ({ postId, comments }: { postId: number, comments: CommentWithUser[] }) => {

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
      setCommentState((prev) => [createdComment, ...prev]); // 更新真实状态
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
          <input onChange={(e) => setDesc(e.target.value)} type="text" placeholder="write a comment..." className="bg-transparent outline-none flex-1"></input>
          <Image src='/emoji.png' className="cursor-pointer"
            alt="" width={16} height={16}></Image>
        </form>
      </div>)}

      <div className="">
        {optimisticComments.map(comment => (<div key={comment.id} className="flex gap-4 justify-between mt-6">
          {/* 头像 */}
          <Image className="w-10 h-10 rounded-full" alt='' width={40} height={40} src={comment.user.avatar || '/noAvatar.png'}></Image>
          {/* 描述 */}
          <div className="flex flex-1 flex-col gap-2">
            <span className="font-semibold">{comment.user.name && comment.user.surname ? comment.user.name + ' ' + comment.user.surname : comment.user.username}</span>
            <p>{comment.content}</p>
            <div className="flex items-center gap-8 text-xs text-gray-500 mt-2">
              <div className="flex items-center gap-4">
                <Image src='/like.png' alt=""
                  width={12} height={12}
                  className="cursor-pointer"
                >
                </Image>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">123 Likes</span>
              </div>
              <div className="">Reply</div>
            </div>
          </div>
          {/* ICON */}
          <Image src='/more.png' alt="" width={16} height={16} className="cursor-pointer w-4 h-4"></Image>
        </div>))}
      </div>
    </>
  );
}

export default CommentList;

