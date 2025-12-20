import Image from 'next/image';
import { User, Post as PostType } from '@prisma/client';
import { PostInteraction } from "@/app/components/feed/PostInteraction";
import { Suspense } from 'react';
import { PostInfo } from './PostInfo';
import { auth } from '@clerk/nextjs/server';
import { PostWithInteraction } from './PostWithInteraction';
import prisma from "@/lib/client";

type FeedPostType = PostType & {
  user: User,
} & {
  likes: [{ userId: string }]
} & {
  _count: {
    comments: number
  }
}
export default async function Post({ post }: { post: FeedPostType }) {
  const { userId } = await auth();

  // Fetch comments on the server
  const comments = await prisma.comment.findMany({
    where: {
      postId: post.id
    },
    include: {
      user: true
    }
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* User */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src={post.user.avatar || '/noAvator.png'}
              width={40} height={40} alt='' className='w-10 h-10 rounded-full'></Image>
            <span className='font-medium'>{post.user.name && post.user.surname ? post.user.name + ' ' + post.user.username : post.user.username}</span>
          </div>
          {userId === post.user.id && <PostInfo postId={post.id}></PostInfo>}
        </div>
        {/* Desc */}
        <div className="flex flex-col gap-4">
          {post.img && <div className='w-full min-h-96 relative'>
            <Image src={post.img}
              fill alt=''
              className='object-cover rounded-md'
            ></Image>
          </div>}
          <p>{post.desc}</p>
        </div>
        {/* Interaction and Comments - wrapped together */}
        <PostWithInteraction
          postId={post.id}
          likes={post.likes.map(like => like.userId)}
          commentNumber={post._count.comments}
          initialComments={comments}
        />
      </div>
    </>
  )
}
