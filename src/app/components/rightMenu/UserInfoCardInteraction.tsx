'use client'

import { switchBlock, switchFollow } from "@/lib/actions"
import { useOptimistic, useState } from "react"

const UserInfoCardInteraction = (
  { userId, isUserBlocked, isFollowing, isFollowingSent }:
    { userId: string, isUserBlocked: boolean, isFollowing: boolean, isFollowingSent: boolean }
) => {

  const [userState, setUserState] = useState({
    following: isFollowing,
    blocked: isUserBlocked,
    followingRequestSent: isFollowingSent,
  })

  const [optimisticState, switchOptimisticState] = useOptimistic(
    userState,
    (state, value: 'follow' | 'block') => value === 'follow'
      ? {
        ...state,
        following: false,
        followingRequestSent: state.following || state.followingRequestSent ? false : true,
      }
      : {
        ...state,
        blocked: !state.blocked
      }
  )

  const block = async () => {
    switchOptimisticState('block')
    try {
      await switchBlock(userId)
      setUserState((prev) => ({
        ...prev,
        blocked: !prev.blocked
      }))
    } catch (error) {

    }
  }


  const follow = async () => {
    switchOptimisticState('follow')
    try {
      const nextState = await switchFollow(userId)
      setUserState(prev => ({
        ...prev,
        following: nextState.following,
        followingRequestSent: nextState.followingRequestSent,
      }))
    } catch (error) {

    }
  }



  return <>
    <form action={follow}>
      <button className="w-full bg-blue-500 text-white text-sm rounded-md p-1">
        {optimisticState.following ? 'Friends' : optimisticState.followingRequestSent ? 'Friend Request Sent' : 'Add Friend'}
      </button>
    </form>
    <form action={block} className="self-end">
      <button>
        <span className="text-red-400  text-xs cursor-pointer">
          {optimisticState.blocked ? 'Unblock User' : 'Block User'}
        </span>
      </button>
    </form>
  </>
}

export default UserInfoCardInteraction
