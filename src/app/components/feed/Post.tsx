import Image from 'next/image';
import Comments from '../feed/Comments';
import { User, Post as PostType } from '@prisma/client';

type FeedPostType = PostType & {
  user: User,
} & {
  likes: [{ userId: string }]
} & {
  _count: {
    comments: number
  }
}
export default function Post({ post }: { post: FeedPostType }) {
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
          <Image src='/more.png'
            width={16} height={16} alt=''></Image>
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
        {/* Interaction */}
        <div className="flex items-center justify-between text-sm my-4">
          <div className='flex gap-8'>
            <div className='flex items-center gap-4 bg-slate-50 p-2 rounded-xl'>
              <Image src='/like.png' width={16} height={16} alt='' className='cursor-pointer'></Image>
              <span className='text-gray-300'>|</span>
              <span className='text-gray-500'>41<span className='hidden md:inline'>Likes</span></span>
            </div>
            <div className='flex items-center gap-4 bg-slate-50 p-2 rounded-xl'>
              <Image src='/comment.png' width={16} height={16} alt='' className='cursor-pointer'></Image>
              <span className='text-gray-300'>|</span>
              <span className='text-gray-500'>41<span className='hidden md:inline'>Commnets</span></span>
            </div>
          </div>
          <div className='flex gap-8'>
            <div className='flex items-center gap-4 bg-slate-50 p-2 rounded-xl'>
              <Image src='/share.png' width={16} height={16} alt='' className='cursor-pointer'></Image>
              <span className='text-gray-300'>|</span>
              <span className='text-gray-500'>41<span className='hidden md:inline'>Shares</span></span>
            </div>
          </div>
        </div>
        <Comments></Comments>
      </div>
    </>
  )
}
