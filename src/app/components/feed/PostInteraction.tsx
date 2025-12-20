"use client"

import Comments from "@/app/components/feed/Comments";
import { switchLike } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useOptimistic, useState } from "react";
export const PostInteraction = ({ postId, likes, commentNumber, onCommentAdded }: { postId: number, likes: string[], commentNumber: number, onCommentAdded?: () => void }) => {

  const { isLoaded, userId } = useAuth();
  const [likeState, setLikeState] = useState<any>({
    likeCount: likes.length,
    isLiked: userId ? likes.includes(userId!) : false
  });

  const [optimisticLike, switchOptimisticLike] = useOptimistic(likeState, (state, value) => {
    return {
      likes: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
      isLiked: !state.isLiked
    }
  });

  const likeAction = async () => {
    if (!isLoaded) return;
    switchOptimisticLike("");
    try {
      switchLike(postId);
      setLikeState((state: any) => ({
        likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
        isLiked: !state.isLiked
      }));
    } catch (error) {
      throw new Error('Like action failed');
    }
  }

  return (
    <div className="flex items-center justify-between text-sm my-4">
      <div className='flex gap-8'>
        <div className='flex items-center gap-4 bg-slate-50 p-2 rounded-xl'>
          <form action={likeAction}>
            <button>
              <Image src={optimisticLike.isLiked ? '/liked.png' : '/like.png'} width={16} height={16} alt='' className='cursor-pointer'></Image>
            </button>
          </form>
          <span className='text-gray-300'>|</span>
          <span className='text-gray-500'>{optimisticLike.likeCount}<span className='hidden md:inline'> Likes</span></span>
        </div>
        <div className='flex items-center gap-4 bg-slate-50 p-2 rounded-xl'>
          <Image src='/comment.png' width={16} height={16} alt='' className='cursor-pointer'></Image>
          <span className='text-gray-300'>|</span>
          <span className='text-gray-500'>{commentNumber}<span className='hidden md:inline'> Comments</span></span>
        </div>
      </div>
      <div className='flex gap-8'>
        <div className='flex items-center gap-4 bg-slate-50 p-2 rounded-xl'>
          <Image src='/share.png' width={16} height={16} alt='' className='cursor-pointer'></Image>
          <span className='text-gray-300'>|</span>
          <span className='text-gray-500'>41<span className='hidden md:inline'> Shares</span></span>
        </div>
      </div>
    </div>
  )
}
